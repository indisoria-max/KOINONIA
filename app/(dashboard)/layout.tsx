import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, Map, Handshake, CircleUser } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, avatar_url')
    .eq('id', user.id)
    .single()

  const inicial = profile?.first_name?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{
        backgroundColor: 'rgba(10,16,25,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border2)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1B3A6B, #2d5fa8)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: 900 }}>✝</span>
          </div>
          <span style={{ color: 'var(--text)', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '18px', letterSpacing: '0.3px' }}>
            Koinonia
          </span>
        </div>

        <Link href="/perfil/editar" style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '1.5px solid var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', textDecoration: 'none',
          color: 'var(--gold)', fontWeight: 700, fontSize: '14px',
          backgroundColor: 'var(--card)'
        }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
            : inicial}
        </Link>
      </header>

      {/* ── Contenido ── */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>
        {children}
      </main>

      {/* ── Nav inferior ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(10,16,25,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border2)',
        zIndex: 10, padding: '6px 0 8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <NavItem href="/dashboard"  icon={<Home size={22} />}       label="Inicio"    />
          <NavItem href="/comunidad"  icon={<Users size={22} />}      label="Comunidad" />
          <NavItem href="/mapa"       icon={<Map size={22} />}        label="Mapa"      />
          <NavItem href="/partners"   icon={<Handshake size={22} />}  label="Partners"  />
          <NavItem href="/perfil"     icon={<CircleUser size={22} />} label="Perfil"    />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '4px 12px', color: 'var(--muted)' }}>
      {icon}
      <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</span>
    </Link>
  )
}