"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Products', href: '/admin/products', icon: 'inventory_2' },
    { name: 'Orders', href: '/admin/orders', icon: 'shopping_bag' },
    { name: 'Web Orders', href: '/admin/web-orders', icon: 'language' },
    { name: 'Customers', href: '/admin/customers', icon: 'group' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-gray-200">
        <Link href="/" className="font-poppins text-2xl font-bold tracking-tight text-black">
          KONGO <span className="text-gray-400 text-sm font-medium">ADMIN</span>
        </Link>
      </div>
      
      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
          return (
            <Link 
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded transition-colors font-inter text-sm font-medium ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
        <Link 
          href="/"
          className="flex items-center gap-4 px-4 py-2.5 rounded transition-colors font-inter text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black"
        >
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          Back to Store
        </Link>
        <button 
          onClick={async () => {
            const { adminLogout } = await import('@/app/admin-login/actions');
            await adminLogout();
          }}
          className="w-full flex items-center gap-4 px-4 py-2.5 rounded transition-colors font-inter text-sm font-medium text-red-600 hover:bg-red-50 text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout Admin
        </button>
      </div>
    </aside>
  );
}
