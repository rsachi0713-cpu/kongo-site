import Link from 'next/link';
import ProductCard from './ProductCard';
import { createClient } from '@/utils/supabase/server';

export default async function Trending() {
  const supabase = await createClient();
  
  // Fetch up to 4 latest trending products
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const products = dbProducts || [];

  return (
    <section className="py-8 md:py-20 px-3 md:px-16 max-w-[1440px] mx-auto animate-fade-in-up">
      <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-5">
        <div>
          <span className="text-purple-700 font-inter text-xs uppercase tracking-widest font-black block mb-2">Customer Favorites</span>
          <h2 className="font-poppins text-2xl md:text-4xl font-bold text-black tracking-tight">Trending Items</h2>
        </div>
        <Link href="/shop" className="hidden md:inline-flex items-center gap-2 font-inter text-xs uppercase tracking-widest text-purple-700 hover:text-black transition-colors font-extrabold">
          View All Items <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">inventory</span>
          <p className="font-inter text-sm text-gray-500">No trending items available yet.</p>
        </div>
      ) : (
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 scrollbar-hide">
          {products.map(product => (
            <div key={product.id} className="min-w-[70vw] sm:min-w-[45vw] md:min-w-0 shrink-0 snap-start">
              <ProductCard 
                id={product.id}
                category={product.category}
                name={product.name}
                price={product.price}
                imageUrl={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center md:hidden">
        <Link href="/shop" className="inline-block bg-black text-white px-8 py-4 rounded font-inter text-xs uppercase tracking-widest hover:opacity-90 transition-all duration-300 w-full font-bold">
          View All Items
        </Link>
      </div>
    </section>
  );
}
