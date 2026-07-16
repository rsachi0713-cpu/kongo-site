"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/app/(storefront)/cart/actions';

interface CartActionsProps {
  productId: string;
  stock: number;
  user: any;
}

export default function CartActions({ productId, stock, user }: CartActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleQtyChange = (change: number) => {
    setQuantity(prev => {
      const next = prev + change;
      if (next < 1) return 1;
      if (next > stock) return stock;
      return next;
    });
  };

  const handleAddToCart = () => {
    // If not logged in, redirect immediately to login
    if (!user) {
      router.push(`/login?next=/product/${productId}`);
      return;
    }

    startTransition(async () => {
      try {
        await addToCart(productId, quantity);
        router.push('/cart');
      } catch (err: any) {
        alert(err.message || 'Failed to add item to cart');
      }
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push(`/login?next=/product/${productId}`);
      return;
    }

    startTransition(async () => {
      try {
        await addToCart(productId, quantity);
        router.push('/checkout');
      } catch (err: any) {
        alert(err.message || 'Failed to process checkout');
      }
    });
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4">
        {/* Quantity Picker */}
        <div className="flex border border-gray-300 h-14 w-32 rounded">
          <button 
            type="button"
            disabled={isPending || isOutOfStock}
            onClick={() => handleQtyChange(-1)}
            className="flex-1 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <span className="w-10 text-center font-inter text-base flex items-center justify-center text-black font-semibold">
            {isOutOfStock ? 0 : quantity}
          </span>
          <button 
            type="button"
            disabled={isPending || isOutOfStock}
            onClick={() => handleQtyChange(1)}
            className="flex-1 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
        
        {/* Add to Cart Button */}
        <button 
          type="button"
          onClick={handleAddToCart}
          disabled={isPending || isOutOfStock}
          className="flex-1 bg-black text-white flex items-center justify-center gap-3 font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity rounded disabled:bg-gray-400"
        >
          <span className="material-symbols-outlined text-xl">shopping_cart</span>
          {isOutOfStock ? 'Out of Stock' : isPending ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
      
      {/* Buy It Now Button */}
      <button 
        type="button"
        onClick={handleBuyNow}
        disabled={isPending || isOutOfStock}
        className="w-full h-14 border border-black text-black font-inter text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors rounded disabled:border-gray-300 disabled:text-gray-400"
      >
        <span className="material-symbols-outlined text-xl">payments</span>
        {isOutOfStock ? 'Out of Stock' : 'Buy It Now'}
      </button>
    </div>
  );
}
