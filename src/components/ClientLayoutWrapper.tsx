"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import WhatsAppChat from "@/components/WhatsAppChat";

// We define a loose user type to avoid importing from Supabase client everywhere
type User = any;

export default function ClientLayoutWrapper({ children, user }: { children: React.ReactNode; user?: User }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header user={user} />
      <main className="flex-grow pt-16 md:pt-[128px] pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav user={user} />
      <WhatsAppChat />
    </>
  );
}
