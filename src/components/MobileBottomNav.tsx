"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileBottomNavProps {
  user?: any;
}

export default function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href.split('?')[0]);
  };

  const navItems = [
    {
      href: '/',
      icon: 'home',
      label: 'Home',
    },
    {
      href: '/shop',
      icon: 'storefront',
      label: 'Shop',
    },
    {
      href: '/shop?offers=only',
      icon: 'local_fire_department',
      label: 'Offers',
      highlight: true,
    },
    {
      href: '/cart',
      icon: 'shopping_cart',
      label: 'Cart',
    },
    {
      href: user ? '/profile' : '/login',
      icon: user ? 'account_circle' : 'login',
      label: user ? 'Account' : 'Login',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 relative
                ${active
                  ? 'text-[#311b92]'
                  : item.highlight
                    ? 'text-orange-500'
                    : 'text-gray-500 hover:text-[#311b92]'
                }`}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#311b92] rounded-full" />
              )}
              <span
                className={`material-symbols-outlined text-[22px] transition-all duration-200 ${active ? 'scale-110' : ''}`}
                style={active ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className={`font-inter text-[10px] font-bold uppercase tracking-wide leading-none ${active ? 'font-black' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
