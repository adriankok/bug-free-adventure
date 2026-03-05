'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PhotoData {
  id: string;
  fileName: string;
  filePath: string;
  thumbnailUrl: string;
  fullUrl: string;
  dateTaken: string | null;
  dateOriginal: string | null;
  cameraMake: string | null;
  cameraModel: string | null;
}

interface TimeGroup {
  year: number;
  month: number;
  monthName: string;
  photos: PhotoData[];
  photoCount: number;
}

interface FolderStats {
  totalPhotos: number;
  totalRaw: number;
  totalJpg: number;
  totalHeic: number;
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
}

export default function Home() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [timeIndex, setTimeIndex] = useState<TimeGroup[]>([]);
  const [stats, setStats] = useState<FolderStats | null>(null);
  const [folderPath, setFolderPath] = useState('');
  const [hasIndexed, setHasIndexed] = useState(false);

  // Fetch photo data on load
  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/index-photos');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
        setTimeIndex(data.timeIndex);
        setStats(data.stats);
        setFolderPath(data.folderPath || '');
        setHasIndexed(data.photos.length > 0);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h1 className="text-xl font-semibold">Photo Indexer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {hasIndexed 
                ? `${stats?.totalPhotos.toLocaleString() || 0} Photos Indexed`
                : 'No Photos Indexed Yet'}
            </h2>
            {folderPath && (
              <p className="text-gray-400 text-sm mt-1 truncate">
                {folderPath}
              </p>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Photos"
              value={stats?.totalPhotos.toString() || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              label="RAW Files"
              value={stats?.totalRaw.toString() || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <StatCard
              label="JPG Files"
              value={stats?.totalJpg.toString() || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              label="HEIC Files"
              value={stats?.totalHeic.toString() || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </div>

          {/* Date Range */}
          {stats?.dateRange.earliest && stats?.dateRange.latest && (
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-400">
                Date Range:{' '}
                <span className="text-gray-200">
                  {new Date(stats.dateRange.earliest).toLocaleDateString()} -{' '}
                  {new Date(stats.dateRange.latest).toLocaleDateString()}
                </span>
              </p>
            </div>
          )}

          {/* Empty state */}
          {!hasIndexed && (
            <div className="p-8 bg-gray-900/30 border border-gray-800 rounded-lg text-center">
              <p className="text-gray-400 mb-4">
                Start the Docker container with a photo volume mounted to index your photos.
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, HEIC, CR2, CR3, DNG, NEF, ARW, and more.
              </p>
            </div>
          )}
        </div>

        {/* Photo Gallery by Year */}
        {hasIndexed && timeIndex.length > 0 && (
          <div className="space-y-8">
            {timeIndex.map((timeGroup) => (
              <div key={`${timeGroup.year}-${timeGroup.month}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>{timeGroup.monthName} {timeGroup.year}</span>
                  <span className="text-sm font-normal text-gray-400">
                    ({timeGroup.photoCount} photos)
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {timeGroup.photos.slice(0, 10).map((photo) => (
                    <Link
                      key={photo.id}
                      href={`/photo/${photo.id}`}
                      className="group block bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <div className="aspect-square relative overflow-hidden bg-gray-800">
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.fileName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-400 truncate">
                          {photo.fileName}
                        </p>
                        {photo.dateTaken && (
                          <p className="text-xs text-gray-500">
                            {new Date(photo.dateTaken).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-800 rounded-lg text-blue-500">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
