'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import ChurchEditModal from '@/components/ChurchEditModal'
import { Pencil } from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

type Church = {
  id: string; name: string; address: string; city: string
  phone: string; website: string; latitude: number; longitude: number
  has_adoration: boolean; has_confessions: boolean
}

type Schedule = { id: string; day_of_week: number; time: string; language: string; notes: string; season: string }
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function MapaPage() {
  const [churches, setChurches] = useState<Church[]>([])
  const [selected, setSelected] = useState<Church | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [filter, setFilter] = useState<'all' | 'adoration' | 'confessions'>('all')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)

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

  const fetchSchedules = async (churchId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('mass_schedules')
      .select('*')
      .eq('church_id', churchId)
      .order('day_of_week').order('time')
    setSchedules(data || [])
  }

  useEffect(() => {
    if (!selected) return
    fetchSchedules(selected.id)
  }, [selected])

  const handleSaved = () => {
    setShowEdit(false)
    if (selected) {
      // Refresh church data
      const supabase = createClient()
      supabase.from('churches').select('*').eq('id', selected.id).single()
        .then(({ data }) => {
          if (data) {
            setSelected(data)
            setChurches(prev => prev.map(c => c.id === data.id ? data : c))
          }
        })
      fetchSchedules(selected.id)
    }
  }

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

  const SEASON_LABELS: Record<string, string> = {
  'todo_el_año': 'Todo el año', 'verano': 'Verano', 'invierno': 'Invierno'
}
const groupedBySeasonDay = schedules.reduce((acc, s) => {
  const season = s.season || 'todo_el_año'
  if (!acc[season]) acc[season] = {}
  const day = DAYS[s.day_of_week]
  if (!acc[season][day]) acc[season][day] = []
  acc[season][day].push(s.time.slice(0, 5))
  return acc
}, {} as Record<string, Record<string, string[]>>)

  return (
    <>
      <div style={{ height: 'calc(100vh - 56px - 64px)', position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,16,25,0.85)', flexDirection: 'column', gap: '12px'
          }}>
            <div style={{ color: 'var(--gold)', fontSize: '15px', fontWeight: 600 }}>Cargando iglesias...</div>
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
              {churches.length > 0 ? `${churches.length} cargadas` : 'Conectando...'}
            </div>
          </div>
        )}
        <Map churches={filtered} onSelect={(c) => { setSelected(c); setSchedules([]) }} />
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
            padding: '6px 10px', whiteSpace: 'nowrap', backdropFilter: 'blur(12px)'
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
                fontWeight: filter === f.key ? 600 : 400, transition: 'all 0.2s'
              }}>{f.label}</button>
            ))}
          </div>

          {/* Panel inferior */}
          {selected && !showEdit && (
            <div style={{
              position: 'fixed', bottom: '64px', left: 0, right: 0,
              background: 'linear-gradient(180deg, rgba(20,34,51,0.99), rgba(12,22,38,1))',
              borderRadius: '24px 24px 0 0',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
              border: '1px solid rgba(201,162,39,0.15)',
              zIndex: 99999, maxHeight: '65vh', overflowY: 'auto'
            }}>
              <div style={{ padding: '20px' }}>
                {/* Header */}
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
                    width: '32px', height: '32px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>×</button>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {selected.has_adoration && (
                    <span style={{ background: 'rgba(201,162,39,0.12)', color: 'var(--gold)', fontSize: '12px', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(201,162,39,0.25)' }}>Adoración</span>
                  )}
                  {selected.has_confessions && (
                    <span style={{ background: 'rgba(201,162,39,0.12)', color: 'var(--gold)', fontSize: '12px', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(201,162,39,0.25)' }}>Confesiones</span>
                  )}
                </div>

                {/* Contacto */}
                {(selected.phone || selected.website) && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} style={{ fontSize: '13px', color: 'var(--gold)', textDecoration: 'none' }}>{selected.phone}</a>
                    )}
                    {selected.website && (
                      <a href={selected.website} target="_blank" style={{ fontSize: '13px', color: 'var(--gold)', textDecoration: 'none' }}>Sitio web</a>
                    )}
                  </div>
                )}

                {/* Horarios */}
                {Object.keys(groupedBySeasonDay).length > 0 && (
  <div style={{ marginBottom: '14px' }}>
    {Object.entries(groupedBySeasonDay).map(([season, days]) => (
      <div key={season} style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>
          HORARIOS · {SEASON_LABELS[season]?.toUpperCase() || season.toUpperCase()}
        </p>
        {Object.entries(days).map(([day, times]) => (
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
    ))}
  </div>
)}

                {/* Botón Añadir información */}
                <button onClick={() => setShowEdit(true)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '12px',
                  background: 'rgba(201,162,39,0.1)',
                  border: '1px solid rgba(201,162,39,0.25)',
                  borderRadius: '12px', cursor: 'pointer',
                  color: 'var(--gold)', fontSize: '14px', fontWeight: 600, marginBottom: '10px'
                }}>
                  <Pencil size={15} />
                  Añadir información
                </button>

                {/* Navegación */}
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.1em' }}>CÓMO LLEGAR</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['google', 'apple', 'waze'] as const).map(app => (
                    <button key={app} onClick={() => openNavigation(selected, app)} style={{
                      flex: 1, background: 'rgba(201,162,39,0.12)', color: 'var(--gold)',
                      fontSize: '12px', padding: '10px', borderRadius: '12px',
                      border: '1px solid rgba(201,162,39,0.2)', cursor: 'pointer', fontWeight: 600
                    }}>{app === 'google' ? 'Google' : app === 'apple' ? 'Apple' : 'Waze'}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal de edición */}
          {showEdit && selected && (
            <ChurchEditModal
              church={selected}
              schedules={schedules}
              onClose={() => setShowEdit(false)}
              onSaved={handleSaved}
            />
          )}
        </>,
        document.body
      )}
    </>
  )
}