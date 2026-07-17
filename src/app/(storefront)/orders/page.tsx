import { redirect } from 'next/navigation';

export default function OrdersRedirectPage() {
  return redirect('/profile');
}


export const runtime = 'edge';
