import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function createAdminClient() {
  const cookieStore = await cookies()

  let env: any = {}
  try {
    env = getCloudflareContext()?.env || {}
  } catch (e) {}

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  // USE SERVICE ROLE KEY to bypass RLS for admin actions
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("SUPABASE URL OR KEY IS MISSING IN ADMIN CLIENT!")
  }

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
