import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function createAdminClient() {
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

  // Use the standard client without cookie handling so it strictly uses the service role key
  // and ignores any user session cookies which would otherwise downgrade the request permissions.
  return createClient(
    supabaseUrl!,
    supabaseKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    }
  )
}
