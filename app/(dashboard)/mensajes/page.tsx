'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MessageSquare, User, Search, ChevronRight } from 'lucide-react'

type Conversation = {
  id: string
  otherUser: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
    city: string | null
  }
  lastMessage?: string
  updatedAt?: string
}

export default function MensajesListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading]             = useState(true)
  const supabase                          = createClient()

  useEffect(() => {
    async function loadConversations() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: connData } = await supabase
        .from('connections')
        .select(`
          id,
          created_at,
          pilgrim:profiles!connections_pilgrim_id_fkey(id, first_name, last_name, avatar_url, city),
          host:profiles!connections_host_id_fkey(id, first_name, last_name, avatar_url, city)
        `)
        .or(`pilgrim_id.eq.${user.id},host_id.eq.${user.id}`)

      if (connData) {
        const formatted: Conversation[] = connData.map((c: any) => {
          const pRaw = Array.isArray(c.pilgrim) ? c.pilgrim[0] : c.pilgrim
          const hRaw = Array.isArray(c.host) ? c.host[0] : c.host
          const other = pRaw?.id === user.id ? hRaw : pRaw

          return {
            id: c.id,
            otherUser: other || { id: '', first_name: 'Usuario', last_name: '', avatar_url: null, city: null },
            updatedAt: c.created_at,
          }
        })
        setConversations(formatted)
      }
      setLoading(false)
    }

    loadConversations()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '100px',
    }}>

      {/* Header */}
      <div style={{ padding: '48px 20px 24px', textAlign: 'center', position: 'relative' }}>
        <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 6px' }}>
          Koinonia
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>
          Mensajes
        </h1>
      </div>

      <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <p style={{ fontSize: '14px', margin: 0 }}>Cargando conversaciones...</p>
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(26,46,66,0.75), rgba(20,34,51,0.7))',
            borderRadius: '24px', padding: '40px 24px', textAlign: 'center',
            border: '1px solid rgba(201,162,39,0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '18px',
              background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <MessageSquare size={26} color="var(--gold)" />
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: 'var(--text)', margin: '0 0 8px' }}>
              No tienes mensajes aún
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
              Busca peregrinos o anfitriones en la red para iniciar una conversación de fe.
            </p>

            <Link href="/buscar" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #C9A227, #B8901A)',
                color: '#0C1828', fontWeight: '700', fontSize: '14px',
                padding: '12px 24px', borderRadius: '14px',
                boxShadow: '0 4px 16px rgba(201,162,39,0.3)',
              }}>
                <Search size={16} /> Buscar personas
              </div>
            </Link>
          </div>
        )}

        {!loading && conversations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conversations.map((conv) => {
              const name = `${conv.otherUser.first_name || ''} ${conv.otherUser.last_name || ''}`.trim() || 'Usuario'
              const inicial = name[0]?.toUpperCase() || '?'

              return (
                <Link key={conv.id} href={`/mensajes/${conv.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(26,46,66,0.75), rgba(20,34,51,0.7))',
                    borderRadius: '20px', padding: '16px',
                    border: '1px solid rgba(201,162,39,0.15)',
                    display: 'flex', alignItems: 'center', gap: '14px',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      border: '2px solid var(--gold)', overflow: 'hidden', flexShrink: 0,
                      background: 'linear-gradient(135deg, #1A2E44, #142233)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: '700', color: 'var(--gold)',
                    }}>
                      {conv.otherUser.avatar_url
                        ? <img src={conv.otherUser.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        : inicial}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '700', color: 'var(--text)', margin: '0 0 3px' }}>
                        {name}
                      </h4>
                      {conv.otherUser.city && (
                        <p style={{ fontSize: '12px', color: 'var(--gold-light)', margin: 0 }}>
                          📍 {conv.otherUser.city}
                        </p>
                      )}
                    </div>

                    <ChevronRight size={18} color="rgba(201,162,39,0.5)" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}