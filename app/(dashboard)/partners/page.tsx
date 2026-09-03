'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Plus, X, Phone, Globe, MapPin } from 'lucide-react'

type Partner = {
  id: string
  user_id: string
  business_name: string
  category: string
  description: string | null
  city: string | null
  website: string | null
  phone: string | null
  status: string
  created_at: string
  profiles: { first_name: string; last_name: string }
}

const CATEGORIES = [
  { key: 'all',          label: 'Todos',        emoji: '✨' },
  { key: 'alojamiento',  label: 'Alojamiento',  emoji: '🏨' },
  { key: 'restauracion', label: 'Restauración', emoji: '🍽️' },
  { key: 'comercio',     label: 'Comercio',     emoji: '🛍️' },
  { key: 'formacion',    label: 'Formación',    emoji: '📚' },
  { key: 'salud',        label: 'Salud',        emoji: '🏥' },
  { key: 'viajes',       label: 'Viajes',       emoji: '✈️' },
  { key: 'arte',         label: 'Arte',         emoji: '🎨' },
  { key: 'servicios',    label: 'Servicios',    emoji: '🔧' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(26,46,66,0.6)',
  border: '1px solid rgba(201,162,39,0.2)',
  borderRadius: '12px', padding: '12px 14px',
  color: 'var(--text)', fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none', marginBottom: '10px',
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [userId, setUserId]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [showNew, setShowNew]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [bName, setBName]         = useState('')
  const [bCat, setBCat]           = useState('alojamiento')
  const [bCity, setBCity]         = useState('')
  const [bDesc, setBDesc]         = useState('')
  const [bPhone, setBPhone]       = useState('')
  const [bWeb, setBWeb]           = useState('')
  const [certified, setCertified] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function loadPartners() {
    const { data } = await supabase
      .from('partners')
      .select('*, profiles(first_name, last_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (data) setPartners(data as Partner[])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
    loadPartners()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit() {
    if (!bName.trim()) { alert('⚠️ Escribe el nombre del negocio'); return }
    if (!userId)       { alert('⚠️ No hay sesión — recarga la página'); return }
    if (!certified)    { alert('⚠️ Marca la certificación'); return }

    setSubmitting(true)

    const { data: partner, error } = await supabase
      .from('partners')
      .insert({
        user_id: userId,
        business_name: bName.trim(),
        category: bCat,
        city: bCity.trim() || null,
        description: bDesc.trim() || null,
        phone: bPhone.trim() || null,
        website: bWeb.trim() || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      alert('❌ Error Supabase: ' + error.message)
      setSubmitting(false)
      return
    }
    if (!partner) {
      alert('❌ No se creó el partner')
      setSubmitting(false)
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partner_id: partner.id, business_name: partner.business_name }),
    })

    if (!res.ok) {
      const txt = await res.text()
      alert('❌ Error checkout: ' + txt)
      setSubmitting(false)
      return
    }

    const { url, error: stripeError } = await res.json()

    if (stripeError) {
      alert('❌ Error Stripe: ' + stripeError)
      setSubmitting(false)
      return
    }
    if (!url) {
      alert('❌ No hay URL de pago')
      setSubmitting(false)
      return
    }

    window.location.href = url
  }

  const filtered = filter === 'all' ? partners : partners.filter(p => p.category === filter)
  const catMap   = Object.fromEntries(CATEGORIES.map(c => [c.key, c]))

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)', fontFamily: "'Inter', sans-serif", paddingBottom: '100px',
    }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.38) saturate(0.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(12,24,40,0.3), rgba(12,24,40,0.9))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px 20px 20px' }}>
          <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 4px' }}>Koinonia</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontSize: '24px', fontWeight: '700', margin: 0 }}>Partners</h1>
        </div>
      </div>

      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setFilter(cat.key)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: '9999px', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
              border: filter === cat.key ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(245,240,232,0.1)',
              background: filter === cat.key ? 'rgba(201,162,39,0.15)' : 'rgba(26,46,66,0.5)',
              color: filter === cat.key ? 'var(--gold-light)' : 'var(--muted)',
            }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Botón anunciar */}
        <button onClick={() => setShowNew(true)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.14), rgba(201,162,39,0.07))',
          border: '1px solid rgba(201,162,39,0.28)', borderRadius: '16px',
          padding: '14px 16px', cursor: 'pointer', marginBottom: '20px',
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,162,39,0.18)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plus size={18} color="var(--gold)" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--gold-light)' }}>Anunciar mi negocio — 29€/año</p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--muted)' }}>Certifica tus valores católicos</p>
          </div>
        </button>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--text)', marginBottom: '8px' }}>Aún no hay negocios aquí</p>
              <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>¡Sé el primero en anunciarte! ✝️</p>
            </div>
          )}
          {filtered.map(partner => {
            const cat     = catMap[partner.category] || catMap['servicios']
            const inicial = partner.business_name[0]?.toUpperCase() || '?'
            return (
              <div key={partner.id} style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.75), rgba(20,34,51,0.7))', borderRadius: '20px', padding: '18px', border: '1px solid rgba(201,162,39,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '10px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(201,162,39,0.2), rgba(201,162,39,0.08))', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: 'var(--gold)', flexShrink: 0 }}>
                    {inicial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>{partner.business_name}</h3>
                      <span style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', color: 'var(--gold-light)', fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '9999px' }}>
                        {cat.emoji} {cat.label}
                      </span>
                    </div>
                    {partner.city && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={11} color="var(--muted)" />
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{partner.city}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span style={{ display: 'inline-block', fontSize: '11px', color: 'rgba(201,162,39,0.7)', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.18)', padding: '2px 10px', borderRadius: '9999px', marginBottom: '10px' }}>
                  ✝️ Valores católicos certificados
                </span>
                {partner.description && (
                  <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 12px' }}>{partner.description}</p>
                )}
                {(partner.phone || partner.website) && (
                  <div style={{ display: 'flex', gap: '14px' }}>
                    {partner.phone && (
                      <a href={`tel:${partner.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--gold)', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                        <Phone size={13} /> {partner.phone}
                      </a>
                    )}
                    {partner.website && (
                      <a href={partner.website} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--gold)', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                        <Globe size={13} /> Web
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(8,14,24,0.88)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'linear-gradient(180deg, rgba(20,34,51,0.99), rgba(12,22,38,1))', borderRadius: '24px 24px 0 0', borderTop: '1px solid rgba(201,162,39,0.2)', padding: '20px 20px 44px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '2px', height: '18px', background: 'var(--gold)', borderRadius: '1px' }} />
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>Anunciar mi negocio</span>
              </div>
              <button onClick={() => setShowNew(false)} style={{ background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.12)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} color="var(--muted)" />
              </button>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Nombre del negocio *</p>
            <input value={bName} onChange={e => setBName(e.target.value)} placeholder="Ej: Hostal San Camino" style={inputStyle} />

            <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Categoría *</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                <button key={cat.key} onClick={() => setBCat(cat.key)} style={{ padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', border: bCat === cat.key ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(245,240,232,0.1)', background: bCat === cat.key ? 'rgba(201,162,39,0.15)' : 'transparent', color: bCat === cat.key ? 'var(--gold-light)' : 'var(--muted)' }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Ciudad</p>
            <input value={bCity} onChange={e => setBCity(e.target.value)} placeholder="Ej: Santiago de Compostela" style={inputStyle} />

            <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Descripción</p>
            <textarea value={bDesc} onChange={e => setBDesc(e.target.value)} placeholder="Cuéntanos sobre tu negocio..." rows={3} style={{ ...inputStyle, resize: 'none' }} />

            <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Teléfono</p>
            <input value={bPhone} onChange={e => setBPhone(e.target.value)} placeholder="+34 600 000 000" style={inputStyle} />

            <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Web</p>
            <input value={bWeb} onChange={e => setBWeb(e.target.value)} placeholder="https://..." style={inputStyle} />

            <div onClick={() => setCertified(!certified)} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', borderRadius: '14px', border: `1px solid ${certified ? 'rgba(201,162,39,0.4)' : 'rgba(245,240,232,0.1)'}`, background: certified ? 'rgba(201,162,39,0.08)' : 'rgba(26,46,66,0.4)', cursor: 'pointer', marginBottom: '16px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${certified ? 'var(--gold)' : 'rgba(245,240,232,0.2)'}`, background: certified ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                {certified && <span style={{ color: '#0C1828', fontSize: '12px', fontWeight: '900' }}>✓</span>}
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
                Certifico que mi negocio opera bajo <span style={{ color: 'var(--gold-light)', fontWeight: '600' }}>valores católicos</span> y me comprometo a tratar a todos con dignidad cristiana.
              </p>
            </div>

            <div style={{ background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.18)', borderRadius: '14px', padding: '14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)', fontWeight: '600' }}>Listing anual</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--muted)' }}>Aparece en el directorio 12 meses</p>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: 'var(--gold)' }}>29€</span>
            </div>

            <button onClick={handleSubmit} disabled={submitting} style={{
              width: '100%', padding: '15px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.16))',
              border: '1px solid rgba(201,162,39,0.4)',
              color: 'var(--gold-light)', fontWeight: '600', fontSize: '15px',
              cursor: 'pointer',
            }}>
              {submitting ? 'Procesando...' : '💳 Pagar y publicar — 29€'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}