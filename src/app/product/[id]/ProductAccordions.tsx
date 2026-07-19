'use client';

import { useState } from 'react';

interface ProductAccordionsProps {
  description: string;
  shippingReturns?: string;
}

export default function ProductAccordions({ description, shippingReturns }: ProductAccordionsProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 mt-8">
      <div className="py-6 border-b border-gray-200">
        <button 
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="w-full flex items-center justify-between font-inter text-sm uppercase tracking-widest font-semibold text-black"
        >
          Details
          <span className="material-symbols-outlined">
            {detailsOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        
        {/* We can use CSS transitions or simple conditional rendering */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            detailsOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="text-gray-600 font-inter text-sm whitespace-pre-line pb-2">
            {description}
          </div>
        </div>
      </div>

      <div className="py-6 border-b border-gray-200">
        <button 
          onClick={() => setShippingOpen(!shippingOpen)}
          className="w-full flex items-center justify-between font-inter text-sm uppercase tracking-widest font-semibold text-black"
        >
          Shipping &amp; Returns
          <span className="material-symbols-outlined">
            {shippingOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            shippingOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="text-gray-600 font-inter text-sm whitespace-pre-line pb-2">
            {shippingReturns || `Standard Delivery: 3-5 working days depending on your location.\nStore Pickup: Usually available same day if ordered before 3PM.\nReturns: We accept returns within 14 days of delivery for unused items in original packaging.`}
          </div>
        </div>
      </div>
    </div>
  );
}
