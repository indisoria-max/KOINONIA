'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { X, Plus, Trash2 } from 'lucide-react'

type Church = {
  id: string; name: string; phone: string; website: string
  has_adoration: boolean; has_confessions: boolean
}

type Schedule = { id: string; day_of_week: number; time: string }

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

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
  const [newDay, setNewDay] = useState(0)
  const [newTime, setNewTime] = useState('10:00')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const addSchedule = async () => {
    const { data, error } = await supabase
      .from('mass_schedules')
      .insert({ church_id: church.id, day_of_week: newDay, time: newTime, language: 'es', notes: '' })
      .select().single()
    if (!error && data) {
      setLocalSchedules(prev => [...prev, data])
    }
  }

  const deleteSchedule = async (id: string) => {
    await supabase.from('mass_schedules').delete().eq('id', id)
    setLocalSchedules(prev => prev.filter(s => s.id !== id))
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'rgba(8,14,24,0.88)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        width: '100%', maxHeight: '85vh', overflowY: 'auto',
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

        {/* Contacto */}
        <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 10px' }}>CONTACTO</p>
        <input
          value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="Teléfono (ej: +34 91 123 45 67)"
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(26,46,66,0.6)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text)', fontSize: '14px', outline: 'none', marginBottom: '10px' }}
        />
        <input
          value={website} onChange={e => setWebsite(e.target.value)}
          placeholder="Web (ej: https://parroquia.es)"
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(26,46,66,0.6)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text)', fontSize: '14px', outline: 'none', marginBottom: '18px' }}
        />

        {/* Servicios */}
        <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 10px' }}>SERVICIOS</p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
          {[
            { label: 'Adoración', value: adoration, set: setAdoration },
            { label: 'Confesiones', value: confessions, set: setConfessions },
          ].map(({ label, value, set }) => (
            <button key={label} onClick={() => set(!value)} style={{
              flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer',
              border: value ? '1px solid rgba(201,162,39,0.5)' : '1px solid var(--border2)',
              background: value ? 'rgba(201,162,39,0.15)' : 'rgba(26,46,66,0.4)',
              color: value ? 'var(--gold)' : 'var(--muted)', fontSize: '13px', fontWeight: 600,
            }}>{value ? '✓ ' : ''}{label}</button>
          ))}
        </div>

        {/* Horarios existentes */}
        <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 10px' }}>HORARIOS DE MISA</p>
        {localSchedules.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            {localSchedules.map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(26,46,66,0.4)', borderRadius: '10px',
                padding: '10px 14px', marginBottom: '6px',
                border: '1px solid var(--border2)'
              }}>
                <span style={{ color: 'var(--text)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 600, marginRight: '10px' }}>{DAYS_SHORT[s.day_of_week]}</span>
                  {s.time?.slice(0, 5)}
                </span>
                <button onClick={() => deleteSchedule(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                  <Trash2 size={15} color="rgba(245,240,232,0.3)" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Añadir horario */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <select
            value={newDay} onChange={e => setNewDay(Number(e.target.value))}
            style={{ flex: 1, background: 'rgba(26,46,66,0.6)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 12px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
          >
            {DAYS.map((d, i) => <option key={i} value={i} style={{ background: '#111827' }}>{d}</option>)}
          </select>
          <input
            type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
            style={{ width: '100px', background: 'rgba(26,46,66,0.6)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 12px', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
          />
          <button onClick={addSchedule} style={{
            background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.3)',
            borderRadius: '12px', padding: '11px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Plus size={18} color="var(--gold)" />
          </button>
        </div>

        {/* Guardar */}
        <button onClick={save} disabled={saving} style={{
          width: '100%', padding: '15px',
          background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.16))',
          border: saved ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(201,162,39,0.4)',
          borderRadius: '14px', color: saved ? '#4ade80' : 'var(--gold)',
          fontSize: '15px', fontWeight: 700, cursor: 'pointer',
        }}>
          {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar información'}
        </button>
      </div>
    </div>
  )
}