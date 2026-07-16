"use client";

import { useState, useTransition } from 'react';
import { toggleWishlist } from '@/app/(storefront)/wishlist/actions';

export default function ImageGallery({ 
  images = [], 
  productName, 
  productId,
  initialIsWishlisted = false
}: { 
  images: string[]; 
  productName: string;
  productId: string;
  initialIsWishlisted?: boolean;
}) {
  // Ensure we have at least one image to show
  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'];
  const [activeImage, setActiveImage] = useState(displayImages[0]);
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isPending, startTransition] = useTransition();

  const handleToggleWishlist = () => {
    startTransition(async () => {
      const res = await toggleWishlist(productId);
      if (res.success) {
        setIsWishlisted(res.action === 'added');
      } else if (res.error === 'unauthenticated') {
        // Redirect to login if trying to wishlist items while logged out
        window.location.href = `/login?next=/product/${productId}`;
      }
    });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0 max-h-[500px]">
          {displayImages.map((imgUrl, i) => (
            <button 
              key={i} 
              onClick={() => setActiveImage(imgUrl)}
              className={`aspect-square bg-white border shrink-0 transition-colors flex items-center justify-center p-2 rounded-sm ${
                activeImage === imgUrl ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover rounded-sm" />
            </button>
          ))}
        </div>
      )}
      
      {/* Main Image */}
      <div className="flex-1 aspect-square bg-white border border-gray-100 flex items-center justify-center relative rounded-sm overflow-hidden">
        <img src={activeImage} alt={productName} className="w-full h-full object-cover" />
        <button 
          onClick={handleToggleWishlist}
          disabled={isPending}
          className={`absolute top-6 right-6 p-2 rounded-full backdrop-blur-sm shadow-sm transition-all bg-white/80 ${
            isWishlisted ? 'text-red-500 scale-105' : 'text-gray-400 hover:text-red-500'
          } disabled:opacity-50`}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <span className="material-symbols-outlined text-2xl block" style={{ fontVariationSettings: `'FILL' ${isWishlisted ? 1 : 0}` }}>
            favorite
          </span>
        </button>
      </div>
    </div>
  );
}
