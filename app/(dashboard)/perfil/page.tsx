import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/actions/profile'
import Link from 'next/link'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const nombre  = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuario'
  const inicial = nombre[0]?.toUpperCase() || '?'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '100px',
    }}>

      {/* ── Hero ── */}
      <div style={{
        textAlign: 'center',
        padding: '60px 24px 36px',
        position: 'relative',
      }}>
        {/* Glow ambiental */}
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '400px', height: '300px',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(201,162,39,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Avatar */}
        <div style={{
          width: '96px', height: '96px',
          borderRadius: '50%',
          border: '3px solid var(--gold)',
          boxShadow: '0 0 20px rgba(201,162,39,0.35)',
          margin: '0 auto 16px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1A2E44, #142233)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', fontWeight: '800',
          color: 'var(--gold)',
        }}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
            : inicial}
        </div>

        {/* Nombre */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '28px', fontWeight: '700',
          color: 'var(--text)', margin: '0 0 10px',
        }}>
          {nombre}
        </h1>

        {/* Role badge */}
        <span style={{
          display: 'inline-block',
          background: 'rgba(201,162,39,0.12)',
          border: '1px solid rgba(201,162,39,0.28)',
          color: 'var(--gold-light)',
          fontSize: '13px', fontWeight: '500',
          padding: '5px 16px', borderRadius: '9999px',
        }}>
          {profile.role === 'peregrino' ? '🎒 Peregrino' : '🏡 Anfitrión'}
        </span>
      </div>

      {/* ── Contenido ── */}
      <div style={{ padding: '0 16px', maxWidth: '500px', margin: '0 auto' }}>

        {/* Info card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))',
          borderRadius: '20px',
          border: '1px solid rgba(201,162,39,0.15)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          overflow: 'hidden',
          marginBottom: '16px',
        }}>
          <InfoRow label="📧 Email"    value={user.email || '—'} />
          <InfoRow label="📍 Ciudad"   value={profile.city || '—'} />
          <InfoRow label="🌐 Idiomas"  value={profile.languages?.join(', ') || '—'} />
          <InfoRow label="📝 Bio"      value={profile.bio || '—'} isLast />
        </div>

        {/* Botón editar */}
        <Link href="/perfil/editar" style={{ textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.22), rgba(201,162,39,0.12))',
            border: '1px solid rgba(201,162,39,0.35)',
            borderRadius: '16px',
            padding: '15px',
            textAlign: 'center',
            color: 'var(--gold-light)',
            fontWeight: '600', fontSize: '15px',
          }}>
            ✏️ Editar perfil
          </div>
        </Link>

        {/* Cerrar sesión */}
        <form action={signOut}>
          <button type="submit" style={{
            width: '100%',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px',
            padding: '15px',
            color: 'rgba(252,165,165,0.85)',
            fontWeight: '600', fontSize: '15px',
            cursor: 'pointer',
          }}>
            🚪 Cerrar sesión
          </button>
        </form>

      </div>
    </div>
  )
}

function InfoRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: isLast ? 'none' : '1px solid rgba(245,240,232,0.06)',
    }}>
      <p style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
        {label}
      </p>
      <p style={{ fontSize: '14px', color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
        {value}
      </p>
    </div>
  )
}