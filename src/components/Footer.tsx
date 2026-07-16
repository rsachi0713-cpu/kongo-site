import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 w-full border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-20 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col items-start gap-4">
          <span className="font-poppins text-2xl text-black font-bold tracking-tight">KONGO</span>
          <p className="font-inter text-base text-gray-500 mt-2">
            Elevating your everyday with curated quality.
          </p>
        </div>
        
        {/* Links */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/about" className="font-inter text-base text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all">About</Link>
            <Link href="/contact" className="font-inter text-base text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all">Contact</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/help" className="font-inter text-base text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all">Help Center</Link>
            <Link href="/privacy" className="font-inter text-base text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all">Privacy Policy</Link>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/terms" className="font-inter text-base text-gray-500 hover:text-black hover:underline underline-offset-4 transition-all">Terms & Conditions</Link>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="col-span-1 md:col-span-4 mt-12 pt-8 border-t border-gray-200 text-center">
          <span className="font-inter text-base text-gray-500">
            © {new Date().getFullYear()} KONGO. All rights reserved.
          </span>
        </div>
        
      </div>
    </footer>
  );
}
