# Active Context: Photo Indexer App

## Current State

**App Status**: ✅ Photo Indexer Built

A Next.js photo indexing application that extracts metadata from RAW, HEIC, and JPG files, organizing photos by time and location.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Photo Indexer core functionality:
  - [x] File system crawler for discovering images
  - [x] Metadata extraction from images (CR2, CR3, DNG, HEIC, JPG, etc.)
  - [x] XMP sidecar file support
  - [x] Index by time (year/month)
  - [x] Index by location (country/state/city)
  - [x] UI for folder selection
  - [x] Stats display (total, RAW, JPG, HEIC counts)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main UI with folder selection and views | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/app/api/index-photos/route.ts` | API endpoint for indexing | ✅ Ready |
| `src/lib/types.ts` | TypeScript types for photo metadata | ✅ Ready |
| `src/lib/crawler.ts` | File system crawler | ✅ Ready |
| `src/lib/metadata.ts` | Metadata extraction (EXIF/XMP) | ✅ Ready |
| `src/lib/indexer.ts` | Photo indexing by time/location | ✅ Ready |
| `src/lib/usePhotoIndexer.ts` | React state management | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Supported Formats

| Format | Extension | Type |
|--------|-----------|------|
| JPEG | .jpg, .jpeg | Standard |
| HEIC | .heic, .heif | Standard |
| Canon RAW | .cr2, .cr3 | RAW |
| Nikon NEF | .nef | RAW |
| Sony ARW | .arw | RAW |
| Adobe DNG | .dng | RAW |
| Olympus ORF | .orf | RAW |
| Panasonic RW2 | .rw2 | RAW |
| Fuji RAF | .raf | RAW |
| Samsung SRW | .srw | RAW |

## Extracted Metadata

### Date/Time
- DateTimeOriginal, DateTimeDigitized, DateTime

### Location
- GPS Latitude/Longitude
- Country, State, City, SubLocation

### Camera
- Make, Model, LensModel
- FocalLength, FNumber (aperture), ExposureTime, ISO

### Image
- Width, Height, Orientation, ColorSpace

### XMP Sidecar
- Rating, Tags/Keywords

## Current Focus

The app is complete and ready to use. Enter a folder path to index photos.

## Usage

1. Open the app in browser
2. Enter the path to your photo folder (e.g., `/home/user/Pictures`)
3. Click "Start Indexing"
4. View photos by Time or Location using the toggle buttons

## Dependencies

- `exifr` - EXIF metadata extraction
- `sharp` - Image processing (optional, for thumbnail generation)

## Pending Improvements

- [ ] Add thumbnail generation
- [ ] Add photo preview
- [ ] Add filtering options
- [ ] Add export functionality
- [ ] Add search functionality

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-05 | Built Photo Indexer app with metadata extraction |
