"use client";

import { useState } from 'react';

export default function ImagePreview({ initialUrls = [], productName }: { initialUrls: string[]; productName: string }) {
  // Filters out null or empty strings
  const validInitialUrls = initialUrls.filter(Boolean);
  const [remainingImages, setRemainingImages] = useState<string[]>(validInitialUrls);

  const handleRemove = (urlToRemove: string) => {
    if (confirm('Are you sure you want to remove this image?')) {
      setRemainingImages(prev => prev.filter(url => url !== urlToRemove));
    }
  };

  return (
    <div className="mb-6">
      {/* Hidden input containing the JSON array of remaining image URLs */}
      <input type="hidden" name="remainingImages" value={JSON.stringify(remainingImages)} />
      
      {remainingImages.length > 0 && (
        <div className="mb-6">
          <p className="block font-inter text-xs font-medium text-gray-500 mb-3">Current Images ({remainingImages.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {remainingImages.map((url, idx) => (
              <div key={url} className="relative aspect-square bg-white border border-gray-200 rounded overflow-hidden group">
                <img 
                  src={url} 
                  alt={`${productName} - ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm"
                  title="Remove Image"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
