# Project Brief: Photo Indexer App

## Purpose

A Next.js photo indexing application that extracts metadata from RAW, HEIC, and JPG files, organizing photos by time and location. Users can enter a folder path to scan and index their photo collection.

## Target Users

- Photographers with large collections of RAW and standard image files
- Users who want to organize photos by when and where they were taken
- People with Canon (CR2, CR3), Nikon (NEF), Sony (ARW), and other RAW formats

## Core Use Case

1. User opens the app in a browser
2. User enters the path to their photo folder
3. App crawls the folder recursively for image files
4. App extracts EXIF metadata from each image (date, camera settings, GPS)
5. App looks for XMP sidecar files for additional metadata (ratings, tags)
6. Results displayed in two views: by Time and by Location

## Key Requirements

### Must Have

- Support for RAW formats: CR2, CR3, DNG, NEF, ARW, ORF, RW2, RAF, SRW
- Support for standard formats: JPG, JPEG, HEIC, HEIF
- Extract embedded EXIF metadata from images
- Read XMP sidecar files for ratings and tags
- Index by capture date/time
- Index by GPS location (country/state/city)
- Folder path input UI
- Stats display (total, RAW, JPG, HEIC counts)
- Modern Next.js 16 with App Router
- Tailwind CSS 4 styling

### Nice to Have

- Thumbnail generation
- Photo preview
- Filtering options
- Search functionality
- Export to CSV/JSON

## Success Metrics

- Successfully indexes photos from user-provided folder path
- Correctly extracts date/time from various RAW formats
- Displays photos organized by year/month and location
- Zero TypeScript errors, passing lint checks

## Constraints

- Server-side processing required (file system access)
- Next.js 16 + React 19 + Tailwind CSS 4
- Bun as package manager
- Dependencies: exifr (metadata), sharp (image processing optional)
