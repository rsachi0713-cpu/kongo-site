import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { editProduct } from '../../actions';
import ImagePreview from './ImagePreview';

export default async function EditProductPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ error?: string }> 
}) {
  const { id } = await params;
  const search = await searchParams;
  
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-black hover:text-black transition-colors text-gray-500">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-black">Edit Product</h1>
          <p className="font-inter text-sm text-gray-500 mt-1">Update the details for "{product.name}".</p>
        </div>
      </div>

      {search?.error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 font-inter text-sm rounded">
          {search.error}
        </div>
      )}

      <form action={editProduct} className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 md:p-8 space-y-8">
        {/* Hidden inputs to pass product ID and current image URL */}
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="currentImageUrl" value={product.image_url || ''} />

        {/* Basic Info */}
        <div>
          <h2 className="font-poppins text-lg font-semibold text-black mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-inter text-sm font-medium text-black mb-2">Product Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                defaultValue={product.name}
                placeholder="e.g. Studio Pro Headphones" 
                className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block font-inter text-sm font-medium text-black mb-2">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  required 
                  defaultValue={product.category}
                  className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Watches">Watches</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Kitchen Appliances">Kitchen Appliances</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block font-inter text-sm font-medium text-black mb-2">Status</label>
                <select 
                  id="status" 
                  name="status" 
                  required 
                  defaultValue={product.status}
                  className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Offer Item Toggles */}
            <div className="relative pt-2">
              <input 
                type="checkbox" 
                name="isOffer" 
                id="isOffer" 
                defaultChecked={product.is_offer}
                className="peer absolute left-0 top-1.5 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" 
              />
              <label htmlFor="isOffer" className="block pl-6 pt-0.5 font-inter text-sm font-semibold text-black select-none cursor-pointer">
                Mark as Offer Item
              </label>

              <div className="hidden peer-checked:grid grid-cols-1 md:grid-cols-2 gap-4 border border-purple-100 bg-purple-50/20 p-4 rounded transition-all mt-4">
                <div>
                  <label htmlFor="offerPrice" className="block font-inter text-xs font-semibold text-gray-700 mb-1">Offer Price (LKR) - Actual Sale Price</label>
                  <input 
                    type="number" 
                    id="offerPrice" 
                    name="offerPrice" 
                    step="0.01"
                    min="0"
                    defaultValue={product.is_offer ? Number(product.price) : ''}
                    placeholder="e.g. 10000" 
                    className="w-full bg-white border border-gray-300 py-2 px-3 font-inter text-sm text-black rounded focus:outline-none focus:border-black" 
                  />
                </div>
                <div>
                  <label htmlFor="offerEndDate" className="block font-inter text-xs font-semibold text-gray-700 mb-1">Offer End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    id="offerEndDate" 
                    name="offerEndDate" 
                    defaultValue={product.offer_end_date ? new Date(new Date(product.offer_end_date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 16) : ''}
                    className="w-full bg-white border border-gray-300 py-2 px-3 font-inter text-sm text-black rounded focus:outline-none focus:border-black" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div>
          <h2 className="font-poppins text-lg font-semibold text-black mb-4 pb-2 border-b border-gray-100">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="model_number" className="block font-inter text-sm font-medium text-black mb-2">Model Number</label>
              <input type="text" id="model_number" name="model_number" defaultValue={product.model_number || ''} placeholder="e.g. 32S25NP" className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div>
              <label htmlFor="sku" className="block font-inter text-sm font-medium text-black mb-2">SKU</label>
              <input type="text" id="sku" name="sku" defaultValue={product.sku || ''} placeholder="e.g. THTV32S25NP" className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div>
              <label htmlFor="warranty" className="block font-inter text-sm font-medium text-black mb-2">Warranty Info</label>
              <input type="text" id="warranty" name="warranty" defaultValue={product.warranty || ''} placeholder="e.g. 24 Month(s)" className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div>
              <label htmlFor="delivery_info" className="block font-inter text-sm font-medium text-black mb-2">Standard Delivery</label>
              <input type="text" id="delivery_info" name="delivery_info" defaultValue={product.delivery_info || ''} placeholder="e.g. 3 - 5 Working Days" className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div>
              <label htmlFor="pickup_info" className="block font-inter text-sm font-medium text-black mb-2">Pickup In-Store</label>
              <input type="text" id="pickup_info" name="pickup_info" defaultValue={product.pickup_info || ''} placeholder="e.g. Today Available" className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="shipping_returns" className="block font-inter text-sm font-medium text-black mb-2">Shipping & Returns Info (Accordion Content)</label>
              <textarea 
                id="shipping_returns" 
                name="shipping_returns" 
                rows={4}
                defaultValue={product.shipping_returns || `Standard Delivery: 3-5 working days depending on your location.\nStore Pickup: Usually available same day if ordered before 3PM.\nReturns: We accept returns within 14 days of delivery for unused items in original packaging.`}
                className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div>
          <h2 className="font-poppins text-lg font-semibold text-black mb-4 pb-2 border-b border-gray-100">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block font-inter text-sm font-medium text-black mb-2">Price (LKR)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01" 
                min="0" 
                required 
                defaultValue={product.is_offer && product.original_price ? Number(product.original_price) : product.price}
                placeholder="0.00" 
                className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
              />
            </div>
            <div>
              <label htmlFor="stock" className="block font-inter text-sm font-medium text-black mb-2">Stock Quantity</label>
              <input 
                type="number" 
                id="stock" 
                name="stock" 
                min="0" 
                required 
                defaultValue={product.stock}
                placeholder="0" 
                className="w-full bg-[#f9f9f9] border border-gray-300 py-2.5 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
              />
            </div>
          </div>
        </div>

        {/* Media & Details */}
        <div>
          <h2 className="font-poppins text-lg font-semibold text-black mb-4 pb-2 border-b border-gray-100">Media & Details</h2>
          <div className="space-y-6">
            
            <div className="bg-gray-50 p-4 border border-gray-200 rounded">
              <h3 className="font-inter text-sm font-semibold text-black mb-3">Product Image</h3>
              
              {product.images || product.image_url ? (
                <ImagePreview 
                  initialUrls={product.images || (product.image_url ? [product.image_url] : [])} 
                  productName={product.name} 
                />
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="imageFiles" className="block font-inter text-sm font-medium text-black mb-2">Upload New Image Files (Multiple)</label>
                  <input type="file" id="imageFiles" name="imageFiles" multiple accept="image/*" className="w-full bg-white border border-gray-300 py-2 px-3 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:opacity-90" />
                </div>
                <div className="flex flex-col justify-center relative">
                  <div className="hidden md:flex absolute left-[-16px] top-1/2 -translate-y-1/2 bg-gray-50 px-2 font-inter text-xs font-semibold text-gray-400 z-10">OR</div>
                  <label htmlFor="imageUrl" className="block font-inter text-sm font-medium text-black mb-2">Add Another Image URL</label>
                  <input 
                    type="url" 
                    id="imageUrl" 
                    name="imageUrl" 
                    placeholder="https://example.com/new-image.jpg" 
                    className="w-full bg-white border border-gray-300 py-2 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 font-inter">You can upload multiple new images or add another URL. Existing images that you did not remove will be preserved.</p>
            </div>

            <div>
              <label htmlFor="description" className="block font-inter text-sm font-medium text-black mb-2">Description</label>
              <textarea 
                id="description" 
                name="description" 
                rows={5} 
                defaultValue={product.description || ''}
                placeholder="Describe the product..." 
                className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm text-black rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex justify-end gap-4 border-t border-gray-100">
          <Link href="/admin/products" className="px-6 py-2.5 rounded font-inter text-sm uppercase tracking-wider font-semibold border border-gray-300 text-black hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="bg-black text-white px-8 py-2.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}



