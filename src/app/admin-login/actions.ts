"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function adminLogin(fields: Record<string, string>) {
  const email = fields.email.trim();
  const password = fields.password;

  // Hardcoded Admin Credentials
  const validAdmins = [
    { username: 'senta', password: 'senta@2005' },
    { username: 'avary', password: 'avary@2005' }
  ];

  const matchedAdmin = validAdmins.find(
    admin => admin.username === email && admin.password === password
  );

  if (!matchedAdmin) {
    return { success: false, error: 'Invalid administrator credentials.' };
  }

  // Set local admin session cookie (bypassing Supabase for these two admin accounts)
  const cookieStore = await cookies();
  cookieStore.set('kongo_admin_session', 'true', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 // 1 day
  });

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('kongo_admin_session');
  return redirect('/admin-login');
}
