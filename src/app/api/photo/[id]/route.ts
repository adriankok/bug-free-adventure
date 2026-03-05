// API route for getting photo details by ID

import { NextRequest, NextResponse } from 'next/server';
import { getPhotos, getFolderPath } from '@/lib/photoStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    const photos = getPhotos();
    const folderPath = getFolderPath();
    
    // Find the photo by index position
    const index = parseInt(id, 10);
    
    if (isNaN(index) || index < 0 || index >= photos.length) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const photo = photos[index];

    // Add URLs for the photo
    const photoWithUrls = {
      ...photo,
      id: index.toString(),
      thumbnailUrl: `/api/photo/thumbnail?path=${encodeURIComponent(photo.filePath)}`,
      fullUrl: `/api/photo/full?path=${encodeURIComponent(photo.filePath)}`
    };

    return NextResponse.json(photoWithUrls);
  } catch (error) {
    console.error('Photo detail error:', error);
    return NextResponse.json({ error: 'Failed to get photo details' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
