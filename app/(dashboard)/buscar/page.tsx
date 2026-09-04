'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, User, MessageCircle, Navigation, Home } from 'lucide-react'
import Link from 'next/link'

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
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<Profile[]>([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Búsqueda inicial de anfitriones destacados
    searchHosts('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function searchHosts(city: string) {
    setLoading(true)
    let q = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'anfitrion')

    if (city.trim()) {
      q = q.ilike('city', `%${city.trim()}%`)
    }

    const { data } = await q.limit(20)
    setResults(data || [])
    setLoading(false)
    setSearched(true)
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
          Buscar Anfitriones
        </h1>

        {/* Buscador */}
        <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
          <Search size={18} color="rgba(201,162,39,0.6)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              searchHosts(e.target.value)
            }}
            placeholder="Buscar por ciudad (ej: Madrid, Santiago)..."
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
            <p style={{ margin: 0, fontSize: '14px' }}>Buscando anfitriones...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <User size={36} color="rgba(201,162,39,0.3)" style={{ marginBottom: '14px' }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--text)', marginBottom: '6px' }}>
              No encontramos anfitriones
            </p>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
              Prueba buscando otra ciudad cercana
            </p>
          </div>
        )}

        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {results.map((profile) => {
              const nombre  = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anfitrión'
              const inicial = nombre[0]?.toUpperCase() || '?'

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
                          <Home size={10} /> Anfitrión
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

                  {/* Botón mensaje */}
                  <Link href={`/mensajes`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.28)',
                      borderRadius: '12px', padding: '10px',
                      color: 'var(--gold-light)', fontWeight: '600', fontSize: '13px',
                    }}>
                      <MessageCircle size={14} /> Contactar anfitrión
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}