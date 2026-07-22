"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function Header({ user }: { user?: any }) {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }
      try {
        const supabase = createClient();
        const { count, error } = await supabase
          .from('cart_items')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (error) {
          console.warn("Failed to fetch cart count:", error);
          setCartCount(0);
        } else {
          setCartCount(count || 0);
        }
      } catch (err) {
        console.warn("Failed to fetch cart count due to connection/network limits:", err);
        setCartCount(0);
      }
    };

    fetchCartCount();

    window.addEventListener('focus', fetchCartCount);
    return () => window.removeEventListener('focus', fetchCartCount);
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm font-inter">

      {/* ========== ROW 1: Brand + Search + Actions ========== */}
      <div className="site-container flex items-center justify-between h-16 md:h-20 gap-3">
        
        {/* Mobile: Hamburger */}
        <button
          className="md:hidden flex items-center justify-center text-gray-700 hover:text-[#311b92] transition-colors"
          onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileSearchOpen(false); }}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[26px]">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Brand Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-0.5" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-[#d32f2f] font-poppins font-black text-xl md:text-3xl tracking-tight">Buy</span>
            <span className="text-[#311b92] font-poppins font-black text-xl md:text-3xl tracking-tight">KONGO</span>
          </Link>
        </div>

        {/* Center Search Bar - Desktop only */}
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
            className="bg-[#311b92] hover:bg-[#251375] text-white px-5 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Mobile: Search icon */}
          <button
            className="md:hidden flex items-center justify-center text-gray-700 hover:text-[#311b92] transition-colors"
            onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }}
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 text-gray-800 hover:text-[#311b92] transition-all font-bold text-xs uppercase tracking-wider group"
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[24px] md:text-[26px] group-hover:scale-105 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d32f2f] text-white rounded-full text-[9px] font-black w-4 h-4 flex items-center justify-center border border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* User - Desktop */}
          {user ? (
            <div className="hidden md:flex items-center gap-4 border-l border-gray-200 pl-4">
              <Link
                href="/profile"
                className="font-inter text-xs uppercase tracking-wider text-gray-800 hover:text-[#311b92] font-extrabold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                My Account
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4 text-xs font-bold uppercase tracking-wider">
              <Link href="/login" className="text-gray-800 hover:text-[#311b92] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">login</span>
                Login
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/register" className="text-gray-800 hover:text-[#311b92]">Sign Up</Link>
            </div>
          )}

          {/* Mobile: Account icon */}
          {user ? (
            <Link href="/profile" className="md:hidden text-gray-700 hover:text-[#311b92]" aria-label="My Account">
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
            </Link>
          ) : (
            <Link href="/login" className="md:hidden text-gray-700 hover:text-[#311b92]" aria-label="Login">
              <span className="material-symbols-outlined text-[24px]">login</span>
            </Link>
          )}

          {/* EN/LKR label - desktop only */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-gray-500 font-bold border-l border-gray-200 pl-4 uppercase">
            <span>EN</span>
            <span>/</span>
            <span>LKR</span>
          </div>
        </div>
      </div>

      {/* ========== MOBILE SEARCH BAR ========== */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = (e.currentTarget.elements.namedItem('mobileSearch') as HTMLInputElement).value;
              if (query.trim()) {
                setMobileSearchOpen(false);
                window.location.href = `/shop?search=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="flex items-stretch border-2 border-[#311b92] rounded overflow-hidden"
          >
            <input
              type="text"
              name="mobileSearch"
              autoFocus
              placeholder="Search for products..."
              className="w-full bg-[#f9f9f9] border-none py-2.5 px-4 font-inter text-sm text-black focus:outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="bg-[#311b92] text-white px-4 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </form>
        </div>
      )}

      {/* ========== ROW 2: Purple Nav Bar (Desktop only) ========== */}
      <div className="hidden md:block bg-[#4a148c] text-white border-t border-purple-950">
        <div className="site-container flex items-center justify-between h-11 md:h-12">

          {/* All Categories - desktop */}
          <div className="relative group h-full hidden md:block">
            <button className="bg-[#310a62] hover:bg-[#200542] text-white px-5 h-full flex items-center gap-2 font-inter text-xs uppercase tracking-widest font-black transition-colors">
              <span className="material-symbols-outlined text-[18px]">menu</span>
              All Categories
            </button>
            <div className="absolute top-12 left-0 w-56 bg-white border border-gray-200 shadow-2xl rounded-b py-2 hidden group-hover:block z-50 text-black font-semibold font-inter">
              <Link href="/shop?category=Electronics" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">devices</span>Electronics
              </Link>
              <Link href="/shop?category=Fashion" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">checkroom</span>Fashion
              </Link>
              <Link href="/shop?category=Beauty" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">spa</span>Beauty
              </Link>
              <Link href="/shop?category=Home%20%26%20Living" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">home</span>Home & Living
              </Link>
              <Link href="/shop?category=Accessories" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">shopping_bag</span>Accessories
              </Link>
              <Link href="/shop?category=Watches" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">watch</span>Watches
              </Link>
              <Link href="/shop?category=Furniture" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">chair</span>Furniture
              </Link>
              <Link href="/shop?category=Kitchen%20Appliances" className="flex items-center gap-2.5 px-4 py-2.5 text-xs uppercase hover:bg-gray-100 hover:text-purple-800 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-gray-500">blender</span>Kitchen Appliances
              </Link>
            </div>
          </div>

          {/* Mobile: quick links row */}
          <nav className="flex md:hidden items-center gap-4 font-inter text-[11px] uppercase tracking-widest font-extrabold text-purple-100 overflow-x-auto scrollbar-hide whitespace-nowrap">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-sm">home</span>Home
            </Link>
            <Link href="/shop?offers=only" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 font-black shrink-0">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>Offers
            </Link>
            <Link href="/shop?category=Electronics" className="hover:text-white flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-sm">devices</span>Electronics
            </Link>
            <Link href="/shop?category=Fashion" className="hover:text-white flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-sm">checkroom</span>Fashion
            </Link>
            <Link href="/shop?category=Beauty" className="hover:text-white flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-sm">spa</span>Beauty
            </Link>
          </nav>

          {/* Desktop: Quick Category links */}
          <nav className="hidden md:flex items-center gap-6 font-inter text-xs uppercase tracking-widest font-extrabold text-purple-100">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">home</span>Home
            </Link>
            <Link href="/shop?offers=only" className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1 font-black">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>Today's Offers
            </Link>
          </nav>

          {/* Order History link */}
          <div className="hidden md:flex items-center gap-6 font-inter text-xs font-bold text-purple-200">
            <Link href="/profile" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[18px]">history</span>Order History
            </Link>
          </div>

        </div>
      </div>

      {/* ========== MOBILE SLIDE-DOWN MENU ========== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl z-40">
          
          {/* User section */}
          <div className="px-4 py-4 border-b border-gray-100 bg-purple-50">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[32px] text-purple-700">account_circle</span>
                <div>
                  <p className="font-inter text-sm font-bold text-gray-900">{user.email}</p>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xs text-purple-700 font-semibold">View Profile →</Link>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-[#311b92] text-white py-2.5 rounded font-inter text-sm font-bold uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center border-2 border-[#311b92] text-[#311b92] py-2.5 rounded font-inter text-sm font-bold uppercase tracking-wider"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-3">Browse Categories</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Electronics', icon: 'devices', slug: 'Electronics' },
                { name: 'Fashion', icon: 'checkroom', slug: 'Fashion' },
                { name: 'Beauty', icon: 'spa', slug: 'Beauty' },
                { name: 'Home & Living', icon: 'home', slug: 'Home%20%26%20Living' },
                { name: 'Accessories', icon: 'shopping_bag', slug: 'Accessories' },
                { name: 'Watches', icon: 'watch', slug: 'Watches' },
                { name: 'Kitchen Appliances', icon: 'blender', slug: 'Kitchen%20Appliances' },
              ].map(cat => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <span className="material-symbols-outlined text-[22px] text-purple-700">{cat.icon}</span>
                  <span className="font-inter text-[10px] font-bold text-gray-700 text-center uppercase tracking-wide leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="px-4 py-2">
            {[
              { href: '/shop', icon: 'storefront', label: 'All Products' },
              { href: '/shop?offers=only', icon: 'local_fire_department', label: "Today's Offers", highlight: true },
              { href: '/cart', icon: 'shopping_cart', label: 'My Cart' },
              { href: '/profile', icon: 'history', label: 'Order History' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 font-inter text-sm font-semibold ${link.highlight ? 'text-red-600' : 'text-gray-800'} hover:text-purple-700 transition-colors`}
              >
                <span className={`material-symbols-outlined text-[20px] ${link.highlight ? 'text-red-500' : 'text-gray-400'}`}>{link.icon}</span>
                {link.label}
                <span className="material-symbols-outlined text-[16px] text-gray-300 ml-auto">chevron_right</span>
              </Link>
            ))}
          </div>

        </div>
      )}

    </header>
  );
}
