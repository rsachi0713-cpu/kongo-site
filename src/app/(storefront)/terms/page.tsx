import Link from 'next/link';

export default function TermsConditionsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-16 animate-fade-in-up">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex text-gray-500 font-inter text-xs uppercase tracking-widest mb-6 font-semibold">
        <ol className="inline-flex items-center space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-black border-b border-black pb-0.5">Terms &amp; Conditions</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="max-w-3xl mb-12">
        <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-black tracking-tight mb-2">Terms &amp; Conditions</h1>
        <p className="font-inter text-gray-500 text-sm">Last updated: July 16, 2026</p>
      </div>

      <div className="max-w-4xl font-inter text-sm text-gray-600 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">1. Acceptance of Terms</h2>
          <p>
            By accessing or purchasing from KONGO, you agree to comply with and be bound by these Terms &amp; Conditions. Please read them carefully before using our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">2. WhatsApp Order Placement</h2>
          <p>
            Orders placed on our platform are finalized and confirmed via WhatsApp. When you click 'Place Order', you will be redirected to WhatsApp. The order is not legally binding until one of our representatives confirms item availability, delivery, and payment verification via the chat window.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">3. Pricing &amp; Payments</h2>
          <p>
            All prices are shown in Sri Lankan Rupees (LKR). Shipping is charged at LKR 350.00 flat rate unless the order total is LKR 10,000.00 or above, in which case shipping is free. Payments are finalized using Cash on Delivery or Direct Bank Transfer as agreed during order verification on WhatsApp.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">4. Returns &amp; Exchanges</h2>
          <p>
            We accept returns only for products that are delivered damaged or defective. Return claims must be filed via WhatsApp support within 7 days of receiving the order, accompanied by clear image proof.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">5. Amendments</h2>
          <p>
            We reserve the right to amend pricing, catalogs, or these terms at any time. Your continued use of the platform constitutes acceptance of all updated conditions.
          </p>
        </section>
      </div>
    </div>
  );
}


export const runtime = 'edge';
