import Link from 'next/link';
import HotDealCard from './HotDealCard';
import { createClient } from '@/utils/supabase/server';

export default async function HotDeals() {
  const supabase = await createClient();
  
  // 1. Fetch products where is_offer = true
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_offer', true)
    .order('created_at', { ascending: false })
    .limit(4);

  let products = dbProducts || [];
  let isUsingFallback = false;

  // 2. If no products are marked as offers yet, fall back to recent products
  if (products.length === 0) {
    const { data: fallbackProducts } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);
    products = fallbackProducts || [];
    isUsingFallback = true;
  }

  // Fallback discounts from Abans screenshot: 22%, 25%, 26%, 11%
  const fallbackDiscounts = [22, 25, 26, 11];

  return (
    <section className="py-20 px-5 md:px-16 max-w-[1440px] mx-auto animate-fade-in-up">
      {/* Deals Header Section */}
      <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-5">
        <div>
          <span className="text-red-600 font-inter text-xs uppercase tracking-widest font-black block mb-2">Limited Time Offers</span>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-black tracking-tight flex items-center gap-2">
            Today's Promotional Offers
            <span className="material-symbols-outlined text-red-600 animate-bounce">local_fire_department</span>
          </h2>
        </div>
        <Link href="/shop" className="hidden md:inline-flex items-center gap-2 font-inter text-xs uppercase tracking-widest text-purple-700 hover:text-black transition-colors font-extrabold">
          View All Offers <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">inventory_2</span>
          <p className="font-inter text-sm text-gray-500">No active promotional deals available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            // Determine discount percentage and offer end date
            const discount = isUsingFallback 
              ? fallbackDiscounts[index % fallbackDiscounts.length] 
              : (product.discount_percent || 0);

            const endDate = isUsingFallback 
              ? null 
              : product.offer_end_date;

            return (
              <HotDealCard 
                key={product.id} 
                id={product.id}
                category={product.category}
                name={product.name}
                price={Number(product.price)}
                imageUrl={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
                discountPercent={discount}
                offerEndDate={endDate}
                originalPrice={isUsingFallback ? null : product.original_price}
              />
            );
          })}
        </div>
      )}
      
      <div className="mt-10 text-center md:hidden">
        <Link href="/shop" className="inline-block w-full bg-black text-white px-8 py-4 rounded font-inter text-xs uppercase tracking-widest hover:opacity-90 font-bold text-center">
          View All Offers
        </Link>
      </div>
    </section>
  );
}
