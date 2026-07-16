import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getCartItems } from '../cart/actions';
import CheckoutForm from './CheckoutForm';

export default async function Checkout() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, force redirect to login
  if (!user) {
    return redirect('/login?next=/checkout');
  }

  const cartItems = await getCartItems();

  // If cart is empty, redirect back to cart page
  if (cartItems.length === 0) {
    return redirect('/cart');
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-12 animate-fade-in-up">
      <h1 className="font-poppins text-3xl md:text-4xl font-semibold text-black mb-8 tracking-tight">Checkout</h1>
      
      <CheckoutForm cartItems={cartItems} />
    </div>
  );
}
