// Photo index management and organization

import { PhotoMetadata, IndexByTime, IndexByLocation, FolderStats, PhotoIndex } from './types';
import { createHash } from 'crypto';

/**
 * Create a unique ID for a photo index
 */
export function createIndexId(folderPath: string): string {
  return createHash('md5').update(folderPath).digest('hex').substring(0, 12);
}

/**
 * Index photos by time (year/month)
 */
export function indexByTime(photos: PhotoMetadata[]): IndexByTime {
  const index: IndexByTime = {};

  for (const photo of photos) {
    const date = photo.dateTaken || photo.dateOriginal || photo.dateDigitized || photo.fileModified;
    if (!date) continue;

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12

    if (!index[year]) {
      index[year] = {};
    }
    if (!index[year][month]) {
      index[year][month] = [];
    }

    index[year][month].push(photo);
  }

  // Sort each month
  for (const year of Object.keys(index) as unknown as number[]) {
    for (const month of Object.keys(index[year]) as unknown as number[]) {
      index[year][month].sort((a: PhotoMetadata, b: PhotoMetadata) => {
        const dateA = a.dateTaken || a.dateOriginal || a.dateDigitized || a.fileModified;
        const dateB = b.dateTaken || b.dateOriginal || b.dateDigitized || b.fileModified;
        return dateA.getTime() - dateB.getTime();
      });
    }
  }

  return index;
}

/**
 * Index photos by location (country/state/city)
 */
export function indexByLocation(photos: PhotoMetadata[]): IndexByLocation {
  const index: IndexByLocation = {};

  for (const photo of photos) {
    if (!photo.latitude || !photo.longitude) continue;

    const country = photo.country || 'Unknown Country';
    const state = photo.state || 'Unknown State';
    const city = photo.city || 'Unknown City';

    if (!index[country]) {
      index[country] = {};
    }
    if (!index[country][state]) {
      index[country][state] = {};
    }
    if (!index[country][state][city]) {
      index[country][state][city] = [];
    }

    index[country][state][city].push(photo);
  }

  return index;
}

/**
 * Get folder statistics
 */
export function getFolderStats(photos: PhotoMetadata[]): FolderStats {
  const stats: FolderStats = {
    totalPhotos: photos.length,
    totalRaw: 0,
    totalJpg: 0,
    totalHeic: 0,
    dateRange: {
      earliest: null,
      latest: null
    },
    locations: []
  };

  const locationSet = new Set<string>();
  const dates: Date[] = [];

  for (const photo of photos) {
    // Count by type
    if (photo.isRaw) {
      stats.totalRaw++;
    } else if (photo.fileType === 'image/jpeg') {
      stats.totalJpg++;
    } else if (photo.fileType === 'image/heic' || photo.fileType === 'image/heif') {
      stats.totalHeic++;
    }

    // Collect dates
    const date = photo.dateTaken || photo.dateOriginal || photo.dateDigitized;
    if (date) {
      dates.push(date);
    }

    // Collect unique locations
    const locationKey = `${photo.country}|${photo.state}|${photo.city}`;
    if (photo.country && !locationSet.has(locationKey)) {
      locationSet.add(locationKey);
      stats.locations.push({
        country: photo.country,
        state: photo.state,
        city: photo.city
      });
    }
  }

  // Calculate date range
  if (dates.length > 0) {
    dates.sort((a, b) => a.getTime() - b.getTime());
    stats.dateRange.earliest = dates[0];
    stats.dateRange.latest = dates[dates.length - 1];
  }

  return stats;
}

/**
 * Create a complete photo index
 */
export function createPhotoIndex(folderPath: string, photos: PhotoMetadata[]): PhotoIndex {
  return {
    id: createIndexId(folderPath),
    folderPath,
    totalPhotos: photos.length,
    indexedAt: new Date(),
    photos
  };
}

/**
 * Flatten location index to a list for display
 */
export function flattenLocationIndex(index: IndexByLocation): Array<{
  country: string;
  state: string;
  city: string;
  photos: PhotoMetadata[];
  photoCount: number;
}> {
  const result: Array<{
    country: string;
    state: string;
    city: string;
    photos: PhotoMetadata[];
    photoCount: number;
  }> = [];

  for (const country of Object.keys(index)) {
    for (const state of Object.keys(index[country])) {
      for (const city of Object.keys(index[country][state])) {
        const photos = index[country][state][city];
        result.push({
          country,
          state,
          city,
          photos,
          photoCount: photos.length
        });
      }
    }
  }

  // Sort by photo count descending
  result.sort((a, b) => b.photoCount - a.photoCount);

  return result;
}

/**
 * Flatten time index to a list for display
 */
export function flattenTimeIndex(index: IndexByTime): Array<{
  year: number;
  month: number;
  monthName: string;
  photos: PhotoMetadata[];
  photoCount: number;
}> {
  const result: Array<{
    year: number;
    month: number;
    monthName: string;
    photos: PhotoMetadata[];
    photoCount: number;
  }> = [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  for (const year of Object.keys(index).map(Number).sort((a, b) => b - a)) {
    for (const month of Object.keys(index[year]).map(Number).sort((a, b) => b - a)) {
      const photos = index[year][month];
      result.push({
        year,
        month,
        monthName: monthNames[month - 1],
        photos,
        photoCount: photos.length
      });
    }
  }

  return result;
}
