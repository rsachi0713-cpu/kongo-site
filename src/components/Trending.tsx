import Link from 'next/link';
import ProductCard from './ProductCard';
import { createClient } from '@/utils/supabase/server';

export default async function Trending() {
  const supabase = await createClient();
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  const products = dbProducts || [];

  return (
    <section className="py-[120px] px-5 md:px-16 max-w-[1440px] mx-auto animate-fade-in-up">
      <div className="flex items-end justify-between mb-16">
        <div>
          <h2 className="font-poppins text-3xl md:text-4xl font-semibold text-black mb-2 tracking-tight">Trending Now</h2>
          <p className="font-inter text-base text-gray-500">The most coveted pieces of the season.</p>
        </div>
        <Link href="/shop" className="hidden md:inline-flex items-center gap-2 font-inter text-sm uppercase tracking-wider text-black hover:opacity-80 transition-opacity font-medium">
          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 rounded">
          <p className="font-inter text-sm text-gray-500">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              category={product.category}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
            />
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center md:hidden">
        <Link href="/shop" className="inline-block bg-transparent text-black border border-black px-8 py-4 rounded font-inter text-sm uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 w-full font-medium">
          View All Trending
        </Link>
      </div>
    </section>
  );
}
