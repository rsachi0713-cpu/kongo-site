import { createClient } from '@/utils/supabase/server';

export default async function AdminTopbar() {
  const supabase = await createClient();
  
  // Count unread orders
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
    
  const hasUnreadOrders = count ? count > 0 : false;
  
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button (placeholder) */}
        <button className="md:hidden text-gray-500 hover:text-black transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        {/* Search */}
        <div className="hidden md:flex relative w-64 lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search admin..." 
            className="w-full bg-[#f3f3f3] border-none py-2 pl-10 pr-4 rounded font-inter text-sm text-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-black transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          {hasUnreadOrders && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-inter font-medium text-sm">
            AD
          </div>
          <div className="hidden md:block">
            <p className="font-inter text-sm font-semibold text-black">Admin User</p>
            <p className="font-inter text-xs text-gray-500">Superadmin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
