import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
              <span className="text-black border-b border-black pb-0.5">Privacy Policy</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="max-w-3xl mb-12">
        <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-black tracking-tight mb-2">Privacy Policy</h1>
        <p className="font-inter text-gray-500 text-sm">Last updated: July 16, 2026</p>
      </div>

      <div className="max-w-4xl font-inter text-sm text-gray-600 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">1. Information We Collect</h2>
          <p>
            We collect personal information that you provide directly to us when placing orders or registering. This includes your name, shipping address, WhatsApp contact number, and email address. 
          </p>
          <p>
            When processing orders through WhatsApp, your order selections and customer-provided phone numbers are transmitted via secure APIs to initialize chat threads.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to process, fulfill, and manage your orders. We also use your contact details to provide delivery updates, answer customer support requests, and ensure order validity.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">3. Data Sharing &amp; Third Parties</h2>
          <p>
            We do not sell, lease, or rent your personal information to third parties. We share data only as required to complete logistics and delivery operations with shipping partners in Sri Lanka, or as required by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">4. Security of Data</h2>
          <p>
            We take reasonable precautions, including database access controls and secure SSL links, to protect your personal details from unauthorized access, loss, or disclosure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-xl font-bold text-black">5. Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy, please email us at <a href="mailto:privacy@kongo.lk" className="text-black underline">privacy@kongo.lk</a> or contact our WhatsApp support line.
          </p>
        </section>
      </div>
    </div>
  );
}


export const runtime = 'edge';
