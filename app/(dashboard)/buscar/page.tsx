'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, MapPin, User, MessageCircle, Navigation, Home, Users } from 'lucide-react'

type Profile = {
  id: string
  first_name: string
  last_name: string
  role: string
  city: string | null
  bio: string | null
  avatar_url: string | null
  languages: string[] | null
}

export default function BuscarPage() {
  const [query, setQuery]           = useState('')
  const [results, setResults]       = useState<Profile[]>([])
  const [loading, setLoading]       = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [connectingId, setConnectingId]   = useState<string | null>(null)
  const supabase = createClient()
  const router   = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })
    searchPeople('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function searchPeople(text: string) {
    setLoading(true)
    let q = supabase.from('profiles').select('*')

    if (text.trim()) {
      q = q.or(`city.ilike.%${text.trim()}%,first_name.ilike.%${text.trim()}%,last_name.ilike.%${text.trim()}%`)
    }

    const { data } = await q.limit(30)
    // Filtrar al usuario actual para no auto-buscarse
    const filtered = (data || []).filter(p => p.id !== currentUserId)
    setResults(filtered)
    setLoading(false)
  }

  async function startChat(targetUserId: string) {
    if (!currentUserId) {
      router.push('/login')
      return
    }

    setConnectingId(targetUserId)

    // 1. Buscar si ya existe la conexión
    const { data: existing } = await supabase
      .from('connections')
      .select('id')
      .or(`and(pilgrim_id.eq.${currentUserId},host_id.eq.${targetUserId}),and(pilgrim_id.eq.${targetUserId},host_id.eq.${currentUserId})`)
      .single()

    if (existing) {
      router.push(`/mensajes/${existing.id}`)
      return
    }

    // 2. Si no existe, crear la conexión
    const { data: newConn, error } = await supabase
      .from('connections')
      .insert({
        pilgrim_id: currentUserId,
        host_id: targetUserId
      })
      .select('id')
      .single()

    if (newConn) {
      router.push(`/mensajes/${newConn.id}`)
    } else if (error) {
      alert('Error al iniciar la conversación: ' + error.message)
    }
    setConnectingId(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '100px',
    }}>

      {/* Hero Header */}
      <div style={{ position: 'relative', padding: '48px 20px 24px', textAlign: 'center' }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '240px',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(201,162,39,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 6px' }}>
          Red Koinonia
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: 'var(--text)', margin: '0 0 20px' }}>
          Buscar en la comunidad
        </h1>

        {/* Buscador */}
        <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
          <Search size={18} color="rgba(201,162,39,0.6)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              searchPeople(e.target.value)
            }}
            placeholder="Buscar por nombre o ciudad..."
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(26,46,66,0.75)',
              border: '1px solid rgba(201,162,39,0.25)',
              borderRadius: '16px',
              padding: '14px 16px 14px 48px',
              color: 'var(--text)', fontSize: '14px',
              outline: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </div>
      </div>

      {/* Lista de resultados */}
      <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>Buscando personas...</p>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <User size={36} color="rgba(201,162,39,0.3)" style={{ marginBottom: '14px' }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--text)', marginBottom: '6px' }}>
              No se encontraron personas
            </p>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
              Prueba buscando por nombre o por otra ciudad
            </p>
          </div>
        )}

        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {results.map((profile) => {
              const nombre  = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuario'
              const inicial = nombre[0]?.toUpperCase() || '?'
              const isConnecting = connectingId === profile.id

              return (
                <div key={profile.id} style={{
                  background: 'linear-gradient(135deg, rgba(26,46,66,0.75), rgba(20,34,51,0.7))',
                  borderRadius: '20px', padding: '18px',
                  border: '1px solid rgba(201,162,39,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      border: '2px solid var(--gold)',
                      overflow: 'hidden', flexShrink: 0,
                      background: 'linear-gradient(135deg, #1A2E44, #142233)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', fontWeight: '700', color: 'var(--gold)',
                    }}>
                      {profile.avatar_url
                        ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        : inicial}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>
                          {nombre}
                        </h3>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', color: 'var(--gold-light)', fontSize: '10px', fontWeight: '500', padding: '3px 9px', borderRadius: '9999px' }}>
                          {profile.role === 'peregrino' && <><Navigation size={10} /> Peregrino</>}
                          {profile.role === 'anfitrion' && <><Home size={10} /> Anfitrión</>}
                          {profile.role === 'ambos' && <><Users size={10} /> Peregrino y Anfitrión</>}
                        </span>
                      </div>

                      {profile.city && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <MapPin size={12} color="var(--gold)" />
                          <span style={{ fontSize: '12px', color: 'var(--gold-light)', fontWeight: '500' }}>{profile.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {profile.bio && (
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 14px', fontStyle: 'italic' }}>
                      "{profile.bio}"
                    </p>
                  )}

                  {profile.languages && profile.languages.length > 0 && (
                    <p style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', margin: '0 0 14px' }}>
                      Idiomas: {profile.languages.join(', ')}
                    </p>
                  )}

                  {/* Botón iniciar chat */}
                  <button
                    onClick={() => startChat(profile.id)}
                    disabled={isConnecting}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.28)',
                      borderRadius: '12px', padding: '10px',
                      color: 'var(--gold-light)', fontWeight: '600', fontSize: '13px',
                      cursor: 'pointer', opacity: isConnecting ? 0.6 : 1
                    }}
                  >
                    <MessageCircle size={14} />
                    {isConnecting ? 'Abriendo chat...' : 'Enviar mensaje'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}