import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch products count
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch top products (fallback to latest products for now since we don't have sales stats)
  const { data: dbTopProducts } = await supabase
    .from('products')
    .select('*')
    .limit(4);

  const topProducts = dbTopProducts || [];

  // 3. Fetch orders stats
  const { data: ordersData } = await supabase
    .from('orders')
    .select('total_amount');

  const totalOrders = ordersData?.length || 0;
  const totalRevenue = ordersData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

  // 4. Fetch profiles count (customers)
  const { count: totalCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 5. Fetch recent 5 orders with customer profile
  const { data: dbRecentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      profiles (
        first_name,
        last_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  const recentOrders = dbRecentOrders || [];

  const stats = [
    { name: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: 'Live', trend: 'up' },
    { name: 'Total Orders', value: totalOrders.toString(), change: 'Live', trend: 'up' },
    { name: 'Total Products', value: (totalProducts || 0).toString(), change: 'Live', trend: 'up' },
    { name: 'New Customers', value: (totalCustomers || 0).toString(), change: 'Live', trend: 'up' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-poppins text-2xl font-semibold text-black">Dashboard Overview</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
            <h3 className="font-inter text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">{stat.name}</h3>
            <div className="flex items-end justify-between">
              <span className="font-poppins text-2xl font-bold text-black">{stat.value}</span>
              <span className="font-inter text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-poppins text-lg font-semibold text-black">Recent Orders</h2>
            <Link href="/admin/orders" className="font-inter text-sm text-gray-500 hover:text-black font-medium transition-colors">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 font-inter text-sm text-gray-500">
                No orders found.
              </div>
            ) : (
              <table className="w-full text-left font-inter text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-black">
                  {recentOrders.map((order: any) => {
                    let customerName = 'Unknown Customer';
                    if (order.profiles) {
                      if (Array.isArray(order.profiles)) {
                        if (order.profiles[0]) {
                          customerName = `${order.profiles[0].first_name || ''} ${order.profiles[0].last_name || ''}`.trim() || 'Unknown Customer';
                        }
                      } else {
                        customerName = `${order.profiles.first_name || ''} ${order.profiles.last_name || ''}`.trim() || 'Unknown Customer';
                      }
                    }
                    
                    const date = new Date(order.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium max-w-[120px] truncate" title={order.id}>#{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4">{customerName}</td>
                        <td className="px-6 py-4 text-gray-500">{date}</td>
                        <td className="px-6 py-4 font-medium">LKR {Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Completed' || order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-poppins text-lg font-semibold text-black">Latest Products</h2>
          </div>
          <div className="p-6 flex flex-col gap-6">
            {topProducts.length === 0 ? (
              <div className="text-center py-6 font-inter text-sm text-gray-500">
                No products found.
              </div>
            ) : (
              topProducts.map((product: any) => (
                <div key={product.id} className="flex items-center gap-4">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-sm object-cover border border-gray-100" />
                  ) : (
                    <div className="w-12 h-12 bg-[#f3f3f3] rounded-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">package</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-inter text-sm font-semibold text-black truncate">{product.name}</h4>
                    <p className="font-inter text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className="font-inter text-sm font-bold text-black">LKR {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export const runtime = 'edge';
