'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSetting(id: string, defaultValue: string = '') {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('id', id)
    .single();

  if (error || !data) {
    return defaultValue;
  }

  return data.value;
}

export async function updateSetting(id: string, value: string) {
  const supabase = await createClient();
  
  // Verify admin session (Optional, but good practice. RLS handles actual security)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ 
      id, 
      value, 
      updated_at: new Date().toISOString() 
    });

  if (error) {
    throw new Error('Failed to update setting: ' + error.message);
  }

  revalidatePath('/'); // Revalidate homepage so the new banner shows up
  revalidatePath('/admin/settings');
}

export async function uploadBannerImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  
  if (!file || file.size === 0) {
    throw new Error('No file provided');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (uploadError) {
    throw new Error('Upload failed: ' + uploadError.message);
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return data.publicUrl;
}
