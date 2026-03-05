// Metadata extraction from images and sidecar files

import exifr from 'exifr';
import { promises as fs } from 'fs';
import { extname, basename, dirname, join } from 'path';
import { PhotoMetadata, RAW_EXTENSIONS } from './types';

interface ExifData {
  // Date fields
  DateTimeOriginal?: Date;
  DateTimeDigitized?: Date;
  DateTime?: string;
  CreateDate?: Date;
  ModifyDate?: Date;
  
  // Location fields
  GPSLatitude?: number;
  GPSLongitude?: number;
  GPSLatitudeRef?: string;
  GPSLongitudeRef?: string;
  Country?: string;
  State?: string;
  City?: string;
  SubLocation?: string;
  Location?: string;
  
  // Camera fields
  Make?: string;
  Model?: string;
  LensModel?: string;
  LensMake?: string;
  FocalLength?: number;
  FNumber?: number;
  ExposureTime?: number | string;
  ISO?: number;
  ExposureProgram?: number;
  MeteringMode?: number;
  Flash?: number;
  
  // Image fields
  ImageWidth?: number;
  ImageHeight?: number;
  ExifImageWidth?: number;
  ExifImageHeight?: number;
  Orientation?: number;
  ColorSpace?: number;
  
  // XMP fields
  Rating?: number;
  Label?: string;
  Subject?: string | string[];
  Description?: string;
  Creator?: string;
  Rights?: string;
  
  // RAW fields
  RawFileName?: string;
  FileType?: number;
  FileTypeExtension?: string;
}

interface XmpData {
  rating?: number;
  label?: string;
  subject?: string[];
  description?: string;
  creator?: string;
  rights?: string;
  keywords?: string[];
  ratingpercent?: number;
  xmpRating?: number;
}

/**
 * Extract metadata from an image file
 */
export async function extractMetadata(
  filePath: string,
  sidecarPath?: string | null
): Promise<PhotoMetadata> {
  const ext = extname(filePath).toLowerCase();
  const fileName = basename(filePath);
  
  // Get file stats
  const stats = await fs.stat(filePath);
  
  // Extract EXIF from image
  const exifData = await extractExif(filePath);
  
  // Extract XMP from sidecar if available
  let xmpData: XmpData = {};
  if (sidecarPath) {
    xmpData = await extractXmp(sidecarPath);
  } else {
    // Try to find sidecar in same directory
    const foundSidecar = await findSidecar(filePath);
    if (foundSidecar) {
      xmpData = await extractXmp(foundSidecar);
    }
  }
  
  // Build metadata object
  const metadata: PhotoMetadata = {
    // File info
    fileName,
    filePath,
    fileSize: stats.size,
    fileType: getMimeType(ext),
    fileModified: stats.mtime,
    
    // Date/Time info
    dateTaken: exifData.DateTimeOriginal || exifData.CreateDate || null,
    dateOriginal: exifData.DateTimeOriginal || null,
    dateDigitized: exifData.DateTimeDigitized || null,
    
    // Location info
    latitude: convertGPS(exifData.GPSLatitude, exifData.GPSLatitudeRef),
    longitude: convertGPS(exifData.GPSLongitude, exifData.GPSLongitudeRef),
    location: exifData.Location || exifData.SubLocation || null,
    city: exifData.City || null,
    state: exifData.State || null,
    country: exifData.Country || null,
    
    // Camera info
    cameraMake: exifData.Make || null,
    cameraModel: exifData.Model || null,
    lensModel: exifData.LensModel || exifData.LensMake || null,
    focalLength: exifData.FocalLength || null,
    aperture: exifData.FNumber || null,
    shutterSpeed: formatShutterSpeed(exifData.ExposureTime),
    iso: exifData.ISO || null,
    
    // Image info
    width: exifData.ExifImageWidth || exifData.ImageWidth || null,
    height: exifData.ExifImageHeight || exifData.ImageHeight || null,
    orientation: exifData.Orientation || null,
    colorSpace: parseColorSpace(exifData.ColorSpace),
    
    // XMP sidecar info
    hasSidecar: !!sidecarPath,
    sidecarPath: sidecarPath || null,
    
    // Rating and tags
    rating: xmpData.rating || xmpData.xmpRating || xmpData.ratingpercent || null,
    tags: parseTags(xmpData.subject || xmpData.keywords),
    
    // Raw format info
    isRaw: RAW_EXTENSIONS.has(ext),
    rawFormat: getRawFormat(ext)
  };
  
  return metadata;
}

/**
 * Extract EXIF data from an image file
 */
