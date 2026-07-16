import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/utils/supabase/server';
import SortSelect from './SortSelect';

export default async function Shop({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    search?: string; 
    category?: string; 
    minPrice?: string; 
    maxPrice?: string; 
    sortBy?: string;
  }> 
}) {
  const params = await searchParams;
  const searchQuery = params?.search || '';
  const selectedCategory = params?.category || '';
  const minPriceStr = params?.minPrice || '';
  const maxPriceStr = params?.maxPrice || '';
  const sortBy = params?.sortBy || 'newest';

  const supabase = await createClient();
  let query = supabase.from('products').select('*').eq('status', 'Active');
  
  // 1. Filter by Search Query
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  // 2. Filter by Category
  if (selectedCategory && selectedCategory !== 'All') {
    query = query.ilike('category', selectedCategory);
  }

  // 3. Filter by Price Range
  if (minPriceStr) {
    const minPrice = parseFloat(minPriceStr);
    if (!isNaN(minPrice)) {
      query = query.gte('price', minPrice);
    }
  }
  if (maxPriceStr) {
    const maxPrice = parseFloat(maxPriceStr);
    if (!isNaN(maxPrice)) {
      query = query.lte('price', maxPrice);
    }
  }

  // 4. Sort Products
  if (sortBy === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sortBy === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    // default/newest
    query = query.order('created_at', { ascending: false });
  }

  const { data: products } = await query;

  // Helper to build URLs that preserve current filter state
  const getCategoryUrl = (cat: string) => {
    const nextParams = new URLSearchParams();
    if (searchQuery) nextParams.set('search', searchQuery);
    if (cat && cat !== 'All') nextParams.set('category', cat);
    if (minPriceStr) nextParams.set('minPrice', minPriceStr);
    if (maxPriceStr) nextParams.set('maxPrice', maxPriceStr);
    if (sortBy) nextParams.set('sortBy', sortBy);
    return `/shop?${nextParams.toString()}`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-12 animate-fade-in-up">
      {/* Header & Breadcrumbs */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav aria-label="Breadcrumb" className="flex text-gray-500 font-inter text-xs uppercase tracking-widest mb-4 font-semibold">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                  <span className="text-black border-b border-black pb-0.5">Shop</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="font-poppins text-3xl md:text-4xl font-semibold text-black tracking-tight">
            {searchQuery ? `Search: "${searchQuery}"` : selectedCategory ? `${selectedCategory} Collection` : 'All Products'}
          </h1>
          <p className="font-inter text-base text-gray-500 mt-2 max-w-2xl">
            {searchQuery 
              ? `Showing results for "${searchQuery}"` 
              : 'Curated excellence. Discover our collection of premium pieces designed for the Sri Lankan lifestyle.'}
          </p>
        </div>
        
        <div className="flex items-center gap-4 self-start md:self-end">
          <span className="font-inter text-xs uppercase tracking-widest text-gray-500 font-semibold">Sort By</span>
          <SortSelect currentSort={sortBy} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0 pr-8">
          <div className="sticky top-28 space-y-10">
            
            {/* Categories */}
            <div>
              <h3 className="font-inter text-xs uppercase tracking-widest text-black border-b border-gray-200 pb-3 mb-4 font-semibold">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href={getCategoryUrl('All')} 
                    className={`font-inter text-sm transition-colors flex justify-between group ${
                      !selectedCategory || selectedCategory === 'All' ? 'text-black font-bold' : 'text-gray-500 hover:text-black font-semibold'
                    }`}
                  >
                    <span>All</span>
                  </Link>
                </li>
                {['Accessories', 'Beauty', 'Electronics', 'Home & Living', 'Fashion', 'Watches', 'Furniture'].map(cat => (
                  <li key={cat}>
                    <Link 
                      href={getCategoryUrl(cat)} 
                      className={`font-inter text-sm transition-colors flex justify-between group ${
                        selectedCategory === cat ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      <span>{cat}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Price Filter Form */}
            <div>
              <h3 className="font-inter text-xs uppercase tracking-widest text-black border-b border-gray-200 pb-3 mb-4 font-semibold">Price</h3>
              <form action="/shop" method="GET" className="space-y-3">
                {/* Preserve other search & category settings */}
                {searchQuery && <input type="hidden" name="search" value={searchQuery} />}
                {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
                {sortBy && <input type="hidden" name="sortBy" value={sortBy} />}

                <div className="flex gap-4">
                  <input 
                    name="minPrice"
                    defaultValue={minPriceStr}
                    className="w-full bg-[#f3f3f3] border-none rounded py-2 px-3 font-inter text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400" 
                    placeholder="LKR Min" 
                    type="number" 
                    min="0"
                  />
                  <input 
                    name="maxPrice"
                    defaultValue={maxPriceStr}
                    className="w-full bg-[#f3f3f3] border-none rounded py-2 px-3 font-inter text-sm text-black outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400" 
                    placeholder="LKR Max" 
                    type="number" 
                    min="0"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-black text-white py-2 rounded font-inter text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
                >
                  Apply Price
                </button>
                {(minPriceStr || maxPriceStr) && (
                  <Link 
                    href={getCategoryUrl(selectedCategory)} 
                    className="block text-center text-xs text-red-600 font-semibold font-inter hover:underline pt-1"
                  >
                    Clear Price Filter
                  </Link>
                )}
              </form>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {(!products || products.length === 0) ? (
              <div className="col-span-full py-12 text-center border border-dashed border-gray-200 rounded">
                <p className="font-inter text-gray-500">No products found matching your criteria.</p>
                {(searchQuery || selectedCategory || minPriceStr || maxPriceStr) && (
                  <Link href="/shop" className="mt-4 inline-block text-xs uppercase tracking-wider font-bold bg-black text-white px-6 py-3 rounded">
                    Clear All Filters
                  </Link>
                )}
              </div>
            ) : (
              products.map(product => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  category={product.category}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
