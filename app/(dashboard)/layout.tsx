'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Map, MessageSquare, CircleUser } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile]     = useState<{ first_name?: string; avatar_url?: string } | null>(null)
  const [unreadMsg, setUnreadMsg] = useState(false)
  const pathname                  = usePathname()
  const supabase                  = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('first_name, avatar_url')
        .eq('id', user.id)
        .single()
      
      setProfile(data)

      // Comprobar mensajes no leídos dirigidos al usuario
      const { data: connIds } = await supabase
        .from('connections')
        .select('id')
        .or(`pilgrim_id.eq.${user.id},host_id.eq.${user.id}`)

      if (connIds && connIds.length > 0) {
        const ids = connIds.map(c => c.id)
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .in('connection_id', ids)
          .neq('sender_id', user.id)
          .eq('read', false)

        setUnreadMsg((count || 0) > 0)
      }

      // Suscripción Realtime a nuevos mensajes
      const channel = supabase
        .channel('nav-messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        }, (payload) => {
          if (payload.new.sender_id !== user.id) {
            setUnreadMsg(true)
          }
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }

    loadUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const inicial = profile?.first_name?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
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
            border: '1px solid var(--border)',
            overflow: 'hidden', background: '#0C1828'
          }}>
            <img src="/icon-192.png" alt="Koinonia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

      {/* Contenido */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>
        {children}
      </main>

      {/* Nav inferior */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(10,16,25,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border2)',
        zIndex: 10, padding: '6px 0 8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <NavItem href="/dashboard"  icon={<Home size={22} />}          label="Inicio"    active={pathname === '/dashboard'} />
          <NavItem href="/comunidad"  icon={<Users size={22} />}         label="Comunidad" active={pathname === '/comunidad'} />
          <NavItem href="/mapa"       icon={<Map size={22} />}           label="Mapa"      active={pathname === '/mapa'} />
          <NavItem href="/mensajes"   icon={<MessageSquare size={22} />} label="Mensajes"  active={pathname.startsWith('/mensajes')} badge={unreadMsg} />
          <NavItem href="/perfil"     icon={<CircleUser size={22} />}    label="Perfil"    active={pathname === '/perfil'} />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, icon, label, active, badge }: { href: string; icon: React.ReactNode; label: string; active: boolean; badge?: boolean }) {
  return (
    <Link href={href} style={{
      textDecoration: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
      padding: '4px 12px',
      color: active ? 'var(--gold)' : 'var(--muted)',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon}
        {badge && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-4px',
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#EF4444',
            border: '2px solid #0A1019',
            boxShadow: '0 0 8px #EF4444'
          }} />
        )}
      </div>
      <span style={{ fontSize: '9px', fontWeight: active ? 700 : 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</span>
    </Link>
  )
}