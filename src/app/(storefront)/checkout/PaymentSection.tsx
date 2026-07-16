"use client";

import { useState } from 'react';

export default function PaymentSection() {
  // Set default payment method to 'whatsapp' as it is the only active one
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'whatsapp'>('whatsapp');

  return (
    <div>
      <h2 className="font-poppins text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">2. Payment Method</h2>
      
      {/* Radio Selector Options */}
      <div className="space-y-4">
        {/* Credit Card (Disabled - Coming Soon) */}
        <label className="flex items-center justify-between p-4 border border-gray-200 rounded cursor-not-allowed opacity-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="payment" 
              value="card"
              disabled
              checked={paymentMethod === 'card'} 
              className="w-4 h-4 text-gray-400 focus:ring-0 cursor-not-allowed" 
            />
            <span className="font-inter text-sm font-medium text-gray-500">
              Credit / Debit Card <span className="text-xs text-red-500 ml-1 font-semibold">(Coming Soon)</span>
            </span>
          </div>
          <div className="flex gap-2 opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-4 w-auto object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 w-auto object-contain" />
          </div>
        </label>

        {/* PayPal (Disabled - Coming Soon) */}
        <label className="flex items-center justify-between p-4 border border-gray-200 rounded cursor-not-allowed opacity-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="payment" 
              value="paypal"
              disabled
              checked={paymentMethod === 'paypal'} 
              className="w-4 h-4 text-gray-400 focus:ring-0 cursor-not-allowed" 
            />
            <span className="font-inter text-sm font-medium text-gray-500">
              PayPal <span className="text-xs text-red-500 ml-1 font-semibold">(Coming Soon)</span>
            </span>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 w-auto object-contain opacity-50" />
        </label>

        {/* WhatsApp Order (Active) */}
        <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${
          paymentMethod === 'whatsapp' ? 'border-black bg-gray-50/50' : 'border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="payment" 
              value="whatsapp"
              checked={paymentMethod === 'whatsapp'} 
              onChange={() => setPaymentMethod('whatsapp')}
              className="w-4 h-4 text-black focus:ring-black" 
            />
            <span className="font-inter text-sm font-medium text-black">WhatsApp Order</span>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-5 w-auto object-contain" />
        </label>
      </div>
      
      {/* Conditional Sub-forms */}
      <div className="mt-6">
        {paymentMethod === 'whatsapp' && (
          <div className="p-5 border border-gray-200 rounded-sm bg-[#e8f5e9]/50 text-green-900 font-inter text-sm space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600 text-2xl">chat</span>
              <p>Your order details will be prepared. Clicking 'Place Order' will open WhatsApp to send your order directly to our sales agent.</p>
            </div>
            <div className="border-t border-green-200/50 pt-3">
              <label htmlFor="whatsappNum" className="block font-inter text-xs font-semibold text-green-800 mb-1.5">WhatsApp Mobile Number</label>
              <input 
                type="tel" 
                id="whatsappNum"
                placeholder="e.g. 0771234567" 
                required
                className="w-full bg-white border border-green-300 py-2.5 px-4 font-inter text-sm rounded text-black focus:outline-none focus:border-green-600 transition-colors" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
