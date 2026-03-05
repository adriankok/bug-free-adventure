// Photo Indexer State Hook

import { useState, useCallback } from 'react';

export interface PhotoMetadata {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  fileModified: string;
  dateTaken: string | null;
  dateOriginal: string | null;
  dateDigitized: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  cameraMake: string | null;
  cameraModel: string | null;
  lensModel: string | null;
  focalLength: number | null;
  aperture: number | null;
  shutterSpeed: string | null;
  iso: number | null;
  width: number | null;
  height: number | null;
  orientation: number | null;
  colorSpace: string | null;
  hasSidecar: boolean;
  sidecarPath: string | null;
  rating: number | null;
  tags: string[];
  isRaw: boolean;
  rawFormat: string | null;
}

export interface FolderStats {
  totalPhotos: number;
  totalRaw: number;
  totalJpg: number;
  totalHeic: number;
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
  locations: Array<{
    country: string | null;
    state: string | null;
    city: string | null;
  }>;
}

export interface IndexResult {
  success: boolean;
  index?: {
    id: string;
    folderPath: string;
    totalPhotos: number;
    indexedAt: string;
  };
  stats?: FolderStats;
  errors?: string[];
}

export type ViewMode = 'loading' | 'folder-select' | 'time' | 'location';

export function usePhotoIndexer() {
  const [viewMode, setViewMode] = useState<ViewMode>('folder-select');
  const [folderPath, setFolderPath] = useState<string>('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexResult, setIndexResult] = useState<IndexResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const indexFolder = useCallback(async (path: string) => {
    setIsIndexing(true);
    setError(null);
    setFolderPath(path);

    try {
      const response = await fetch('/api/index-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderPath: path }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to index photos');
      }

      setIndexResult(result);
      setViewMode('time');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsIndexing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setViewMode('folder-select');
    setFolderPath('');
    setIndexResult(null);
    setError(null);
  }, []);

  return {
    viewMode,
    setViewMode,
    folderPath,
    isIndexing,
    indexResult,
    error,
    indexFolder,
    reset,
  };
}
