"use server";

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const cookieStore = await cookies();
  const isAdminSession = cookieStore.get('kongo_admin_session')?.value === 'true';
  
  if (!isAdminSession) {
    throw new Error('Unauthorized');
  }

  const supabase = await createAdminClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/orders');
  revalidatePath('/profile');
  return { success: true };
}
