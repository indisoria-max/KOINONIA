'use client'

import { useActionState, useEffect } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const initialState = { error: null, success: false }

export default function EditarPerfilPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  useEffect(() => {
    if (state?.success) router.push('/perfil')
  }, [state?.success])

  return (
    <div className="max-w-lg mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/perfil" className="text-gray-400 text-sm">← Volver</Link>
        <h1 className="text-xl font-black" style={{color: '#1B3A6B'}}>Editar perfil</h1>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
          ❌ {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">

        {/* Foto */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <label className="block text-sm font-bold mb-2" style={{color: '#1B3A6B'}}>📸 URL de foto</label>
          <input name="avatar_url" type="url"
            placeholder="https://ejemplo.com/mi-foto.jpg"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            style={{'--tw-ring-color': '#C9A227'} as any} />
          <p className="text-xs text-gray-400 mt-1">Pega una URL de imagen pública</p>
        </div>

        {/* Nombre */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <label className="block text-sm font-bold" style={{color: '#1B3A6B'}}>👤 Nombre</label>
          <input name="first_name" type="text" placeholder="Tu nombre" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          <input name="last_name" type="text" placeholder="Tu apellido" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
        </div>

        {/* Ciudad */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <label className="block text-sm font-bold mb-2" style={{color: '#1B3A6B'}}>📍 Ciudad</label>
          <input name="city" type="text" placeholder="Santiago de Compostela"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
        </div>

        {/* Bio */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <label className="block text-sm font-bold mb-2" style={{color: '#1B3A6B'}}>📝 Sobre mí</label>
          <textarea name="bio" rows={4} placeholder="Cuéntanos sobre ti y tu fe..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" />
        </div>

        {/* Botón */}
        <button type="submit" disabled={isPending}
          className="w-full py-4 rounded-2xl font-bold text-white shadow-sm disabled:opacity-50"
          style={{background: '#1B3A6B'}}>
          {isPending ? '⏳ Guardando...' : '✅ Guardar cambios'}
        </button>

      </form>
    </div>
  )
}