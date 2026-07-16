"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HotDealCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  discountPercent: number;
}

export default function HotDealCard({
  id,
  name,
  category,
  price,
  imageUrl,
  discountPercent
}: HotDealCardProps) {
  // Calculate pricing values
  const marketPrice = price / (1 - discountPercent / 100);
  const savedAmount = marketPrice - price;

  // Initialize countdown timer: 1 day, 2 hours, 50 minutes, 1 second (from screenshot)
  const [timeLeft, setTimeLeft] = useState({
    hours: 26, // 1 day (24h) + 2 hours = 26h
    minutes: 50,
    seconds: 1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Timer reset or complete
              hours = 26;
              minutes = 50;
              seconds = 1;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href={`/product/${id}`} className="group block cursor-pointer bg-white border border-gray-200 hover:border-black rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      
      {/* Product Image area with diagonal flash background and discount circle */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden p-6 border-b border-gray-100">
        
        {/* Diagonal purple/yellow flash background like Abans */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/10 via-yellow-400/5 to-transparent z-0 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute -left-12 -top-12 w-28 h-28 bg-yellow-400/20 rotate-45 z-0" />
        <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-purple-700/10 rounded-full z-0" />

        <img 
          alt={name} 
          src={imageUrl}
          className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        
        {/* Discount Circle badge */}
        <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-12 h-12 flex flex-col items-center justify-center font-poppins font-bold shadow-md z-20 animate-pulse text-[10px]">
          <span>{discountPercent}%</span>
          <span className="text-[8px] uppercase tracking-tighter">OFF</span>
        </div>

        {/* Brand label top left */}
        <div className="absolute top-4 left-4 bg-black text-white px-2 py-0.5 text-[9px] uppercase tracking-widest font-extrabold font-inter z-20 rounded-sm">
          KONGO
        </div>

        {/* Countdown Timer overlay at the bottom of the image area */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <div className="bg-yellow-400 text-black py-1.5 px-3 flex justify-between items-center rounded-sm border border-yellow-500 shadow-md">
            <span className="font-inter text-[8px] uppercase tracking-widest font-black text-gray-800">Offer Ends In</span>
            <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-black">
              <span className="bg-black text-white px-1.5 py-0.5 rounded-sm min-w-[20px] text-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black text-white px-1.5 py-0.5 rounded-sm min-w-[20px] text-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black text-white px-1.5 py-0.5 rounded-sm min-w-[20px] text-center">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details area */}
      <div className="p-5 flex flex-col gap-2 bg-white">
        <span className="font-inter text-[10px] text-purple-700 uppercase tracking-widest font-extrabold">{category}</span>
        
        <h3 className="font-inter text-sm font-bold text-black min-w-0 truncate group-hover:text-purple-700 transition-colors" title={name}>
          {name}
        </h3>

        {/* Pricing Layout */}
        <div className="mt-2 space-y-1">
          {/* Crossed out Market price */}
          <div className="flex items-center gap-2">
            <span className="font-inter text-[11px] text-gray-400 line-through">
              Rs. {Math.round(marketPrice).toLocaleString()}
            </span>
          </div>

          {/* Sale Price and SAVE badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100/80">
            <span className="font-inter text-base font-extrabold text-black">
              Rs. {price.toLocaleString()}
            </span>
            <span className="bg-green-100 text-green-800 font-inter text-[9px] font-black uppercase px-2 py-0.5 rounded">
              SAVE Rs. {Math.round(savedAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
