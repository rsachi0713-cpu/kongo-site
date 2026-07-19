'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider({ banners }: { banners: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full relative z-10 overflow-hidden bg-white">
      <Link 
        href="/shop" 
        className="block relative w-full overflow-hidden group aspect-[3/2] sm:aspect-[16/7] md:aspect-[16/5]"
      >
        {banners.map((banner, index) => (
          <img 
            key={banner + index}
            src={banner} 
            alt={`Promotional Deal ${index + 1}`} 
            className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 z-10 scale-100' 
                : 'opacity-0 z-0 scale-105'
            }`}
          />
        ))}

        {/* Navigation Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-125 shadow-[0_0_8px_rgba(0,0,0,0.5)]' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Link>
    </section>
  );
}
