import { createAdminClient } from '@/utils/supabase/admin';
import StatusDropdown from '../orders/StatusDropdown';

export const dynamic = 'force-dynamic';

export default async function AdminWebOrders() {
  const supabase = await createAdminClient();
  
  // 1. Fetch web orders only
  const { data: dbOrders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  // Filter in memory since filtering nested JSONB in Supabase SQL can be tricky via JS client without text search, 
  // though we could use .contains('shipping_address', { payment_method: 'web' })
  // Filtering in memory is safer for this scale.
  const webOrders = (dbOrders || []).filter(
    (order) => order.shipping_address?.payment_method === 'web'
  );

  // 2. Fetch all profiles for names
  const { data: dbProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name');

  const profiles = dbProfiles || [];
  const error = ordersError || profilesError;

  if (error) {
    console.error("Database query error in AdminWebOrders:", error);
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-black flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-500">language</span>
            Web Orders
          </h1>
          <p className="font-inter text-sm text-gray-500 mt-1">Manage all orders placed directly via the website form.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-inter text-sm rounded">
          <strong>Database Query Error:</strong> {error.message} (Code: {error.code || 'unknown'})
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 border border-gray-200 rounded-t-sm shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search web orders..." 
            className="w-full bg-[#f3f3f3] border-none py-2 pl-10 pr-4 rounded font-inter text-sm text-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="bg-white border border-gray-300 py-2 px-4 rounded font-inter text-sm text-black focus:outline-none focus:border-black flex-1 md:flex-none">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-sm shadow-sm overflow-x-auto">
        {webOrders.length === 0 ? (
          <div className="text-center py-12 font-inter text-sm text-gray-500">
            No web orders found.
          </div>
        ) : (
          <table className="w-full text-left font-inter text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Contact No.</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-black">
              {webOrders.map((order: any) => {
                const customerProfile = profiles.find((p: any) => p.id === order.user_id);
                const customerName = order.shipping_address?.first_name 
                  ? `${order.shipping_address.first_name} ${order.shipping_address.last_name || ''}`.trim()
                  : customerProfile 
                    ? `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim() 
                    : 'Unknown Customer';

                const contactNumber = order.shipping_address?.contact_number || 'N/A';

                const date = new Date(order.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold max-w-[150px] truncate" title={order.id}>#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">{customerName}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{contactNumber}</td>
                    <td className="px-6 py-4 text-gray-500">{date}</td>
                    <td className="px-6 py-4 font-medium">LKR {Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">
                      <StatusDropdown orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
