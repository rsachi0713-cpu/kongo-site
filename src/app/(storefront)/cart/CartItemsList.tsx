"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { updateCartQty, removeFromCart } from './actions';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    original_price?: number | null;
  } | null;
}

export default function CartItemsList({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const handleQtyChange = (cartItemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      handleRemove(cartItemId);
      return;
    }

    // Optimistic UI update
    setItems(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );

    startTransition(async () => {
      try {
        await updateCartQty(cartItemId, newQty);
      } catch (err: any) {
        alert(err.message || 'Failed to update quantity');
        // Rollback on failure
        setItems(initialItems);
      }
    });
  };

  const handleRemove = (cartItemId: string) => {
    if (!confirm('Are you sure you want to remove this item from your cart?')) return;

    // Optimistic UI update
    setItems(prev => prev.filter(item => item.id !== cartItemId));

    startTransition(async () => {
      try {
        await removeFromCart(cartItemId);
      } catch (err: any) {
        alert(err.message || 'Failed to remove item');
        // Rollback
        setItems(initialItems);
      }
    });
  };

  // Math calculations
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price ? Number(item.product.price) : 0;
    return acc + price * item.quantity;
  }, 0);

  const shippingCost = subtotal > 10000 || subtotal === 0 ? 0 : 350;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-gray-200 rounded">
        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">shopping_bag</span>
        <h2 className="font-poppins text-xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="font-inter text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link 
          href="/shop" 
          className="bg-black text-white px-8 py-3.5 rounded font-inter text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full">
      {/* Cart Items List */}
      <div className="flex-1">
        <div className="border-b border-gray-200 pb-4 mb-6 hidden md:grid grid-cols-12 gap-4">
          <span className="col-span-6 font-inter text-xs uppercase tracking-widest text-gray-500 font-semibold">Product</span>
          <span className="col-span-2 text-center font-inter text-xs uppercase tracking-widest text-gray-500 font-semibold">Price</span>
          <span className="col-span-2 text-center font-inter text-xs uppercase tracking-widest text-gray-500 font-semibold">Quantity</span>
          <span className="col-span-2 text-right font-inter text-xs uppercase tracking-widest text-gray-500 font-semibold">Total</span>
        </div>

        <div className="space-y-6">
          {items.map(item => {
            if (!item.product) return null;
            const price = Number(item.product.price);
            const itemTotal = price * item.quantity;

            return (
              <div key={item.id} className="py-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                  <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center rounded overflow-hidden">
                    <img 
                      src={item.product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover p-1" 
                    />
                  </div>
                  <div>
                    <Link href={`/product/${item.product.id}`} className="font-inter text-base font-semibold text-black hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="font-inter text-xs text-gray-500 uppercase tracking-wider mt-1">{item.product.category}</p>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending}
                      className="text-gray-400 hover:text-red-500 transition-colors mt-3 text-xs font-inter flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span> Remove
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 text-left md:text-center font-inter text-sm text-gray-600">
                  <span className="md:hidden font-semibold mr-2">Price:</span>
                  {item.product.original_price && Number(item.product.original_price) > price && (
                    <span className="text-[11px] text-gray-400 line-through mr-1.5 block md:inline">
                      LKR {Number(item.product.original_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="font-semibold text-black">LKR {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                  <div className="flex border border-gray-300 w-24 rounded">
                    <button 
                      onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                      disabled={isPending}
                      className="flex-1 py-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors font-bold text-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-inter text-sm flex items-center justify-center text-black">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                      disabled={isPending}
                      className="flex-1 py-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors font-bold text-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 text-left md:text-right font-inter text-sm font-semibold text-black">
                  <span className="md:hidden font-semibold mr-2 text-gray-600">Total:</span>
                  LKR {itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-[400px] flex-shrink-0">
        <div className="bg-[#f9f9f9] p-8 rounded-sm sticky top-28 border border-gray-200">
          <h2 className="font-poppins text-xl font-semibold text-black mb-6">Order Summary</h2>
          
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
          {shippingCost > 0 && (
            <p className="text-[10px] text-gray-400 font-inter leading-tight mb-4">
              Add LKR {(10000 - subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })} more for free delivery!
            </p>
          )}

          <div className="border-t border-gray-200 my-4"></div>

          <div className="flex justify-between mb-8 font-inter text-base font-bold text-black">
            <span>Total</span>
            <span>LKR {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <Link 
            href="/checkout" 
            className="block w-full bg-black text-white text-center py-4 rounded font-inter text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
