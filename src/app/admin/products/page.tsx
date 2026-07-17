import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import DeleteButton from './DeleteButton';

export default async function AdminProducts() {
  const supabase = await createClient();
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  const products = dbProducts || [];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-black">Products</h1>
          <p className="font-inter text-sm text-gray-500 mt-1">Manage your product catalog and inventory.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-black text-white px-6 py-2.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 border border-gray-200 rounded-t-sm shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-[#f3f3f3] border-none py-2 pl-10 pr-4 rounded font-inter text-sm text-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="bg-white border border-gray-300 py-2 px-4 rounded font-inter text-sm text-black focus:outline-none focus:border-black flex-1 md:flex-none">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Beauty</option>
          </select>
          <select className="bg-white border border-gray-300 py-2 px-4 rounded font-inter text-sm text-black focus:outline-none focus:border-black flex-1 md:flex-none">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-sm shadow-sm overflow-x-auto">
        <table className="w-full text-left font-inter text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">SKU</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-black">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No products found. Add your first product!</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-gray-400">image</span>
                        )}
                      </div>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.id.substring(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-medium">LKR {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'Active' ? 'bg-green-100 text-green-800' :
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link 
                        href={`/admin/products/${product.id}/edit`} 
                        className="text-gray-400 hover:text-black transition-colors"
                        title="Edit Product"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <DeleteButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="font-inter text-sm text-gray-500">
          Showing 1 to {products.length} of {products.length} {products.length === 1 ? 'entry' : 'entries'}
        </p>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 rounded hover:border-black hover:text-black disabled:opacity-50" disabled>
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-black bg-black text-white rounded font-inter text-sm font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 rounded hover:border-black hover:text-black" disabled>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}


export const runtime = 'edge';
