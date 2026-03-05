'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface PhotoDetail {
  id: string;
  fileName: string;
  filePath: string;
  thumbnailUrl: string;
  fullUrl: string;
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
  rating: number | null;
  tags: string[];
  isRaw: boolean;
  rawFormat: string | null;
}

export default function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [photo, setPhoto] = useState<PhotoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const response = await fetch(`/api/photo/${id}`);
        if (!response.ok) {
          throw new Error('Photo not found');
        }
        const data = await response.json();
        setPhoto(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load photo');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPhoto();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 text-blue-500">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error || 'Photo not found'}</p>
        <Link href="/" className="text-blue-500 hover:text-blue-400">
          ← Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold truncate">{photo.fileName}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Display */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="aspect-auto max-h-[70vh] flex items-center justify-center bg-gray-800">
              <img
                src={photo.fullUrl}
                alt={photo.fileName}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>

          {/* Metadata Panel */}
          <div className="space-y-6">
            {/* Date & Time */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date & Time
              </h2>
              <div className="space-y-2 text-sm">
                {photo.dateTaken && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date Taken:</span>
                    <span>{new Date(photo.dateTaken).toLocaleString()}</span>
                  </div>
                )}
                {photo.dateOriginal && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Original Date:</span>
                    <span>{new Date(photo.dateOriginal).toLocaleString()}</span>
                  </div>
                )}
                {photo.dateDigitized && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Digitized:</span>
                    <span>{new Date(photo.dateDigitized).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {(photo.latitude || photo.location || photo.city || photo.country) && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h2>
                <div className="space-y-2 text-sm">
                  {photo.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span>{photo.location}</span>
                    </div>
                  )}
                  {photo.city && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">City:</span>
                      <span>{photo.city}</span>
                    </div>
                  )}
                  {photo.state && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">State:</span>
                      <span>{photo.state}</span>
                    </div>
                  )}
                  {photo.country && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country:</span>
                      <span>{photo.country}</span>
                    </div>
                  )}
                  {photo.latitude && photo.longitude && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">GPS:</span>
                      <span>{photo.latitude.toFixed(6)}, {photo.longitude.toFixed(6)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Camera Settings */}
            {(photo.cameraMake || photo.cameraModel || photo.lensModel || photo.focalLength || photo.aperture || photo.shutterSpeed || photo.iso) && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Camera
                </h2>
                <div className="space-y-2 text-sm">
                  {photo.cameraMake && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Make:</span>
                      <span>{photo.cameraMake}</span>
                    </div>
                  )}
                  {photo.cameraModel && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model:</span>
                      <span>{photo.cameraModel}</span>
                    </div>
                  )}
                  {photo.lensModel && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lens:</span>
                      <span>{photo.lensModel}</span>
                    </div>
                  )}
                  {photo.focalLength && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Focal Length:</span>
                      <span>{photo.focalLength}mm</span>
                    </div>
                  )}
                  {photo.aperture && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aperture:</span>
                      <span>f/{photo.aperture}</span>
                    </div>
                  )}
                  {photo.shutterSpeed && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shutter Speed:</span>
                      <span>{photo.shutterSpeed}</span>
                    </div>
                  )}
                  {photo.iso && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">ISO:</span>
                      <span>{photo.iso}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Details */}
            {(photo.width || photo.height || photo.colorSpace || photo.isRaw) && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  Image Details
                </h2>
                <div className="space-y-2 text-sm">
                  {photo.width && photo.height && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dimensions:</span>
                      <span>{photo.width} × {photo.height}</span>
                    </div>
                  )}
                  {photo.colorSpace && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Color Space:</span>
                      <span>{photo.colorSpace}</span>
                    </div>
                  )}
                  {photo.isRaw && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span>{photo.rawFormat?.toUpperCase()} (RAW)</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rating & Tags */}
            {(photo.rating || photo.tags.length > 0) && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Rating & Tags
                </h2>
                <div className="space-y-2 text-sm">
                  {photo.rating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= photo.rating! ? 'text-yellow-500' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  )}
                  {photo.tags.length > 0 && (
                    <div>
                      <span className="text-gray-400">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {photo.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                File Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Filename:</span>
                  <span className="truncate max-w-[200px]" title={photo.fileName}>
                    {photo.fileName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Path:</span>
                  <span className="truncate max-w-[200px]" title={photo.filePath}>
                    {photo.filePath.split('/').pop()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
