'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

type Church = {
  id: string; name: string; address: string; city: string
  phone: string; website: string; latitude: number; longitude: number
  has_adoration: boolean; has_confessions: boolean
}

type Schedule = { day_of_week: number; time: string; language: string; notes: string }

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function MapaPage() {
  const [churches, setChurches] = useState<Church[]>([])
  const [selected, setSelected] = useState<Church | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [filter, setFilter] = useState<'all' | 'adoration' | 'confessions'>('all')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient()
      let all: Church[] = []
      let from = 0
      const PAGE = 1000

      while (true) {
        const { data } = await supabase
          .from('churches')
          .select('id,name,address,city,latitude,longitude,phone,website,has_adoration,has_confessions')
          .not('latitude', 'is', null)
          .range(from, from + PAGE - 1)

        if (!data || data.length === 0) break
        all = [...all, ...data]
        if (data.length < PAGE) break
        from += PAGE
      }

      setChurches(all)
      setLoading(false)
    }
    fetchAll()
  }, [])

  useEffect(() => {
    if (!selected) return
    const fetchSchedules = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('mass_schedules')
        .select('*')
        .eq('church_id', selected.id)
        .order('day_of_week').order('time')
      setSchedules(data || [])
    }
    fetchSchedules()
  }, [selected])

  const filtered = churches.filter(c => {
    if (filter === 'adoration') return c.has_adoration
    if (filter === 'confessions') return c.has_confessions
    return true
  })

  const openNavigation = (church: Church, app: 'google' | 'apple' | 'waze') => {
    const { latitude: lat, longitude: lng } = church
    const urls = {
      google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      apple: `maps://maps.apple.com/?daddr=${lat},${lng}`,
      waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
    }
    window.open(urls[app], '_blank')
  }

  const groupedSchedules = schedules.reduce((acc, s) => {
    const day = DAYS[s.day_of_week]
    if (!acc[day]) acc[day] = []
    acc[day].push(s.time.slice(0, 5))
    return acc
  }, {} as Record<string, string[]>)

  return (
    <>
      <div style={{ height: 'calc(100vh - 56px - 64px)', position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,16,25,0.85)', flexDirection: 'column', gap: '12px'
          }}>
            <div style={{ color: 'var(--gold)', fontSize: '15px', fontWeight: 600 }}>
              Cargando iglesias...
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
              {churches.length > 0 ? `${churches.length} cargadas` : 'Conectando...'}
            </div>
          </div>
        )}
        <Map
          churches={filtered}
          onSelect={(c) => { setSelected(c); setSchedules([]) }}
        />
      </div>

      {mounted && createPortal(
        <>
          {/* Filtros */}
          <div style={{
            position: 'fixed', top: '72px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 99999, display: 'flex', gap: '8px',
            background: 'rgba(15,26,46,0.95)', borderRadius: '9999px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            border: '1px solid rgba(201,162,39,0.2)',
            padding: '6px 10px', whiteSpace: 'nowrap',
            backdropFilter: 'blur(12px)'
          }}>
            {[
              { key: 'all', label: `Todas (${churches.length})` },
              { key: 'adoration', label: 'Adoración' },
              { key: 'confessions', label: 'Confesiones' }
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key as any)} style={{
                fontSize: '12px', padding: '5px 14px', borderRadius: '9999px',
                border: 'none', cursor: 'pointer',
                background: filter === f.key ? 'rgba(201,162,39,0.25)' : 'transparent',
                color: filter === f.key ? 'var(--gold)' : 'var(--muted)',
                fontWeight: filter === f.key ? 600 : 400,
                transition: 'all 0.2s'
              }}>{f.label}</button>
            ))}
          </div>

          {/* Panel inferior */}
          {selected && (
            <div style={{
              position: 'fixed', bottom: '64px', left: 0, right: 0,
              background: 'linear-gradient(180deg, rgba(20,34,51,0.99), rgba(12,22,38,1))',
              borderRadius: '24px 24px 0 0',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
              border: '1px solid rgba(201,162,39,0.15)',
              zIndex: 99999, maxHeight: '65vh', overflowY: 'auto'
            }}>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '18px', color: 'var(--text)', margin: 0 }}>{selected.name}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0' }}>
                      {[selected.address, selected.city].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{
                    color: 'var(--muted)', fontSize: '22px', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border2)', borderRadius: '50%',
                    width: '32px', height: '32px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>×</button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {selected.has_adoration && (
                    <span style={{ background: 'rgba(201,162,39,0.12)', color: 'var(--gold)', fontSize: '12px', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(201,162,39,0.25)' }}>
                      Adoración
                    </span>
                  )}
                  {selected.has_confessions && (
                    <span style={{ background: 'rgba(201,162,39,0.12)', color: 'var(--gold)', fontSize: '12px', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(201,162,39,0.25)' }}>
                      Confesiones
                    </span>
                  )}
                </div>

                {(selected.phone || selected.website) && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} style={{ fontSize: '13px', color: 'var(--gold)', textDecoration: 'none' }}>
                        {selected.phone}
                      </a>
                    )}
                    {selected.website && (
                      <a href={selected.website} target="_blank" style={{ fontSize: '13px', color: 'var(--gold)', textDecoration: 'none' }}>
                        Sitio web
                      </a>
                    )}
                  </div>
                )}

                {Object.keys(groupedSchedules).length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>HORARIOS DE MISA</p>
                    {Object.entries(groupedSchedules).map(([day, times]) => (
                      <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', width: '28px' }}>{day}</span>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {times.map((t, i) => (
                            <span key={i} style={{ background: 'rgba(201,162,39,0.12)', color: 'var(--gold)', fontSize: '11px', padding: '2px 8px', borderRadius: '9999px' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.1em' }}>CÓMO LLEGAR</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['google', 'apple', 'waze'].map(app => (
                    <button key={app} onClick={() => openNavigation(selected, app as any)} style={{
                      flex: 1, background: 'rgba(201,162,39,0.12)',
                      color: 'var(--gold)', fontSize: '12px', padding: '10px',
                      borderRadius: '12px', border: '1px solid rgba(201,162,39,0.2)', cursor: 'pointer',
                      fontWeight: 600, textTransform: 'capitalize'
                    }}>{app === 'google' ? 'Google' : app === 'apple' ? 'Apple' : 'Waze'}</button>
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