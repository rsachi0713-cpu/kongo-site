"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { createOrder, clearCart } from '../cart/actions';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
  } | null;
}

export default function CheckoutForm({ cartItems }: { cartItems: any[] }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [whatsappNum, setWhatsappNum] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'whatsapp' | 'web'>('whatsapp');
  
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  // Math calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price ? Number(item.product.price) : 0;
    return acc + price * item.quantity;
  }, 0);

  const shippingCost = subtotal > 10000 ? 0 : 350;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !address || !city || !postalCode) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    if (paymentMethod === 'whatsapp' && !whatsappNum) {
      alert('Please provide your WhatsApp number.');
      return;
    }
    if (paymentMethod === 'web' && !contactNumber) {
      alert('Please provide a contact number.');
      return;
    }

    startTransition(async () => {
      try {
        // 1. Compile details and save order to Supabase orders table
        const shippingAddress = {
          first_name: firstName,
          last_name: lastName,
          address,
          city,
          postal_code: postalCode,
          payment_method: paymentMethod,
          contact_number: paymentMethod === 'web' ? contactNumber : null,
          whatsapp_number: paymentMethod === 'whatsapp' ? whatsappNum : null
        };

        const itemsSnapshot = cartItems.map(item => ({
          product_id: item.product?.id || null,
          name: item.product?.name || 'Unknown Product',
          price: item.product?.price ? Number(item.product.price) : 0,
          quantity: item.quantity,
          category: item.product?.category || '',
          image_url: item.product?.image_url || ''
        }));

        const dbOrder = await createOrder(total, shippingAddress, itemsSnapshot);
        const orderId = dbOrder.id.substring(0, 8).toUpperCase();

        if (paymentMethod === 'whatsapp') {
          // 2. Build the WhatsApp message
          let itemsText = '';
          cartItems.forEach((item, idx) => {
            if (item.product) {
              const itemPrice = Number(item.product.price);
              const itemTotal = itemPrice * item.quantity;
              itemsText += `${idx + 1}. ${item.product.name} (x${item.quantity}) - LKR ${itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n`;
            }
          });

          const rawMessage = 
`*--- NEW ORDER (KONGO) ---*

*Order ID:* #${orderId}

*Customer Details:*
- Name: ${firstName} ${lastName}
- Address: ${address}, ${city}
- Postal Code: ${postalCode}
- WhatsApp Number: ${whatsappNum}

*Order Items:*
${itemsText}
*Totals:*
- Subtotal: LKR ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- Shipping: ${shippingCost === 0 ? 'FREE' : `LKR ${shippingCost.toFixed(2)}`}
- *Grand Total: LKR ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}*

Please confirm my order. Thank you!`;

          const encodedMessage = encodeURIComponent(rawMessage);
          // Using international format for Sri Lankan numbers: 94753951531
          const waUrl = `https://wa.me/94753951531?text=${encodedMessage}`;

          setWhatsappLink(waUrl);

          // 3. Open WhatsApp in a new tab
          window.open(waUrl, '_blank');
        }

        // 4. Clear the cart in Supabase
        await clearCart();

        // 5. Display success state
        setIsSuccess(true);
      } catch (err: any) {
        alert(err.message || 'Failed to place order. Please try again.');
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-20 animate-fade-in-up bg-white border border-gray-100 rounded p-8 max-w-2xl mx-auto shadow-sm">
        <span className="material-symbols-outlined text-6xl text-green-500 mb-6">check_circle</span>
        <h2 className="font-poppins text-3xl font-bold mb-4 text-black">Order Confirmed!</h2>
        <p className="font-inter text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {paymentMethod === 'whatsapp' 
            ? "Thank you! Your order details have been submitted. We have opened WhatsApp to send the order confirmation message directly to our agent."
            : "Thank you for shopping with us! Your order has been placed successfully and we will contact you shortly to confirm."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {paymentMethod === 'whatsapp' && (
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 text-white font-inter font-semibold px-8 py-4 rounded text-xs uppercase tracking-widest hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              Send WhatsApp Message Again
            </a>
          )}
          <Link 
            href="/" 
            className="bg-black text-white font-inter font-semibold px-8 py-4 rounded text-xs uppercase tracking-widest hover:opacity-90 transition-colors flex items-center justify-center"
          >
            Go back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12 w-full">
      {/* Shipping & Payment Forms */}
      <div className="flex-1 space-y-10">
        {/* Shipping Address */}
        <div>
          <h2 className="font-poppins text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">1. Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="First Name" 
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required 
              className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors" 
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required 
              className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors" 
            />
            <input 
              type="text" 
              placeholder="Address" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              required 
              className="w-full md:col-span-2 bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors" 
            />
            <input 
              type="text" 
              placeholder="City" 
              value={city}
              onChange={e => setCity(e.target.value)}
              required 
              className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors" 
            />
            <input 
              type="text" 
              placeholder="Postal Code" 
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              required 
              className="w-full bg-[#f9f9f9] border border-gray-300 py-3 px-4 font-inter text-sm rounded focus:outline-none focus:border-black transition-colors" 
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="font-poppins text-xl font-medium text-black mb-6 border-b border-gray-200 pb-2">2. Payment Method</h2>
          
          <div className="space-y-4">
            {/* Credit Card */}
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

            {/* PayPal */}
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

            {/* WhatsApp Order */}
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
            
            {/* Web Order */}
            <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${
              paymentMethod === 'web' ? 'border-black bg-gray-50/50' : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="web"
                  checked={paymentMethod === 'web'} 
                  onChange={() => setPaymentMethod('web')}
                  className="w-4 h-4 text-black focus:ring-black" 
                />
                <span className="font-inter text-sm font-medium text-black">Web Order</span>
              </div>
              <span className="material-symbols-outlined text-gray-600 text-xl">language</span>
            </label>
          </div>

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
                    value={whatsappNum}
                    onChange={e => setWhatsappNum(e.target.value)}
                    required
                    className="w-full bg-white border border-green-300 py-2.5 px-4 font-inter text-sm rounded text-black focus:outline-none focus:border-green-600 transition-colors" 
                  />
                </div>
              </div>
            )}
            
            {paymentMethod === 'web' && (
              <div className="p-5 border border-gray-200 rounded-sm bg-gray-50 text-gray-800 font-inter text-sm space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-500 text-2xl">info</span>
                  <p>We will contact you via this number to confirm your order details and arrange delivery.</p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <label htmlFor="contactNumber" className="block font-inter text-xs font-semibold text-gray-700 mb-1.5">Contact Number</label>
                  <input 
                    type="tel" 
                    id="contactNumber"
                    placeholder="e.g. 0771234567" 
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 py-2.5 px-4 font-inter text-sm rounded text-black focus:outline-none focus:border-black transition-colors" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-[#f9f9f9] p-8 border border-gray-200 rounded-sm sticky top-28">
          <h2 className="font-poppins text-xl font-semibold text-black mb-6">Order Summary</h2>
          
          {/* Products List */}
          <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6 border-b border-gray-200 pb-6 pr-2">
            {cartItems.map(item => {
              if (!item.product) return null;
              const price = Number(item.product.price);
              return (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center rounded overflow-hidden">
                    <img 
                      src={item.product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover p-1" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-inter text-sm font-semibold text-black truncate" title={item.product.name}>
                      {item.product.name}
                    </h3>
                    <p className="font-inter text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-inter text-sm font-medium text-black mt-1">
                      LKR {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mb-4 font-inter text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-black">LKR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between mb-4 font-inter text-sm text-gray-600">
            <span>Shipping</span>
            <span className="font-semibold text-black">
              {shippingCost === 0 ? 'FREE' : `LKR ${shippingCost.toFixed(2)}`}
            </span>
          </div>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <div className="flex justify-between mb-8 font-inter text-base font-bold text-black">
            <span>Total</span>
            <span>LKR {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <button 
            type="submit"
            disabled={isPending}
            className="block w-full bg-black text-white text-center py-4 rounded font-inter text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity disabled:bg-gray-400"
          >
            {isPending ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
}
