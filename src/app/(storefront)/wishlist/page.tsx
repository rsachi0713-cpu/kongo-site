import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/utils/supabase/server';
import { getWishlistItems } from './actions';

export default async function Wishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, force redirect to login
  if (!user) {
    return redirect('/login?next=/wishlist');
  }

  const wishlistProducts = await getWishlistItems();

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-12 animate-fade-in-up">
      <div className="mb-12 border-b border-gray-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-poppins text-3xl md:text-4xl font-semibold text-black tracking-tight">Your Wishlist</h1>
          <p className="font-inter text-base text-gray-500 mt-2">Items you've saved for later.</p>
        </div>
        <Link 
          href="/shop" 
          className="border border-black text-black font-inter font-semibold px-6 py-2.5 rounded text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
        >
          Back to Shop
        </Link>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              category={product.category}
              name={product.name}
              price={Number(product.price)}
              imageUrl={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">favorite</span>
          <h2 className="font-poppins text-xl font-medium text-black mb-2">Your wishlist is empty</h2>
          <p className="font-inter text-gray-500 mb-6">Explore our collections and save your favorite items.</p>
          <Link href="/shop" className="inline-block bg-black text-white px-8 py-3.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity">
            Discover Products
          </Link>
        </div>
      )}
    </div>
  );
}


export const runtime = 'edge';
