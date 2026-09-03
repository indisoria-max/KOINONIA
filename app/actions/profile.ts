'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado', success: false }

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name:  formData.get('first_name') as string,
      last_name:   formData.get('last_name') as string,
      bio:         formData.get('bio') as string,
      city:        formData.get('city') as string,
      avatar_url:  formData.get('avatar_url') as string,
      updated_at:  new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: error.message, success: false }

  revalidatePath('/perfil')
  return { success: true, error: null }
}