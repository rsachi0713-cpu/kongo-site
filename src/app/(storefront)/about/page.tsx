import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="site-container py-16 animate-fade-in-up">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex text-gray-500 font-inter text-xs uppercase tracking-widest mb-6 font-semibold">
        <ol className="inline-flex items-center space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-black border-b border-black pb-0.5">About Us</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="max-w-3xl mb-16">
        <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-black mb-6 tracking-tight">About KONGO</h1>
        <p className="font-inter text-lg text-gray-600 leading-relaxed">
          At KONGO, we believe in elevating your everyday experience. We curate high-quality apparel, home goods, and technology accessories designed for a modern, minimalist lifestyle.
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-200 pt-16">
        <div>
          <h2 className="font-poppins text-2xl font-semibold text-black mb-4">Our Philosophy</h2>
          <p className="font-inter text-base text-gray-600 leading-relaxed mb-6">
            We focus on clean lines, durability, and timeless aesthetics. We move away from fast consumerism to bring you curated items that serve a purpose and bring joy to your everyday routines.
          </p>
          <p className="font-inter text-base text-gray-600 leading-relaxed">
            Every product in our inventory is carefully inspected, verified, and sourced directly from reputable designers and manufacturers to guarantee absolute authenticity.
          </p>
        </div>
        <div className="bg-gray-50 p-8 md:p-12 border border-gray-200 flex flex-col justify-center rounded-sm">
          <h3 className="font-poppins text-xl font-bold text-black mb-2">Our Promise</h3>
          <ul className="space-y-4 font-inter text-sm text-gray-600 mt-4">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-black">verified</span>
              <span>100% Authentic and vetted premium brands.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-black">local_shipping</span>
              <span>Fast island-wide delivery in Sri Lanka with flat rates.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-black">support_agent</span>
              <span>Direct personal confirmation and support via WhatsApp.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}