async function extractExif(filePath: string): Promise<ExifData> {
  try {
    // Configure exifr to extract various metadata
    const options = {
      // Basic EXIF
      tiff: true,
      exif: true,
      gps: true,
      icc: false,
      iptc: true,
      xmp: true,
      interop: true,
      // Merge values
      mergeOutput: true,
      // Translate values
      translateValues: true,
      // Include thumbnail
      thumbnail: false,
    };
    
    const data = await exifr.parse(filePath, options);
    return data || {};
  } catch (error) {
    console.error(`Error extracting EXIF from ${filePath}:`, error);
    return {};
  }
}

/**
 * Extract XMP data from a sidecar file
 */
async function extractXmp(sidecarPath: string): Promise<XmpData> {
  try {
    const content = await fs.readFile(sidecarPath, 'utf-8');
    
    // Parse XMP rating
    const ratingMatch = content.match(/xmp:Rating[=>"']+(\d+)/) || 
                        content.match(/<xmp:Rating>(\d+)<\/xmp:Rating>/) ||
                        content.match(/<rating>(\d+)<\/rating>/);
    
    // Parse XMP subject/keywords
    const subjectMatch = content.match(/<dc:subject>[\s\S]*?<\/dc:subject>/);
    let keywords: string[] = [];
    if (subjectMatch) {
      const keywordMatches = subjectMatch[0].match(/<rdf:li[^>]*>([^<]+)<\/rdf:li>/g);
      if (keywordMatches) {
        keywords = keywordMatches.map(k => k.replace(/<rdf:li[^>]*>([^<]+)<\/rdf:li>/, '$1').trim());
      }
    }
    
    // Parse description
    const descMatch = content.match(/<dc:description[^>]*>[\s\S]*?<rdf:Alt[^>]*>[\s\S]*?<rdf:li[^>]*>([^<]+)<\/rdf:li>/);
    
    return {
      rating: ratingMatch ? parseInt(ratingMatch[1], 10) : undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
      description: descMatch ? descMatch[1] : undefined
    };
  } catch (error) {
    console.error(`Error extracting XMP from ${sidecarPath}:`, error);
    return {};
  }
}

/**
 * Find sidecar file for an image
 */
async function findSidecar(imagePath: string): Promise<string | null> {
  const dir = dirname(imagePath);
  const baseName = basename(imagePath, extname(imagePath));
  
  // Common sidecar extensions
  const sidecarExtensions = ['.xmp', '.xml'];
  
  for (const ext of sidecarExtensions) {
    const sidecarPath = join(dir, baseName + ext);
    try {
      await fs.access(sidecarPath);
      return sidecarPath;
    } catch {
      continue;
    }
  }
  
  return null;
}

/**
 * Convert GPS coordinate with reference
 */
function convertGPS(coord: number | undefined, ref: string | undefined): number | null {
  if (coord === undefined || coord === null) return null;
  
  let value = coord;
  if (ref === 'S' || ref === 'W') {
    value = -value;
  }
  
  return value;
}

/**
 * Format shutter speed
 */
function formatShutterSpeed(exposure: number | string | undefined): string | null {
  if (exposure === undefined || exposure === null) return null;
  
  if (typeof exposure === 'string') {
    // Already formatted as string (e.g., "1/250")
    return exposure;
  }
  
  if (exposure >= 1) {
    return `${exposure}s`;
  }
  
  // Convert to fraction
  const denominator = Math.round(1 / exposure);
  return `1/${denominator}`;
}

/**
 * Parse color space
 */
function parseColorSpace(colorSpace: number | undefined): string | null {
  if (colorSpace === undefined || colorSpace === null) return null;
  
  switch (colorSpace) {
    case 1:
      return 'sRGB';
    case 65535:
      return 'Uncalibrated';
    default:
      return `Unknown (${colorSpace})`;
  }
}

/**
 * Parse tags from various formats
 */
function parseTags(subject: string | string[] | undefined): string[] {
  if (!subject) return [];
  
  if (typeof subject === 'string') {
    return [subject];
  }
  
  return subject;
}

/**
 * Get MIME type from extension
 */
function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
    '.cr2': 'image/x-canon-cr2',
    '.cr3': 'image/x-canon-cr3',
    '.nef': 'image/x-nikon-nef',
    '.arw': 'image/x-sony-arw',
    '.orf': 'image/x-olympus-orf',
    '.rw2': 'image/x-panasonic-rw2',
    '.dng': 'image/x-adobe-dng',
    '.raf': 'image/x-fuji-raf',
    '.srw': 'image/x-samsung-srw'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Get raw format name
 */
function getRawFormat(ext: string): string | null {
  const rawFormats: Record<string, string> = {
    '.cr2': 'Canon CR2',
    '.cr3': 'Canon CR3',
    '.nef': 'Nikon NEF',
    '.arw': 'Sony ARW',
    '.orf': 'Olympus ORF',
    '.rw2': 'Panasonic RW2',
    '.dng': 'Adobe DNG',
    '.raf': 'Fuji RAF',
    '.srw': 'Samsung SRW'
  };
  
  return rawFormats[ext] || null;
}
