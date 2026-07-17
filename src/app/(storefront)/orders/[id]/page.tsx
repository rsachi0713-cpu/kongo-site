import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not logged in
  if (!user) {
    return redirect(`/login?next=/orders/${resolvedParams.id}`);
  }

  // Fetch the order. Security: ensure user_id matches logged-in user
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('user_id', user.id)
    .single();

  if (error || !order) {
    return notFound();
  }

  const date = new Date(order.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const orderId = order.id.substring(0, 8).toUpperCase();
  const items = Array.isArray(order.items) ? order.items : [];
  const shippingAddress = order.shipping_address || {};

  // Totals calculations
  const subtotal = items.reduce((acc: number, item: any) => {
    return acc + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  const shippingCost = subtotal > 10000 ? 0 : 350;
  const total = Number(order.total_amount || subtotal + shippingCost);

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-12 animate-fade-in-up">
      {/* Header & Navigation */}
      <div className="mb-10 border-b border-gray-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="flex text-gray-500 font-inter text-xs uppercase tracking-widest mb-3 font-semibold">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                  <Link href="/orders" className="hover:text-black transition-colors">My Orders</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                  <span className="text-black border-b border-black pb-0.5">Order Details</span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-poppins text-3xl font-semibold text-black tracking-tight">Order #{orderId}</h1>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${
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
          </div>
          <p className="font-inter text-sm text-gray-500 mt-2">Placed on {date}</p>
        </div>
        <Link 
          href="/orders" 
          className="border border-black text-black font-inter font-semibold px-6 py-2.5 rounded text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
        >
          Back to Order List
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Side: Items Purchased */}
        <div className="flex-1 space-y-6 w-full">
          <h2 className="font-poppins text-lg font-semibold text-black border-b border-gray-100 pb-2">Items Ordered ({items.length})</h2>
          
          <div className="border border-gray-200 rounded divide-y divide-gray-200">
            {items.map((item: any, idx: number) => {
              const itemPrice = Number(item.price || 0);
              const itemTotal = itemPrice * Number(item.quantity || 1);
              
              return (
                <div key={idx} className="p-6 flex gap-6 items-center">
                  <div className="w-20 h-20 bg-white border border-gray-200 flex items-center justify-center rounded overflow-hidden shrink-0">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'} 
                      alt={item.name} 
                      className="w-full h-full object-cover p-1" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-inter text-base font-semibold text-black truncate">{item.name}</h3>
                    <p className="font-inter text-xs text-gray-500 uppercase tracking-wider mt-1">{item.category}</p>
                    <p className="font-inter text-sm text-gray-500 mt-2">
                      LKR {itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right font-inter text-base font-bold text-black shrink-0">
                    LKR {itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Shipping & Cost Summary */}
        <div className="w-full lg:w-[400px] space-y-8 flex-shrink-0">
          {/* Shipping Details */}
          <div className="bg-[#f9f9f9] border border-gray-200 rounded p-6">
            <h3 className="font-poppins text-base font-semibold text-black mb-4 border-b border-gray-200 pb-2">Shipping Information</h3>
            <div className="font-inter text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-black">{shippingAddress.first_name} {shippingAddress.last_name}</p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.postal_code}</p>
              <div className="border-t border-gray-200/60 my-3 pt-3">
                <p className="text-xs text-gray-500 font-semibold uppercase">WhatsApp Contact</p>
                <p className="text-green-700 font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  {shippingAddress.whatsapp_number}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-[#f9f9f9] border border-gray-200 rounded p-6">
            <h3 className="font-poppins text-base font-semibold text-black mb-4 border-b border-gray-200 pb-2">Order Summary</h3>
            <div className="space-y-3 font-inter text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-black">LKR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-black">
                  {shippingCost === 0 ? 'FREE' : `LKR ${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between text-base font-bold text-black pt-1">
                <span>Total Amount</span>
                <span>LKR {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export const runtime = 'edge';
