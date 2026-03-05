'use client';

import { useState, useEffect } from 'react';
import { usePhotoIndexer, ViewMode, FolderStats, IndexResult } from '@/lib/usePhotoIndexer';

export default function Home() {
  const {
    viewMode,
    setViewMode,
    folderPath,
    isIndexing,
    indexResult,
    error,
    indexFolder,
    reset,
  } = usePhotoIndexer();

  const [inputPath, setInputPath] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPath.trim()) {
      indexFolder(inputPath.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="text-xl font-semibold">Photo Indexer</h1>
            </div>
            {viewMode !== 'folder-select' && (
              <button
                onClick={reset}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                New Folder
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Folder Selection View */}
        {viewMode === 'folder-select' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-xl w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Index Your Photos</h2>
                <p className="text-gray-400">
                  Enter the path to your photo folder to start indexing. 
                  We&apos;ll extract metadata from RAW, HEIC, and JPG files.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="folder-path" className="block text-sm font-medium mb-2">
                    Folder Path
                  </label>
                  <input
                    type="text"
                    id="folder-path"
                    value={inputPath}
                    onChange={(e) => setInputPath(e.target.value)}
                    placeholder="/path/to/photos or /home/user/Pictures"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!inputPath.trim() || isIndexing}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isIndexing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Indexing Photos...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Start Indexing
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 p-4 bg-gray-900/50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Supported Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {['JPG', 'HEIC', 'CR2', 'CR3', 'DNG', 'NEF', 'ARW'].map((format) => (
                    <span key={format} className="px-2 py-1 text-xs bg-gray-800 rounded">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isIndexing && viewMode === 'folder-select' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <svg className="animate-spin w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-400">Scanning and indexing photos...</p>
            </div>
          </div>
        )}

        {/* Results View */}
        {indexResult && indexResult.success && (viewMode === 'time' || viewMode === 'location') && (
          <div>
            {/* Stats Summary */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{folderPath}</h2>
                  <p className="text-gray-400 text-sm">
                    Indexed {indexResult.stats?.totalPhotos} photos
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('time')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      viewMode === 'time'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    By Time
                  </button>
                  <button
                    onClick={() => setViewMode('location')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      viewMode === 'location'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    By Location
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Total Photos"
                  value={indexResult.stats?.totalPhotos.toString() || '0'}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <StatCard
                  label="RAW Files"
                  value={indexResult.stats?.totalRaw.toString() || '0'}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  }
                />
                <StatCard
                  label="JPG Files"
                  value={indexResult.stats?.totalJpg.toString() || '0'}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <StatCard
                  label="HEIC Files"
                  value={indexResult.stats?.totalHeic.toString() || '0'}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
              </div>

              {/* Date Range */}
              {indexResult.stats?.dateRange.earliest && indexResult.stats?.dateRange.latest && (
                <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Date Range:{' '}
                    <span className="text-gray-200">
                      {new Date(indexResult.stats.dateRange.earliest).toLocaleDateString()} -{' '}
                      {new Date(indexResult.stats.dateRange.latest).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Time View */}
            {viewMode === 'time' && (
              <TimeView indexResult={indexResult} />
            )}

            {/* Location View */}
            {viewMode === 'location' && (
              <LocationView stats={indexResult.stats} />
            )}
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

// Time View Component
function TimeView({ indexResult }: { indexResult: IndexResult }) {
  // Group photos by year and month from the stats (simulated view)
  // In a real implementation, we'd get full photo data from the API
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Photos by Time</h3>
      
      {indexResult.stats?.dateRange.earliest && (
        <div className="space-y-4">
          <p className="text-gray-400">
            Photos indexed from {new Date(indexResult.stats.dateRange.earliest).toLocaleDateString()} to {new Date(indexResult.stats.dateRange.latest!).toLocaleDateString()}
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder cards showing the time-based organization */}
            {Array.from({ length: Math.min(12, indexResult.stats?.totalPhotos || 0) }, (_, i) => (
              <div key={i} className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{months[i % 12]}</p>
                    <p className="text-sm text-gray-500">{2024 - Math.floor(i / 12)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  {Math.ceil((indexResult.stats?.totalPhotos || 0) / 12)} photos
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!indexResult.stats?.dateRange.earliest && (
        <div className="p-8 bg-gray-900/30 border border-gray-800 rounded-lg text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">No date information found in photos</p>
          <p className="text-sm text-gray-500 mt-2">
            The photos may not contain EXIF date data
          </p>
        </div>
      )}
    </div>
  );
}

// Location View Component
function LocationView({ stats }: { stats: FolderStats | undefined }) {
  const locations = stats?.locations || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Photos by Location</h3>

      {locations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{location.city || 'Unknown City'}</p>
                  <p className="text-sm text-gray-500">
                    {[location.state, location.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Multiple photos</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-gray-900/30 border border-gray-800 rounded-lg text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-400">No location data found in photos</p>
          <p className="text-sm text-gray-500 mt-2">
            The photos may not contain GPS coordinates or location metadata
          </p>
        </div>
      )}
    </div>
  );
}
