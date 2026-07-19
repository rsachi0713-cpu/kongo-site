import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getCartItems } from './actions';
import CartItemsList from './CartItemsList';
import Link from 'next/link';

export default async function Cart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, force redirect to login page
  if (!user) {
    return redirect('/login?next=/cart');
  }

  const cartItems = await getCartItems();

  return (
    <div className="site-container py-12 animate-fade-in-up">
      <h1 className="font-poppins text-3xl md:text-4xl font-semibold text-black mb-8 tracking-tight">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <CartItemsList initialItems={cartItems} />
      </div>
    </div>
  );
}



