"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function Header({ user }: { user?: any }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { count } = await supabase
          .from('cart_items')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', currentUser.id);
        setCartCount(count || 0);
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();

    // Listen for storage/cart changes to update count dynamically
    window.addEventListener('focus', fetchCartCount);
    return () => window.removeEventListener('focus', fetchCartCount);
  }, [user]);

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-200 ease-in-out font-inter">
      {/* Row 1: Brand, Search, User actions */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 flex items-center justify-between h-20 gap-6">
        
        {/* Brand Logo (Left) */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-[#d32f2f] font-poppins font-black text-2xl md:text-3xl tracking-tight">Buy</span>
            <span className="text-[#311b92] font-poppins font-black text-2xl md:text-3xl tracking-tight">KONGO</span>
          </Link>
        </div>

        {/* Center Search Bar - Prominent Abans Style */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
            if (query.trim()) {
              window.location.href = `/shop?search=${encodeURIComponent(query.trim())}`;
            }
          }}
          className="flex-1 max-w-2xl hidden md:flex items-stretch border-2 border-[#311b92] rounded overflow-hidden"
        >
          <input 
            type="text" 
            name="search"
            placeholder="Search for products, categories and more..." 
            className="w-full bg-[#f9f9f9] border-none py-2.5 px-4 font-inter text-sm text-black focus:outline-none placeholder:text-gray-400 font-semibold"
          />
          <button 
            type="submit" 
            aria-label="Search" 
            className="bg-[#311b92] hover:bg-[#251375] text-white px-5 flex items-center justify-center transition-colors border-l border-[#311b92]"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
        </form>

        {/* Right User Actions (Cart, Login/Account) */}
        <div className="flex items-center gap-6 justify-end">
          
          {/* Cart Icon with red badge quantity */}
          <Link href="/cart" className="relative flex items-center gap-2 text-gray-800 hover:text-[#311b92] transition-all font-bold text-xs uppercase tracking-wider group">
            <div className="relative">
              <span className="material-symbols-outlined text-[26px] group-hover:scale-105 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d32f2f] text-white rounded-full text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center border border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
              <Link 
                href="/profile" 
                className="font-inter text-xs uppercase tracking-wider text-gray-800 hover:text-[#311b92] font-extrabold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                My Account
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 text-xs font-bold uppercase tracking-wider">
              <Link href="/login" className="text-gray-800 hover:text-[#311b92] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">login</span>
                Login
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/register" className="text-gray-800 hover:text-[#311b92]">Sign Up</Link>
            </div>
          )}
          
          {/* Language currency static label */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-gray-500 font-bold border-l border-gray-200 pl-4 uppercase">
            <span>EN</span>
            <span>/</span>
            <span>LKR</span>
          </div>
        </div>
      </div>

      {/* Row 2: Purple Abans Sub-navigation Bar */}
      <div className="bg-[#4a148c] text-white border-t border-purple-950">
        <div className="max-w-[1440px] mx-auto px-5 md:px-16 flex items-center justify-between h-12">
          
          {/* All Categories Dropdown button */}
          <Link 
            href="/category" 
            className="bg-[#310a62] hover:bg-[#200542] text-white px-5 h-full flex items-center gap-2 font-inter text-xs uppercase tracking-widest font-black transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">menu</span>
            All Categories
          </Link>

          {/* Quick Category links */}
          <nav className="hidden md:flex items-center gap-6 font-inter text-xs uppercase tracking-widest font-extrabold text-purple-100">
            <Link href="/shop?category=Clothing" className="hover:text-white transition-colors">Clothing</Link>
            <Link href="/shop?category=Tech" className="hover:text-white transition-colors">Tech Products</Link>
            <Link href="/shop?category=Home" className="hover:text-white transition-colors">Home Items</Link>
            <Link href="/wishlist" className="hover:text-white transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">favorite</span>
              Wishlist
            </Link>
            <Link href="/shop" className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1 font-black">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              Today's Offer
            </Link>
          </nav>

          {/* Customer Service info */}
          <div className="flex items-center gap-6 font-inter text-xs font-bold text-purple-200">
            <Link href="/profile" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              Track Order
            </Link>
            <a href="tel:+94753951531" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">call</span>
              +94 75 395 1531
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
