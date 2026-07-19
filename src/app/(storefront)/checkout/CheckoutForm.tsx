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
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  const [stateProvince, setStateProvince] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('');
  const [deliverToDifferentAddress, setDeliverToDifferentAddress] = useState(false);
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

    if (!firstName || !lastName || !email || !address || !country || !stateProvince || !city || !phoneNumber) {
      alert('Please fill out all required fields.');
      return;
    }

    startTransition(async () => {
      try {
        // 1. Compile details and save order to Supabase orders table
        const shippingAddress = {
          first_name: firstName,
          last_name: lastName,
          email,
          address,
          country,
          state_province: stateProvince,
          city,
          phone_number: phoneNumber,
          secondary_phone_number: secondaryPhoneNumber,
          deliver_to_different_address: deliverToDifferentAddress,
          payment_method: paymentMethod
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
- Email: ${email}
- Address: ${address}, ${city}, ${stateProvince}, ${country}
- Phone: ${phoneNumber}
${secondaryPhoneNumber ? `- Secondary Phone: ${secondaryPhoneNumber}\n` : ''}${deliverToDifferentAddress ? `- Deliver to different address requested\n` : ''}

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
        {/* Customer Details */}
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
            <h2 className="font-poppins text-xl font-medium text-purple-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white flex items-center justify-center text-sm font-bold">2</span>
              Customer Details
            </h2>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button type="button" className="bg-purple-900 text-white font-inter text-sm px-6 py-2 rounded">Login</button>
            <button type="button" className="bg-gray-200 text-gray-700 font-inter text-sm px-6 py-2 rounded">Continue as Guest</button>
          </div>
          <p className="font-inter text-sm text-gray-600 mb-6">Login to Earn / Redeem myAbans loyalty points <span className="text-blue-500 cursor-pointer hover:underline">(More Info)</span></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required 
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors" 
              />
            </div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required 
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-inter text-sm text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-inter text-sm text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                required 
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors" 
              />
            </div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
              <select 
                value={country}
                onChange={e => setCountry(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors"
              >
                <option value="Sri Lanka">Sri Lanka</option>
              </select>
            </div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1">State/Province <span className="text-red-500">*</span></label>
              <select 
                value={stateProvince}
                onChange={e => setStateProvince(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors"
              >
                <option value="">Select Province</option>
                <option value="Western">Western</option>
                <option value="Central">Central</option>
                <option value="Southern">Southern</option>
                <option value="Northern">Northern</option>
                <option value="Eastern">Eastern</option>
                <option value="North Western">North Western</option>
                <option value="North Central">North Central</option>
                <option value="Uva">Uva</option>
                <option value="Sabaragamuwa">Sabaragamuwa</option>
              </select>
            </div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <select 
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors"
              >
                <option value="">Select City</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Negombo">Negombo</option>
              </select>
            </div>
            <div className="hidden md:block"></div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span> <span className="text-gray-400 text-xs">(Ex:077XXXXXXX)</span></label>
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required 
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors" 
              />
            </div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1">Secondary Phone Number</label>
              <input 
                type="tel" 
                value={secondaryPhoneNumber}
                onChange={e => setSecondaryPhoneNumber(e.target.value)}
                className="w-full bg-white border border-gray-300 py-2.5 px-3 font-inter text-sm rounded focus:outline-none focus:border-purple-600 transition-colors" 
              />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="deliverDifferent" 
              checked={deliverToDifferentAddress}
              onChange={e => setDeliverToDifferentAddress(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-purple-800 focus:ring-purple-800"
            />
            <label htmlFor="deliverDifferent" className="font-inter text-sm font-semibold text-gray-800">Deliver to a different address</label>
          </div>
          <p className="font-inter text-sm text-gray-600 mt-4 mb-2">Kindly use the map to select your precise delivery location.</p>
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
              </div>
            )}
            
            {paymentMethod === 'web' && (
              <div className="p-5 border border-gray-200 rounded-sm bg-gray-50 text-gray-800 font-inter text-sm space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-500 text-2xl">info</span>
                  <p>We will contact you via the phone number you provided above to confirm your order details and arrange delivery.</p>
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
