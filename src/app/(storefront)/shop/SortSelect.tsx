"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (val: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('sortBy', val);
    router.push(`/shop?${nextParams.toString()}`);
  };

  return (
    <select 
      defaultValue={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-transparent border-b border-gray-300 py-2 pl-0 pr-8 focus:ring-0 focus:border-black font-inter text-sm text-black cursor-pointer transition-colors outline-none font-medium"
      aria-label="Sort products"
    >
      <option value="newest">Newest Arrivals</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="popular">Most Popular</option>
    </select>
  );
}
