import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    'https://rrtrrstavukdytulymjd.supabase.co',
    'sb_publishable_Xdg-b8bSYoxJRfj-7wyDbA_i64-Xw3t',
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
          } catch {
            // Ignorado en Server Components
          }
        },
      },
    }
  )
}