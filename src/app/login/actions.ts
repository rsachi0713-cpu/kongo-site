'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = formData.get('next') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Return error to the client component or redirect with error (preserve next)
    const errRedirect = `/login?error=${encodeURIComponent(error.message)}${next ? `&next=${encodeURIComponent(next)}` : ''}`
    return redirect(errRedirect)
  }

  revalidatePath('/', 'layout')
  
  // Safe redirect to local path only to prevent open redirect vulnerabilities
  if (next && next.startsWith('/')) {
    redirect(next)
  } else {
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  // We need absolute URL for email redirects
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  })

  if (error) {
    return redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  // After signing up, we can create their profile row
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      role: 'customer'
    }).select()
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check your email to continue sign in process')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function registerUser(fields: Record<string, string>) {
  const supabase = await createClient();
  const email = fields.email;
  const password = fields.password;
  const firstName = fields.firstName;
  const lastName = fields.lastName;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Create profile row (it might not sign in yet because email confirmation is pending)
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      role: 'customer'
    });
  }

  return { success: true, email };
}

export async function verifySignupOTP(email: string, token: string) {
  const supabase = await createClient();
  
  // Try 'signup' type first
  let { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  });

  // If that fails, fallback to 'email' type verification
  if (error) {
    console.warn("OTP verification with type 'signup' failed, trying 'email' type...", error.message);
    const retryResult = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    error = retryResult.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
