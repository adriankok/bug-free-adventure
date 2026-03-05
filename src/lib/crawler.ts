// File system crawler for discovering photos

import { promises as fs } from 'fs';
import { join, extname, basename } from 'path';
import { IMAGE_EXTENSIONS, RAW_EXTENSIONS, SIDECAR_EXTENSIONS } from './types';

export interface CrawlResult {
  photos: string[];
  sidecars: Map<string, string>; // photo path -> sidecar path
  errors: string[];
}

export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  modified: Date;
  isRaw: boolean;
  isSidecar: boolean;
}

/**
 * Recursively crawl a directory for image files
 */
export async function crawlDirectory(dirPath: string): Promise<CrawlResult> {
  const result: CrawlResult = {
    photos: [],
    sidecars: new Map(),
    errors: []
  };

  try {
    await crawlRecursive(dirPath, result);
  } catch (error) {
    result.errors.push(`Failed to crawl directory: ${error}`);
  }

  return result;
}

/**
 * Recursive helper for directory crawling
 */
async function crawlRecursive(dirPath: string, result: CrawlResult): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively crawl subdirectories
        await crawlRecursive(fullPath, result);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        
        if (IMAGE_EXTENSIONS.has(ext)) {
          result.photos.push(fullPath);
        } else if (SIDECAR_EXTENSIONS.has(ext)) {
          // Check if this is an XMP sidecar for an image
          const baseName = basename(entry.name, ext);
          // Look for matching image file
          const possibleImageExtensions = Array.from(IMAGE_EXTENSIONS);
          for (const imgExt of possibleImageExtensions) {
            const imagePath = join(dirPath, baseName + imgExt);
            try {
              await fs.access(imagePath);
              result.sidecars.set(imagePath, fullPath);
              break;
            } catch {
              // Image file doesn't exist with this extension
            }
          }
        }
      }
    }
  } catch (error) {
    result.errors.push(`Error reading directory ${dirPath}: ${error}`);
  }
}

/**
 * Get detailed file information
 */
export async function getFileInfo(filePath: string): Promise<FileInfo | null> {
  try {
    const stats = await fs.stat(filePath);
    const ext = extname(filePath).toLowerCase();
    const name = basename(filePath);

    return {
      path: filePath,
      name,
      extension: ext,
      size: stats.size,
      modified: stats.mtime,
      isRaw: RAW_EXTENSIONS.has(ext),
      isSidecar: SIDECAR_EXTENSIONS.has(ext)
    };
  } catch (error) {
    return null;
  }
}

/**
 * Group photos by their parent directory
 */
export function groupByDirectory(photos: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  for (const photo of photos) {
    const dir = join(photo, '..');
    if (!groups.has(dir)) {
      groups.set(dir, []);
    }
    groups.get(dir)!.push(photo);
  }

  return groups;
}
