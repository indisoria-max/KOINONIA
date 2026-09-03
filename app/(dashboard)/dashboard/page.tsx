'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Map, Users, Landmark, Search, BookOpen, RefreshCw } from 'lucide-react'

interface Verse {
  text: string
  ref: string
}

const REFLEXIONES = [
  { titulo: 'El descanso',  texto: 'Dios también descansó. Date permiso para recargar tu espíritu y celebrar la semana vivida.' },
  { titulo: 'La gratitud',  texto: 'Cada amanecer es un regalo. Hoy, agradece por tres cosas pequeñas que suelen pasar desapercibidas.' },
  { titulo: 'El silencio',  texto: 'En el silencio encontramos a Dios. Dedica cinco minutos a estar en quietud y escuchar tu interior.' },
  { titulo: 'El perdón',    texto: 'Perdonar no es olvidar, es liberarse. ¿Hay alguien a quien puedas ofrecer el perdón hoy?' },
  { titulo: 'La esperanza', texto: 'La fe es la certeza de lo que se espera. Confía en que el camino que recorres tiene un propósito.' },
  { titulo: 'El servicio',  texto: 'Servir a los demás es la forma más alta de amar. Busca hoy una manera pequeña de ayudar a alguien.' },
  { titulo: 'La oración',   texto: 'La oración no cambia a Dios, te cambia a ti. Eleva hoy tu corazón con unas palabras sinceras.' },
]

const CARDS = [
  {
    title: 'Mapa Espiritual',
    sub: '+80 iglesias',
    href: '/mapa',
    Icon: Map,
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    title: 'Comunidad',
    sub: 'Reflexiones y oraciones',
    href: '/comunidad',
    Icon: Users,
    photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  },
  {
    title: 'Partners',
    sub: 'Servicios católicos',
    href: '/partners',
    Icon: Landmark,
    photo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
  },
  {
    title: 'Buscar',
    sub: 'Encuentra peregrinos',
    href: '/buscar',
    Icon: Search,
    photo: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&q=80',
  },
]

export default function DashboardPage() {
  const [name, setName]     = useState('')
  const [verse, setVerse]   = useState<Verse | null>(null)
  const [loading, setLoading] = useState(false)
  const reflexion = REFLEXIONES[new Date().getDay()]

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function fetchVerse() {
    setLoading(true)
    try {
      const res = await fetch('/api/bible/random')
      if (res.ok) setVerse(await res.json())
    } catch { /* silent */ }
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single()
        if (data?.first_name) setName(data.first_name.toLowerCase())
      }
      fetchVerse()
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '100px',
    }}>

      {/* ── HERO ── */}
      <div style={{ textAlign: 'center', padding: '64px 24px 44px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '500px', height: '380px',
          background: 'radial-gradient(ellipse at 50% 25%, rgba(201,162,39,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'inline-block', marginBottom: '22px' }}>
          <svg width="30" height="38" viewBox="0 0 30 38" fill="none"
            style={{ filter: 'drop-shadow(0 0 18px rgba(201,162,39,0.85)) drop-shadow(0 0 5px rgba(232,197,90,0.6))' }}>
            <defs>
              <linearGradient id="crossGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#F0D070" />
                <stop offset="100%" stopColor="#B8901A" />
              </linearGradient>
            </defs>
            <rect x="11" y="0" width="8"  height="38" rx="2.5" fill="url(#crossGold)" />
            <rect x="0"  y="9" width="30" height="8"  rx="2.5" fill="url(#crossGold)" />
          </svg>
        </div>

        <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: 'var(--gold)', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Bienvenido
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '44px', fontWeight: '700', color: 'var(--text)', margin: '0 0 10px', lineHeight: 1.1 }}>
          {name || '…'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
          ¿A dónde viajas hoy en fe?
        </p>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Grid 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          {CARDS.map(({ title, sub, href, Icon, photo }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                borderRadius: '20px', overflow: 'hidden', height: '160px', position: 'relative',
                border: '1px solid rgba(201,162,39,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.55) saturate(0.8)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(10,22,38,0.08) 0%, rgba(10,22,38,0.78) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ marginBottom: '6px' }}><Icon size={20} color="var(--gold-light)" /></div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', lineHeight: 1.2 }}>{title}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.6)', marginTop: '3px' }}>{sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Biblia */}
        <Link href="/biblia" style={{ textDecoration: 'none', display: 'block', marginBottom: '14px' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', height: '104px', position: 'relative', border: '1px solid rgba(201,162,39,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.4) saturate(0.7)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,22,38,0.92) 0%, rgba(10,22,38,0.3) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '0 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <BookOpen size={26} color="var(--gold)" />
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>La Biblia</div>
                <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.55)', marginTop: '3px' }}>Reina-Valera 1960 · 66 libros</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--gold-light)', fontSize: '18px', opacity: 0.7 }}>→</span>
            </div>
          </div>
        </Link>

        {/* Habla con Dios */}
        {verse && (
          <div style={{
            borderRadius: '20px', padding: '24px',
            background: 'linear-gradient(135deg, rgba(26,46,66,0.96), rgba(14,28,48,0.92))',
            border: '1px solid rgba(201,162,39,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden', marginBottom: '14px',
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(201,162,39,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '2px', height: '16px', background: 'var(--gold)', borderRadius: '1px' }} />
                <span style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Habla con Dios
                </span>
              </div>
              <button onClick={fetchVerse} style={{
                background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)',
                borderRadius: '8px', padding: '6px 8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', opacity: loading ? 0.4 : 1, transition: 'opacity 0.2s',
              }}>
                <RefreshCw size={14} color="var(--gold)" />
              </button>
            </div>

            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', lineHeight: 1.8, color: 'var(--text)', margin: '0 0 16px', fontStyle: 'italic' }}>
              "{verse.text}"
            </blockquote>

            <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '500' }}>
              {verse.ref}
            </span>
          </div>
        )}

        {/* Reflexión del día */}
        <div style={{
          borderRadius: '20px', padding: '22px',
          background: 'linear-gradient(135deg, rgba(20,34,51,0.95), rgba(12,24,40,0.92))',
          border: '1px solid rgba(245,240,232,0.09)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '2px', height: '16px', background: 'var(--gold)', borderRadius: '1px' }} />
            <span style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: '600', textTransform: 'uppercase' }}>
              Reflexión del día
            </span>
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '600', color: 'var(--text)', marginBottom: '10px' }}>
            {reflexion.titulo}
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>
            {reflexion.texto}
          </p>
        </div>

      </div>
    </div>
  )
}