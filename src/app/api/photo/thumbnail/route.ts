// API route for serving photo thumbnails

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const photoPath = searchParams.get('path');

    if (!photoPath) {
      return NextResponse.json({ error: 'Photo path is required' }, { status: 400 });
    }

    // Decode the path
    const decodedPath = decodeURIComponent(photoPath);

    // Check if file exists
    if (!fs.existsSync(decodedPath)) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Read and process the image
    const imageBuffer = fs.readFileSync(decodedPath);
    
    // Generate thumbnail (200x200, fit within)
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(200, 200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Convert Buffer to Uint8Array for NextResponse
    const thumbnail = new Uint8Array(thumbnailBuffer);

    return new NextResponse(thumbnail, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Thumbnail error:', error);
    return NextResponse.json({ error: 'Failed to generate thumbnail' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
