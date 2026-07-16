import Link from 'next/link';

interface ProductCardProps {
  id: string;
  category: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ id, category, name, price, imageUrl }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="group block cursor-pointer">
      <div className="aspect-square bg-white mb-6 overflow-hidden flex items-center justify-center relative rounded-sm border border-gray-100">
        <img 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          src={imageUrl}
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="material-symbols-outlined text-gray-800 bg-white/80 p-2 rounded-full backdrop-blur-sm hover:text-red-600 transition-colors">favorite</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-inter text-xs text-gray-500 uppercase tracking-widest font-semibold">{category}</span>
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-inter text-base font-bold text-black min-w-0 flex-1">{name}</h3>
          <span className="font-inter text-base font-bold text-black whitespace-nowrap">LKR {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </Link>
  );
}
