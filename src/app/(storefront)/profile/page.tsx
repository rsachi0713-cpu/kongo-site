import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Force login redirect if unauthenticated
  if (!user) {
    return redirect('/login?next=/profile');
  }

  // Get customer profile details
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Get orders history
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const firstName = profile?.first_name || user.user_metadata?.first_name || 'Customer';
  const lastName = profile?.last_name || user.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const dateJoined = new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-12 animate-fade-in-up">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-gray-500 font-inter text-xs uppercase tracking-widest mb-8 font-semibold">
        <ol className="inline-flex items-center space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-black border-b border-black pb-0.5">My Account</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Customer Profile Details */}
        <div className="w-full lg:w-[350px] shrink-0 space-y-6">
          <div className="bg-[#f9f9f9] border border-gray-200 p-8 rounded-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-poppins text-xl font-semibold uppercase">
                {firstName[0]}
              </div>
              <div>
                <h2 className="font-poppins text-lg font-bold text-black leading-tight">{fullName}</h2>
                <span className="font-inter text-xs bg-gray-200 text-black font-semibold px-2 py-0.5 rounded-full capitalize">
                  {profile?.role || 'Customer'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 py-4 space-y-4 font-inter text-sm text-gray-600">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Email Address</p>
                <p className="text-black font-medium mt-0.5">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Member Since</p>
                <p className="text-black font-medium mt-0.5">{dateJoined}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <form action={async () => {
                "use server";
                const { logout } = await import('@/app/login/actions');
                await logout();
              }}>
                <button 
                  type="submit" 
                  className="w-full bg-black text-white py-3 rounded font-inter text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Order History list */}
        <div className="flex-1 w-full space-y-6">
          <h2 className="font-poppins text-2xl font-semibold text-black border-b border-gray-200 pb-3 tracking-tight">
            Order History
          </h2>

          {error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded font-inter text-sm">
              Failed to fetch orders: {error.message}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-gray-200 rounded-sm">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">receipt_long</span>
              <h3 className="font-poppins text-lg font-semibold text-black mb-1">No Orders Found</h3>
              <p className="font-inter text-sm text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <Link 
                href="/shop" 
                className="inline-block bg-black text-white px-8 py-3.5 rounded font-inter text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-[#f9f9f9] font-inter text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4 text-left">Order ID</th>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-inter text-sm text-black">
                  {orders.map((order) => {
                    const date = new Date(order.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                    
                    const firstProduct = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;
                    const productLink = firstProduct?.product_id ? `/product/${firstProduct.product_id}` : '/shop';
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold max-w-[120px] truncate" title={order.id}>
                          <Link href={productLink} className="text-black hover:underline">
                            #{order.id.substring(0, 8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={productLink} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center rounded overflow-hidden shrink-0">
                              <img 
                                src={firstProduct?.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} 
                                alt={firstProduct?.name || 'Product'} 
                                className="w-full h-full object-cover p-0.5 group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-black group-hover:underline truncate block" title={firstProduct?.name}>
                                {firstProduct?.name || 'Order Details'}
                              </span>
                              {order.items && order.items.length > 1 && (
                                <span className="text-[10px] text-gray-500 block font-medium">+{order.items.length - 1} more items</span>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            order.status === 'Completed' || order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.status === 'Processing' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold">
                          LKR {Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
