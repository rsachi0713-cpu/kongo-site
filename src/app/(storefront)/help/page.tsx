"use client";

import { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How do I place an order via WhatsApp?",
    answer: "Add the desired products to your cart and proceed to Checkout. Select 'WhatsApp Order' as your payment method, fill in your delivery details and contact number, and click 'Place Order'. A WhatsApp window will open containing your formatted order. Click 'Send' to submit your order to our sales agent, who will confirm it with bank transfer details or Cash on Delivery info."
  },
  {
    question: "What are the shipping charges?",
    answer: "We offer a flat delivery rate of LKR 350.00 island-wide in Sri Lanka. If your order total is LKR 10,000.00 or above, you qualify for free delivery."
  },
  {
    question: "How long does shipping take?",
    answer: "Delivery typically takes 2 to 4 business days for major metropolitan areas, and 3 to 5 business days for outer locations across Sri Lanka."
  },
  {
    question: "Can I pay using online Credit/Debit cards?",
    answer: "Online card payments and PayPal checkout options are currently marked as 'Coming Soon'. We are working on integrating standard gateways securely and they will be live shortly. For now, all transactions are finalized via WhatsApp (Bank Transfer or Cash on Delivery)."
  },
  {
    question: "What is your return policy?",
    answer: "We support returns for damaged or defective items within 7 days of delivery. The item must be unused, in its original packaging, and with all tags intact. Please message us on WhatsApp with pictures of the damaged item to start a return."
  }
];

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
              <span className="text-black border-b border-black pb-0.5">Help Center</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="max-w-3xl mb-12">
        <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-black tracking-tight mb-2">Help Center &amp; FAQs</h1>
        <p className="font-inter text-gray-500 text-base">Find answers to frequently asked questions about ordering, shipping, and payments.</p>
      </div>

      <div className="max-w-4xl border border-gray-200 rounded divide-y divide-gray-200 bg-white shadow-sm">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="p-6 transition-colors hover:bg-gray-50/30">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center text-left font-poppins text-base md:text-lg font-semibold text-black focus:outline-none"
              >
                <span>{faq.question}</span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : 'text-gray-400'}`}>
                  expand_more
                </span>
              </button>
              
              <div className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
              }`}>
                <div className="overflow-hidden font-inter text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-gray-50 p-8 border border-gray-200 rounded-sm text-center max-w-4xl">
        <h3 className="font-poppins text-xl font-bold text-black mb-2">Still need help?</h3>
        <p className="font-inter text-gray-600 text-sm mb-6">Our customer support team is available on WhatsApp to answer any queries directly.</p>
        <a 
          href="https://wa.me/94753951531" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white font-inter font-semibold px-8 py-3.5 rounded text-xs uppercase tracking-widest hover:bg-green-700 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">chat</span>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}



