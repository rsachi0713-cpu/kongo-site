import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 w-full border-t border-gray-200">
      <div className="site-container py-12 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <div className="flex items-center gap-0.5">
            <span className="font-poppins text-xl text-[#d32f2f] font-black tracking-tight">Buy</span>
            <span className="font-poppins text-xl text-[#311b92] font-black tracking-tight">KONGO</span>
          </div>
          <p className="font-inter text-sm text-gray-500">
            Elevating your everyday with curated quality.
          </p>
        </div>
        
        {/* Links */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col gap-3">
            <p className="font-inter text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Company</p>
            <Link href="/about" className="font-inter text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-all">About</Link>
            <Link href="/contact" className="font-inter text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-all">Contact</Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-inter text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Support</p>
            <Link href="/help" className="font-inter text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-all">Help Center</Link>
            <Link href="/privacy" className="font-inter text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-all">Privacy Policy</Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-inter text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Legal</p>
            <Link href="/terms" className="font-inter text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-all">Terms & Conditions</Link>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="col-span-1 md:col-span-4 mt-4 md:mt-12 pt-6 border-t border-gray-200 text-center">
          <span className="font-inter text-sm text-gray-400">
            © {new Date().getFullYear()} BuyKONGO. All rights reserved.
          </span>
        </div>
        
      </div>
    </footer>
  );
}
