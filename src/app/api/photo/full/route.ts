// API route for serving full-size photos

import { NextRequest, NextResponse } from 'next/server';
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

    // Determine content type from extension
    const ext = path.extname(decodedPath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.heic': 'image/heic',
      '.heif': 'image/heif',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.tiff': 'image/tiff',
      '.tif': 'image/tiff',
      '.cr2': 'image/x-canon-cr2',
      '.cr3': 'image/x-canon-cr3',
      '.nef': 'image/x-nikon-nef',
      '.arw': 'image/x-sony-arw',
      '.orf': 'image/x-olympus-orf',
      '.rw2': 'image/x-panasonic-rw2',
      '.dng': 'image/x-adobe-dng',
      '.raf': 'image/x-fuji-raf',
      '.srw': 'image/x-samsung-srw',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Read the file
    const imageBuffer = fs.readFileSync(decodedPath);

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Full photo error:', error);
    return NextResponse.json({ error: 'Failed to serve photo' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
