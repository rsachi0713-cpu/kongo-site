"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const HERO_IMAGES = [
  // 1. Clothing / Fashion
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
  // 2. Home Goods / Decor
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000",
  // 3. Tech Accessories / Gadgets
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2000",
  // 4. Cosmetics / Beauty
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=2000"
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change background image every 4 seconds (4000ms)
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Cross-fade Slideshow */}
      <div className="absolute inset-0 bg-gray-50 z-0">
        {HERO_IMAGES.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-40' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        {/* Smooth overlay gradient to ensure text readability and page transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 text-center max-w-4xl px-5 md:px-16 animate-fade-in-up">
        <h1 className="font-poppins text-5xl md:text-7xl font-semibold text-black mb-6 tracking-tight leading-tight">
          Everything You Need,<br/>
          <span className="text-gray-600 font-light">All in One Place</span>
        </h1>
        
        <p className="font-inter text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Shop quality products with fast delivery and secure payments. Curated for the modern lifestyle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/shop" 
            className="bg-black text-white px-8 py-4 rounded font-inter text-sm uppercase tracking-wider hover:opacity-90 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto font-medium text-center shadow-sm"
          >
            Shop Now
          </Link>
          <Link 
            href="/category" 
            className="bg-transparent text-black border border-black px-8 py-4 rounded font-inter text-sm uppercase tracking-wider hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto font-medium text-center"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
