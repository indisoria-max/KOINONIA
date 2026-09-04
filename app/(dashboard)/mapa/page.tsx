'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { Church as ChurchIcon, Flame, Cross, MapPin, Phone, Globe, Clock, Navigation } from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0C1828', color: 'var(--muted)', fontSize: '14px' }}>
      Cargando mapa...
    </div>
  )
})

type Church = {
  id: string
  name: string
  address: string
  city: string
  phone: string
  website: string
  latitude: number
  longitude: number
  has_adoration: boolean
  has_confessions: boolean
}

type Schedule = {
  day_of_week: number
  time: string
  language: string
  notes: string
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function MapaPage() {
  const [churches, setChurches]   = useState<Church[]>([])
  const [selected, setSelected]   = useState<Church | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [filter, setFilter]       = useState<'all' | 'adoration' | 'confessions'>('all')
  const [mounted, setMounted]     = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const fetchChurches = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('churches')
        .select('*')
        .not('latitude', 'is', null)
      setChurches(data || [])
    }
    fetchChurches()
  }, [])

  useEffect(() => {
    if (!selected) return
    const fetchSchedules = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('mass_schedules')
        .select('*')
        .eq('church_id', selected.id)
        .order('day_of_week')
        .order('time')
      setSchedules(data || [])
    }
    fetchSchedules()
  }, [selected])

  const filtered = churches.filter(c => {
    if (filter === 'adoration')   return c.has_adoration
    if (filter === 'confessions') return c.has_confessions
    return true
  })

  const openNavigation = (church: Church, app: 'google' | 'apple' | 'waze') => {
    const { latitude: lat, longitude: lng } = church
    const urls = {
      google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      apple:  `maps://maps.apple.com/?daddr=${lat},${lng}`,
      waze:   `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    }
    window.open(urls[app], '_blank')
  }

  const groupedSchedules = schedules.reduce((acc, s) => {
    const day = DAYS[s.day_of_week]
    if (!acc[day]) acc[day] = []
    acc[day].push(s.time.slice(0, 5))
    return acc
  }, {} as Record<string, string[]>)

  const FILTERS = [
    { key: 'all',         label: 'Todas',       Icon: ChurchIcon },
    { key: 'adoration',   label: 'Adoración',   Icon: Flame      },
    { key: 'confessions', label: 'Confesiones', Icon: Cross      },
  ]

  return (
    <>
      <div style={{ height: 'calc(100vh - 56px - 64px)', position: 'relative' }}>
        <Map
          churches={filtered}
          onSelect={(c) => { setSelected(c); setSchedules([]) }}
        />
      </div>

      {mounted && createPortal(
        <>
          <div style={{
            position: 'fixed', top: '72px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 99999,
            display: 'flex', gap: '6px',
            background: 'rgba(12,24,40,0.88)', backdropFilter: 'blur(14px)',
            borderRadius: '9999px', border: '1px solid rgba(201,162,39,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '6px 8px',
            whiteSpace: 'nowrap',
          }}>
            {FILTERS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'adoration' | 'confessions')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '12px', padding: '5px 14px', borderRadius: '9999px',
                  border: filter === key ? '1px solid rgba(201,162,39,0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  background: filter === key
                    ? 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.14))'
                    : 'transparent',
                  color: filter === key ? '#E8C55A' : 'rgba(245,240,232,0.55)',
                  fontWeight: filter === key ? '600' : '400',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {selected && (
            <div style={{
              position: 'fixed', bottom: '64px', left: 0, right: 0,
              background: 'linear-gradient(180deg, rgba(15,26,44,0.97) 0%, rgba(12,22,38,0.99) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px 24px 0 0',
              borderTop: '1px solid rgba(201,162,39,0.2)',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
              zIndex: 99999, maxHeight: '65vh', overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
                <div style={{ width: '36px', height: '4px', background: 'rgba(201,162,39,0.3)', borderRadius: '2px' }} />
              </div>

              <div style={{ padding: '14px 20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700', fontSize: '20px', color: 'var(--text)', margin: 0 }}>
                      {selected.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                      <MapPin size={12} color="var(--muted)" />
                      <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
                        {selected.address}, {selected.city}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.12)', color: 'var(--muted)', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    ×
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {selected.has_adoration && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)', color: 'var(--gold-light)', fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', fontWeight: '500' }}>
                      <Flame size={12} /> Adoración
                    </span>
                  )}
                  {selected.has_confessions && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', color: 'rgba(232,197,90,0.8)', fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', fontWeight: '500' }}>
                      <Cross size={12} /> Confesiones
                    </span>
                  )}
                </div>

                {(selected.phone || selected.website) && (
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--gold)', textDecoration: 'none', fontWeight: '500' }}>
                        <Phone size={13} /> {selected.phone}
                      </a>
                    )}
                    {selected.website && (
                      <a href={selected.website} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--gold)', textDecoration: 'none', fontWeight: '500' }}>
                        <Globe size={13} /> Web
                      </a>
                    )}
                  </div>
                )}

                {Object.keys(groupedSchedules).length > 0 && (
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ width: '2px', height: '14px', background: 'var(--gold)', borderRadius: '1px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={11} color="var(--gold)" />
                        <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--gold)', margin: 0, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                          Horarios de Misa
                        </p>
                      </div>
                    </div>
                    {Object.entries(groupedSchedules).map(([day, times]) => (
                      <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', width: '28px' }}>{day}</span>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {times.map((t, i) => (
                            <span key={i} style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', color: 'var(--gold-light)', fontSize: '11px', padding: '2px 9px', borderRadius: '9999px', fontWeight: '500' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '2px', height: '14px', background: 'var(--gold)', borderRadius: '1px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Navigation size={11} color="var(--gold)" />
                    <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--gold)', margin: 0, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      Cómo llegar
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { label: 'Google Maps', app: 'google' as const, bg: 'rgba(66,133,244,0.15)', border: 'rgba(66,133,244,0.3)', color: '#7BB3F8' },
                    { label: 'Apple Maps', app: 'apple'  as const, bg: 'rgba(245,240,232,0.08)', border: 'rgba(245,240,232,0.15)', color: 'var(--text)' },
                    { label: 'Waze',       app: 'waze'   as const, bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',   color: '#67D7E8' },
                  ].map(({ label, app, bg, border, color }) => (
                    <button key={app} onClick={() => openNavigation(selected, app)} style={{ flex: 1, background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '10px 4px', cursor: 'pointer', color, fontWeight: '600', fontSize: '11px' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  )
}