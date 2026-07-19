import Link from 'next/link';

interface ProductCardProps {
  id: string;
  category: string;
  name: string;
  price: number;
  imageUrl: string;
  originalPrice?: number | null;
}

export default function ProductCard({ id, category, name, price, imageUrl, originalPrice }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="group block cursor-pointer">
      <div className="aspect-square bg-white mb-2 md:mb-6 overflow-hidden flex items-center justify-center relative rounded-sm border border-gray-100">
        <img 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          src={imageUrl}
        />
        <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="material-symbols-outlined text-gray-800 bg-white/80 p-1.5 md:p-2 rounded-full backdrop-blur-sm hover:text-red-600 transition-colors text-[18px] md:text-[22px]">favorite</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-center text-center mt-2 px-1 mb-2">
        <h3 className="font-inter text-xs md:text-sm font-semibold text-gray-800 truncate w-full" title={name}>{name}</h3>
        <div className="flex items-center justify-center gap-2 mt-0.5 flex-wrap">
          {originalPrice && Number(originalPrice) > price && (
            <span className="font-inter text-[10px] md:text-[11px] text-gray-400 line-through">Rs. {Number(originalPrice).toLocaleString()}</span>
          )}
          <span className="font-inter text-sm md:text-[15px] font-bold text-red-600">Rs. {price.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
        </div>
      </div>
    </Link>
  );
}
