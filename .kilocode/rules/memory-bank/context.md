# Active Context: Photo Indexer App

## Current State

**App Status**: ✅ Photo Indexer with Gallery Built

A Next.js photo indexing application that extracts metadata from RAW, HEIC, and JPG files, organizing photos by time and location. Now includes Docker deployment support, thumbnail generation, and a photo gallery.

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
- [x] Docker deployment:
  - [x] Dockerfile for containerized deployment
  - [x] docker-compose.yml with volume mounting
  - [x] Next.js standalone output configuration
- [x] Refactored homepage to be dashboard-first: removed folder path input and indexing button. Now shows photo count prominently as landing page with stats and thumbnails below.

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main UI with gallery and dashboard | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/app/api/index-photos/route.ts` | API endpoint for indexing & fetching | ✅ Ready |
| `src/app/api/photo/thumbnail/route.ts` | Thumbnail generation API | ✅ Ready |
| `src/app/api/photo/full/route.ts` | Full-size photo serving | ✅ Ready |
| `src/app/api/photo/[id]/route.ts` | Photo detail API | ✅ Ready |
| `src/app/photo/[id]/page.tsx` | Photo detail page | ✅ Ready |
| `src/lib/types.ts` | TypeScript types for photo metadata | ✅ Ready |
| `src/lib/crawler.ts` | File system crawler | ✅ Ready |
| `src/lib/metadata.ts` | Metadata extraction (EXIF/XMP) | ✅ Ready |
| `src/lib/indexer.ts` | Photo indexing by time/location | ✅ Ready |
| `src/lib/photoStore.ts` | Shared photo store for API routes | ✅ Ready |
| `Dockerfile` | Docker container configuration | ✅ Ready |
| `docker-compose.yml` | Docker Compose with volume mounting | ✅ Ready |
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

The app is complete with gallery support. Enter a folder path to index photos, view thumbnails, and click on any photo to see its full metadata.

## Usage

### Local Development
1. Run `bun install` to install dependencies
2. Run `bun dev` to start the development server
3. Open http://localhost:3000
4. Enter a folder path to index photos

### Docker Deployment
1. Build the container: `docker build -t photo-indexer .`
2. Edit `docker-compose.yml` to set your photo path:
   ```yaml
   volumes:
     - /path/to/your/photos:/app/photos
   ```
3. Run `docker-compose up -d`
4. Open http://localhost:3000

## Dependencies

- `exifr` - EXIF metadata extraction
- `sharp` - Image processing for thumbnails

## Pending Improvements

- [ ] Add filtering options
- [ ] Add export functionality
- [ ] Add search functionality

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-05 | Built Photo Indexer app with metadata extraction |
| 2026-03-05 | Added Docker deployment, thumbnail generation, and gallery UI |
