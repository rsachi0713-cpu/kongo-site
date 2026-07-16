"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getWishlistItems() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('wishlist')
    .select('*, product:products(*)')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }

  // Filter out any entries where product was deleted/null
  return data
    .filter(item => item.product !== null)
    .map(item => item.product);
}

export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'unauthenticated' };
  }

  // Check if product is already in wishlist
  const { data: existing, error: checkError } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (existing) {
    // Remove from wishlist
    const { error: deleteError } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', existing.id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    revalidatePath('/wishlist');
    revalidatePath(`/product/${productId}`);
    return { success: true, action: 'removed' };
  } else {
    // Add to wishlist
    const { error: insertError } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        product_id: productId
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    revalidatePath('/wishlist');
    revalidatePath(`/product/${productId}`);
    return { success: true, action: 'added' };
  }
}

export async function checkIsWishlisted(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return !!data;
}
