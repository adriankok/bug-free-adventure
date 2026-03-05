// Photo metadata types

export interface PhotoMetadata {
  // File info
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  fileModified: Date;
  
  // Date/Time info
  dateTaken: Date | null;
  dateOriginal: Date | null;
  dateDigitized: Date | null;
  
  // Location info
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  
  // Camera info
  cameraMake: string | null;
  cameraModel: string | null;
  lensModel: string | null;
  focalLength: number | null;
  aperture: number | null;
  shutterSpeed: string | null;
  iso: number | null;
  
  // Image info
  width: number | null;
  height: number | null;
  orientation: number | null;
  colorSpace: string | null;
  
  // XMP sidecar info
  hasSidecar: boolean;
  sidecarPath: string | null;
  
  // Rating and tags
  rating: number | null;
  tags: string[];
  
  // Raw format info
  isRaw: boolean;
  rawFormat: string | null;
}

export interface PhotoIndex {
  id: string;
  folderPath: string;
  totalPhotos: number;
  indexedAt: Date;
  photos: PhotoMetadata[];
}

export interface IndexByTime {
  [year: number]: {
    [month: number]: PhotoMetadata[];
  };
}

export interface IndexByLocation {
  [country: string]: {
    [state: string]: {
      [city: string]: PhotoMetadata[];
    };
  };
}

export interface FolderStats {
  totalPhotos: number;
  totalRaw: number;
  totalJpg: number;
  totalHeic: number;
  dateRange: {
    earliest: Date | null;
    latest: Date | null;
  };
  locations: {
    country: string | null;
    state: string | null;
    city: string | null;
  }[];
}

// Supported image formats
export const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.tif',
  '.heic', '.heif',
  '.cr2', '.cr3', '.nef', '.arw', '.orf', '.rw2', '.dng', '.raf', '.srw'
]);

export const RAW_EXTENSIONS = new Set([
  '.cr2', '.cr3', '.nef', '.arw', '.orf', '.rw2', '.dng', '.raf', '.srw'
]);

export const SIDECAR_EXTENSIONS = new Set([
  '.xmp', '.xml'
]);
