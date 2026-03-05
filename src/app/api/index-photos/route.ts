// API route for indexing photos

import { NextRequest, NextResponse } from 'next/server';
import { crawlDirectory } from '@/lib/crawler';
import { extractMetadata } from '@/lib/metadata';
import { createPhotoIndex, indexByTime, indexByLocation, getFolderStats, flattenTimeIndex } from '@/lib/indexer';
import { getPhotos, setPhotos, getFolderPath } from '@/lib/photoStore';

export async function GET() {
  // Return the current index data
  const photos = getPhotos();
  
  if (photos.length === 0) {
    return NextResponse.json({ error: 'No photos indexed yet' }, { status: 404 });
  }

  const timeIndex = indexByTime(photos);
  const flattenedTime = flattenTimeIndex(timeIndex);
  const folderPath = getFolderPath();

  // Get a thumbnail URL for each photo
  const photosWithThumbnails = photos.map((photo, index) => ({
    ...photo,
    id: index.toString(),
    thumbnailUrl: `/api/photo/thumbnail?path=${encodeURIComponent(photo.filePath)}`,
    fullUrl: `/api/photo/full?path=${encodeURIComponent(photo.filePath)}`
  }));

  return NextResponse.json({
    folderPath,
    totalPhotos: photos.length,
    photos: photosWithThumbnails,
    timeIndex: flattenedTime,
    stats: getFolderStats(photos)
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folderPath } = body;

    if (!folderPath) {
      return NextResponse.json(
        { error: 'Folder path is required' },
        { status: 400 }
      );
    }

    // Crawl directory for photos
    const crawlResult = await crawlDirectory(folderPath);
    
    if (crawlResult.photos.length === 0) {
      return NextResponse.json({
        message: 'No photos found in the specified folder',
        stats: {
          totalPhotos: 0,
          errors: crawlResult.errors
        }
      });
    }

    // Extract metadata from each photo
    const photos = [];
    const errors = [...crawlResult.errors];
    
    for (let i = 0; i < crawlResult.photos.length; i++) {
      const photoPath = crawlResult.photos[i];
      const sidecarPath = crawlResult.sidecars.get(photoPath) || null;
      
      try {
        const metadata = await extractMetadata(photoPath, sidecarPath);
        photos.push(metadata);
      } catch (error) {
        errors.push(`Error processing ${photoPath}: ${error}`);
      }
    }

    // Create index
    const photoIndex = createPhotoIndex(folderPath, photos);
    const timeIndex = indexByTime(photos);
    const locationIndex = indexByLocation(photos);
    const stats = getFolderStats(photos);

    // Store photos in the shared store for later retrieval
    setPhotos(photos, folderPath);

    return NextResponse.json({
      success: true,
      index: {
        id: photoIndex.id,
        folderPath: photoIndex.folderPath,
        totalPhotos: photoIndex.totalPhotos,
        indexedAt: photoIndex.indexedAt
      },
      stats,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Indexing error:', error);
    return NextResponse.json(
      { error: `Failed to index photos: ${error}` },
      { status: 500 }
    );
  }
}

// Disable body parsing for this route
export const runtime = 'nodejs';
