'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

const PRESETS = [2, 5, 10, 20]

export default function DonationForm() {
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom]     = useState('')
  const [loading, setLoading]   = useState(false)

  const amount = selected ?? (custom ? parseFloat(custom) : 0)
  const valid  = amount >= 1

  async function handleDonate() {
    if (!valid) return
    setLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      const { url, error } = await res.json()
      if (error) { alert(error); return }
      if (url) window.location.href = url
    } catch {
      alert('Error al procesar la donación')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>

      {/* Importes predefinidos */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => { setSelected(p); setCustom('') }}
            style={{
              width: '72px', height: '48px', borderRadius: '12px',
              border: selected === p ? '2px solid rgba(201,162,39,0.7)' : '1px solid rgba(245,240,232,0.12)',
              background: selected === p ? 'rgba(201,162,39,0.18)' : 'rgba(26,46,66,0.5)',
              color: selected === p ? '#E8C55A' : 'rgba(245,240,232,0.6)',
              fontWeight: '700', fontSize: '16px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {p}€
          </button>
        ))}
      </div>

      {/* Importe libre */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          type="number"
          min="1"
          placeholder="Otro importe (€)"
          value={custom}
          onChange={e => { setCustom(e.target.value); setSelected(null) }}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(26,46,66,0.6)',
            border: custom ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(245,240,232,0.12)',
            borderRadius: '14px', padding: '13px 44px 13px 16px',
            color: '#F5F0E8', fontSize: '16px',
            fontFamily: "'Inter', sans-serif",
            outline: 'none', textAlign: 'center',
          }}
        />
        <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,240,232,0.35)', fontSize: '16px' }}>€</span>
      </div>

      {/* Botón donar */}
      <button
        onClick={handleDonate}
        disabled={!valid || loading}
        style={{
          width: '100%', padding: '15px',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: valid ? 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.16))' : 'rgba(245,240,232,0.05)',
          border: valid ? '1px solid rgba(201,162,39,0.45)' : '1px solid rgba(245,240,232,0.08)',
          color: valid ? '#E8C55A' : 'rgba(245,240,232,0.3)',
          fontWeight: '700', fontSize: '16px',
          cursor: valid ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
      >
        <Heart size={18} fill={valid ? '#E8C55A' : 'none'} color={valid ? '#E8C55A' : 'rgba(245,240,232,0.3)'} />
        {loading ? 'Redirigiendo...' : valid ? `Donar ${amount}€` : 'Elige un importe'}
      </button>

      <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.3)', textAlign: 'center', marginTop: '12px' }}>
        Pago seguro con Stripe · Mínimo 1€
      </p>
    </div>
  )
}