'use client'

import { useActionState, useEffect } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const initialState = { error: null, success: false }

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(26,46,66,0.6)',
  border: '1px solid rgba(201,162,39,0.2)',
  borderRadius: '12px', padding: '12px 14px',
  color: '#F5F0E8', fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none', marginBottom: '10px',
}

export default function EditarPerfilPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  useEffect(() => {
    if (state?.success) router.push('/perfil')
  }, [state?.success])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: '#F5F0E8',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '100px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '48px 16px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <Link href="/perfil" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(245,240,232,0.5)', fontSize: '13px' }}>
            <ChevronLeft size={16} /> Volver
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: '#F5F0E8', margin: 0 }}>
            Editar perfil
          </h1>
        </div>

        {/* Error */}
        {state?.error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '14px 16px', fontSize: '14px', color: '#FCA5A5', marginBottom: '16px' }}>
            ❌ {state.error}
          </div>
        )}

        <form action={formAction}>

          {/* Foto */}
          <div style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))', borderRadius: '20px', padding: '20px', border: '1px solid rgba(201,162,39,0.15)', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>📸 URL de foto</p>
            <input name="avatar_url" type="url" placeholder="https://ejemplo.com/mi-foto.jpg" style={inputStyle} />
            <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', margin: 0 }}>Pega una URL de imagen pública</p>
          </div>

          {/* Nombre */}
          <div style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))', borderRadius: '20px', padding: '20px', border: '1px solid rgba(201,162,39,0.15)', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>👤 Nombre</p>
            <input name="first_name" type="text" placeholder="Tu nombre" required style={inputStyle} />
            <input name="last_name" type="text" placeholder="Tu apellido" required style={{ ...inputStyle, marginBottom: 0 }} />
          </div>

          {/* Ciudad */}
          <div style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))', borderRadius: '20px', padding: '20px', border: '1px solid rgba(201,162,39,0.15)', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>📍 Ciudad</p>
            <input name="city" type="text" placeholder="Santiago de Compostela" style={{ ...inputStyle, marginBottom: 0 }} />
          </div>

          {/* Bio */}
          <div style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))', borderRadius: '20px', padding: '20px', border: '1px solid rgba(201,162,39,0.15)', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>📝 Sobre mí</p>
            <textarea name="bio" rows={4} placeholder="Cuéntanos sobre ti y tu fe..."
              style={{ ...inputStyle, resize: 'none', marginBottom: 0 }} />
          </div>

          {/* Botón */}
          <button type="submit" disabled={isPending} style={{
            width: '100%', padding: '15px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.16))',
            border: '1px solid rgba(201,162,39,0.4)',
            color: '#E8C55A', fontWeight: '600', fontSize: '15px',
            cursor: isPending ? 'default' : 'pointer',
            opacity: isPending ? 0.6 : 1,
          }}>
            {isPending ? '⏳ Guardando...' : '✅ Guardar cambios'}
          </button>

        </form>
      </div>
    </div>
  )
}