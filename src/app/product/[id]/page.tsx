import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ImageGallery from './ImageGallery';
import CartActions from './CartActions';
import { checkIsWishlisted } from '@/app/(storefront)/wishlist/actions';
import ProductCountdown from './ProductCountdown';

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: dbProduct, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !dbProduct) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-32 text-center">
        <h1 className="font-poppins text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="font-inter text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop" className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:opacity-90">Back to Shop</Link>
      </div>
    );
  }

  // Format the data from DB
  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    price: Number(dbProduct.price),
    category: dbProduct.category,
    stock: Number(dbProduct.stock || 0),
    description: dbProduct.description || 'No description available for this product.',
    features: [], // Can be added to schema later
    imageUrl: dbProduct.image_url || 'https://via.placeholder.com/600',
    images: dbProduct.images || (dbProduct.image_url ? [dbProduct.image_url] : []),
    isOffer: !!dbProduct.is_offer,
    discountPercent: dbProduct.discount_percent || 0,
    offerEndDate: dbProduct.offer_end_date,
    originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : null
  };
  // Fetch wishlist status
  const isWishlisted = await checkIsWishlisted(product.id);
  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-12 animate-fade-in-up">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-gray-500 font-inter text-xs uppercase tracking-widest mb-12 font-semibold">
        <ol className="inline-flex items-center space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-black border-b border-black pb-0.5">{product.category}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <ImageGallery 
          images={product.images} 
          productName={product.name} 
          productId={product.id}
          initialIsWishlisted={isWishlisted}
        />

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="font-inter text-sm text-gray-500 uppercase tracking-widest font-semibold mb-2">{product.category}</span>
          <h1 className="font-poppins text-4xl font-semibold text-black mb-4">{product.name}</h1>
          {product.isOffer ? (
            <div className="mb-8 flex flex-col gap-4 border border-purple-100 bg-purple-50/10 p-5 rounded-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-inter text-3xl font-black text-black">LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                {product.originalPrice && (
                  <span className="font-inter text-base text-gray-400 line-through">LKR {product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                )}
                <span className="bg-red-600 text-white font-inter text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">{product.discountPercent}% OFF</span>
              </div>
              {product.originalPrice && (
                <div className="text-sm font-bold text-green-700 font-inter bg-green-50/80 px-3 py-1.5 rounded-sm inline-self-start self-start">
                  SAVE LKR {(product.originalPrice - product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              )}
              <div className="border-t border-purple-100/60 pt-3">
                <ProductCountdown offerEndDate={product.offerEndDate} />
              </div>
            </div>
          ) : (
            <span className="font-inter text-2xl text-black font-medium mb-8">LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          )}
          
          <p className="font-inter text-base text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>
          
          {/* Add to Cart Actions */}
            <CartActions productId={product.id} stock={product.stock} user={user} />

          {/* Details Accordion (Static for demo) */}
          <div className="border-t border-gray-200">
            <div className="py-6 border-b border-gray-200">
              <button className="w-full flex items-center justify-between font-inter text-sm uppercase tracking-widest font-semibold text-black">
                Details
                <span className="material-symbols-outlined">expand_less</span>
              </button>
              <div className="mt-4 text-gray-600 font-inter text-sm">
                <ul className="list-disc pl-5 space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="py-6 border-b border-gray-200">
              <button className="w-full flex items-center justify-between font-inter text-sm uppercase tracking-widest font-semibold text-black">
                Shipping &amp; Returns
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



