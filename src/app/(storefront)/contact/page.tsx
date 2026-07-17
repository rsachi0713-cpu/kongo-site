"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }
    setSubmitted(true);
  };

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
              <span className="text-black border-b border-black pb-0.5">Contact Us</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-12">
        <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-black tracking-tight mb-2">Contact Us</h1>
        <p className="font-inter text-gray-500 text-sm">We are here to help with any inquiries or custom orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Contact Info (Details) */}
        <div className="col-span-1 space-y-8">
          <div className="bg-gray-50 p-8 border border-gray-200 rounded-sm space-y-6">
            <h2 className="font-poppins text-xl font-bold text-black border-b border-gray-200 pb-3">Get in Touch</h2>
            
            <div className="space-y-4 font-inter text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-black">mail</span>
                <div>
                  <p className="font-semibold text-black">Email Support</p>
                  <a href="mailto:info@kongo.lk" className="hover:underline mt-0.5 block">info@kongo.lk</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-black">call</span>
                <div>
                  <p className="font-semibold text-black">Call Us</p>
                  <p className="mt-0.5">+94 75 395 1531</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-black">chat</span>
                <div>
                  <p className="font-semibold text-black">WhatsApp Chat</p>
                  <a 
                    href="https://wa.me/94753951531" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-700 font-bold hover:underline mt-0.5 block"
                  >
                    +94 75 395 1531
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-200/80 pt-4">
                <span className="material-symbols-outlined text-black">location_on</span>
                <div>
                  <p className="font-semibold text-black">Headquarters</p>
                  <p className="mt-0.5">Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-span-2 bg-white border border-gray-200 p-8 md:p-10 rounded-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in-up">
              <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
              <h2 className="font-poppins text-2xl font-bold text-black">Message Sent!</h2>
              <p className="font-inter text-gray-500 max-w-md mx-auto">
                Thank you for contacting us. Our team will get back to you at your email address shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 border border-black px-6 py-2 rounded text-xs uppercase tracking-widest font-semibold hover:bg-gray-50 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-poppins text-xl font-bold text-black border-b border-gray-100 pb-3">Send us a Message</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactName" className="block font-inter text-xs text-gray-500 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    id="contactName"
                    placeholder="Enter your name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors" 
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block font-inter text-xs text-gray-500 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="contactEmail"
                    placeholder="Enter your email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactMsg" className="block font-inter text-xs text-gray-500 mb-1">Message</label>
                <textarea 
                  id="contactMsg"
                  rows={5}
                  placeholder="How can we help you?" 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors resize-none" 
                />
              </div>

              <button 
                type="submit"
                className="bg-black text-white px-8 py-3.5 rounded font-inter text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
              >
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}



