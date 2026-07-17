import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminCustomers() {
  const supabase = await createClient();
  
  // 1. Fetch profiles where role = 'customer'
  const { data: dbCustomers, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  const customers = dbCustomers || [];

  // 2. Fetch orders to compute stats
  const { data: dbOrders, error: ordersError } = await supabase
    .from('orders')
    .select('user_id, total_amount');

  const error = profilesError || ordersError;

  if (error) {
    console.error("Database query error in AdminCustomers:", error);
  }

  const customersWithStats = customers.map((cust: any) => {
    const custOrders = dbOrders?.filter(o => o.user_id === cust.id) || [];
    const totalSpent = custOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    
    const name = `${cust.first_name || ''} ${cust.last_name || ''}`.trim() || 'Anonymous User';
    // Generate a fallback safe email based on name since we don't have it directly in profiles
    const email = `${(cust.first_name || 'user').toLowerCase()}.${(cust.last_name || cust.id.slice(0, 4)).toLowerCase()}@kongo.com`;

    return {
      id: cust.id,
      name,
      email,
      ordersCount: custOrders.length,
      totalSpent,
      joined: new Date(cust.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-semibold text-black">Customers</h1>
          <p className="font-inter text-sm text-gray-500 mt-1">Manage your customer base and view their history.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-inter text-sm rounded">
          <strong>Database Query Error:</strong> {error.message} (Code: {error.code || 'unknown'})
          <p className="mt-2 text-xs text-gray-500">
            Note: If RLS (Row Level Security) is enabled on the profiles table in your Supabase project, anonymous/public read queries may be blocked by default.
          </p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 border border-gray-200 rounded-t-sm shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full bg-[#f3f3f3] border-none py-2 pl-10 pr-4 rounded font-inter text-sm text-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-sm shadow-sm overflow-x-auto">
        {customersWithStats.length === 0 ? (
          <div className="text-center py-12 font-inter text-sm text-gray-500">
            No customers found.
          </div>
        ) : (
          <table className="w-full text-left font-inter text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Total Orders</th>
                <th className="px-6 py-4 font-semibold">Total Spent</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-black">
              {customersWithStats.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                        {customer.name.charAt(0)}
                      </div>
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4">{customer.ordersCount}</td>
                  <td className="px-6 py-4 font-medium">LKR {customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-gray-500">{customer.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-black transition-colors" aria-label="More Actions">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}



