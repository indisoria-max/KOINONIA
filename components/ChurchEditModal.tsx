'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { X, Plus, Trash2, CheckCircle } from 'lucide-react'

type Church = {
  id: string; name: string; phone: string; website: string
  has_adoration: boolean; has_confessions: boolean
}

type Schedule = { id: string; day_of_week: number; time: string; season: string }

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const SEASONS = [
  { value: 'todo_el_año', label: 'Todo el año' },
  { value: 'verano', label: 'Verano' },
  { value: 'invierno', label: 'Invierno' },
]

const inputStyle = {
  width: '100%', boxSizing: 'border-box' as const,
  background: 'rgba(26,46,66,0.6)', border: '1px solid var(--border)',
  borderRadius: '12px', padding: '12px 14px',
  color: 'var(--text)', fontSize: '14px', outline: 'none', marginBottom: '10px'
}

interface Props {
  church: Church
  schedules: Schedule[]
  onClose: () => void
  onSaved: () => void
}

export default function ChurchEditModal({ church, schedules, onClose, onSaved }: Props) {
  const [phone, setPhone] = useState(church.phone || '')
  const [website, setWebsite] = useState(church.website || '')
  const [adoration, setAdoration] = useState(church.has_adoration)
  const [confessions, setConfessions] = useState(church.has_confessions)
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(schedules)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [newTime, setNewTime] = useState('10:00')
  const [newSeason, setNewSeason] = useState('todo_el_año')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmCount, setConfirmCount] = useState(0)
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [userId, setUserId] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const { data: confs } = await supabase
        .from('church_confirmations')
        .select('user_id')
        .eq('church_id', church.id)
      if (confs) {
        setConfirmCount(confs.length)
        if (user) setHasConfirmed(confs.some(c => c.user_id === user.id))
      }
    }
    init()
  }, [])

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const addSchedules = async () => {
    if (selectedDays.length === 0) return
    const inserts = selectedDays.map(day => ({
      church_id: church.id, day_of_week: day,
      time: newTime, language: 'es',
      notes: '', season: newSeason
    }))
    const { data, error } = await supabase
      .from('mass_schedules').insert(inserts).select()
    if (!error && data) {
      setLocalSchedules(prev => [...prev, ...data])
      setSelectedDays([])
    }
  }

  const deleteSchedule = async (id: string) => {
    await supabase.from('mass_schedules').delete().eq('id', id)
    setLocalSchedules(prev => prev.filter(s => s.id !== id))
  }

  const handleConfirm = async () => {
    if (hasConfirmed) {
      await supabase.from('church_confirmations').delete()
        .eq('church_id', church.id).eq('user_id', userId)
      setConfirmCount(c => c - 1)
      setHasConfirmed(false)
    } else {
      await supabase.from('church_confirmations')
        .insert({ church_id: church.id, user_id: userId })
      setConfirmCount(c => c + 1)
      setHasConfirmed(true)
    }
  }

  const save = async () => {
    setSaving(true)
    await supabase.from('churches').update({
      phone: phone || null,
      website: website || null,
      has_adoration: adoration,
      has_confessions: confessions,
    }).eq('id', church.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); onSaved() }, 1500)
  }

  const groupedBySeasonAndDay = localSchedules.reduce((acc, s) => {
    const season = s.season || 'todo_el_año'
    if (!acc[season]) acc[season] = {}
    const day = DAYS[s.day_of_week]
    if (!acc[season][day]) acc[season][day] = []
    acc[season][day].push({ time: s.time?.slice(0, 5), id: s.id })
    return acc
  }, {} as Record<string, Record<string, { time: string; id: string }[]>>)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'rgba(8,14,24,0.88)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        width: '100%', maxHeight: '90vh', overflowY: 'auto',
        background: 'linear-gradient(180deg, rgba(20,34,51,0.99), rgba(12,22,38,1))',
        borderRadius: '24px 24px 0 0',
        borderTop: '1px solid rgba(201,162,39,0.2)',
        padding: '20px 20px 48px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Añadir información</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--text)', fontSize: '17px', margin: '4px 0 0', fontWeight: 700 }}>{church.name}</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border2)',
            borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={16} color="var(--muted)" />
          </button>
        </div>

        {/* Confirmar información */}
        <button onClick={handleConfirm} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', padding: '12px', marginBottom: '20px',
          background: hasConfirmed ? 'rgba(34,197,94,0.15)' : 'rgba(201,162,39,0.08)',
          border: hasConfirmed ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(201,162,39,0.2)',
          borderRadius: '14px', cursor: 'pointer',
          color: hasConfirmed ? '#4ade80' : 'var(--muted)', fontSize: '13px', fontWeight: 600,
        }}>
          <CheckCircle size={16} />
          {hasConfirmed ? `✓ Confirmado por ti y ${confirmCount - 1} más` : `Confirmar que la información es correcta${confirmCount > 0 ? ` · ${confirmCount} ya lo confirmaron` : ''}`}
        </button>

        {/* Contacto */}
        <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 10px' }}>CONTACTO</p>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" style={inputStyle} />
        <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Web (https://...)" style={{ ...inputStyle, marginBottom: '18px' }} />

        {/* Servicios */}
        <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 10px' }}>SERVICIOS</p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[{ label: 'Adoración', value: adoration, set: setAdoration }, { label: 'Confesiones', value: confessions, set: setConfessions }].map(({ label, value, set }) => (
            <button key={label} onClick={() => set(!value)} style={{
              flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer',
              border: value ? '1px solid rgba(201,162,39,0.5)' : '1px solid var(--border2)',
              background: value ? 'rgba(201,162,39,0.15)' : 'rgba(26,46,66,0.4)',
              color: value ? 'var(--gold)' : 'var(--muted)', fontSize: '13px', fontWeight: 600,
            }}>{value ? '✓ ' : ''}{label}</button>
          ))}
        </div>

        {/* Horarios existentes */}
        {Object.keys(groupedBySeasonAndDay).length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            {Object.entries(groupedBySeasonAndDay).map(([season, days]) => (
              <div key={season} style={{ marginBottom: '12px' }}>
                <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 8px' }}>
                  HORARIOS — {SEASONS.find(s => s.value === season)?.label.toUpperCase()}
                </p>
                {Object.entries(days).map(([day, entries]) => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '12px', width: '28px' }}>{day}</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1 }}>
                      {entries.map((e, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(201,162,39,0.1)', borderRadius: '8px', padding: '3px 8px', border: '1px solid rgba(201,162,39,0.2)' }}>
                          <span style={{ color: 'var(--text)', fontSize: '12px' }}>{e.time}</span>
                          <button onClick={() => deleteSchedule(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                            <X size={10} color="var(--muted)" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Añadir horarios */}
        <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 10px' }}>AÑADIR HORARIO DE MISA</p>

        {/* Días (múltiple selección) */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {DAYS.map((d, i) => (
            <button key={i} onClick={() => toggleDay(i)} style={{
              padding: '7px 10px', borderRadius: '10px', cursor: 'pointer',
              border: selectedDays.includes(i) ? '1px solid rgba(201,162,39,0.5)' : '1px solid var(--border2)',
              background: selectedDays.includes(i) ? 'rgba(201,162,39,0.2)' : 'rgba(26,46,66,0.4)',
              color: selectedDays.includes(i) ? 'var(--gold)' : 'var(--muted)',
              fontSize: '12px', fontWeight: 600,
            }}>{d}</button>
          ))}
        </div>

        {/* Hora + Temporada */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <input
            type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
            style={{ flex: 1, background: 'rgba(26,46,66,0.6)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 12px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}
          />
          <select value={newSeason} onChange={e => setNewSeason(e.target.value)}
            style={{ flex: 1.5, background: 'rgba(26,46,66,0.6)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 12px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}>
            {SEASONS.map(s => <option key={s.value} value={s.value} style={{ background: '#111827' }}>{s.label}</option>)}
          </select>
          <button onClick={addSchedules} disabled={selectedDays.length === 0} style={{
            background: selectedDays.length > 0 ? 'rgba(201,162,39,0.2)' : 'rgba(26,46,66,0.3)',
            border: '1px solid rgba(201,162,39,0.3)', borderRadius: '12px',
            padding: '11px 14px', cursor: selectedDays.length > 0 ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Plus size={18} color={selectedDays.length > 0 ? 'var(--gold)' : 'var(--muted)'} />
          </button>
        </div>

        {selectedDays.length > 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '12px' }}>
            Se añadirá a: {selectedDays.map(d => DAYS[d]).join(', ')}
          </p>
        )}

        {/* Guardar */}
        <button onClick={save} disabled={saving} style={{
          width: '100%', padding: '15px',
          background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.16))',
          border: saved ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(201,162,39,0.4)',
          borderRadius: '14px', color: saved ? '#4ade80' : 'var(--gold)',
          fontSize: '15px', fontWeight: 700, cursor: 'pointer',
        }}>
          {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}