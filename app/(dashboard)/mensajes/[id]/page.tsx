'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Send, User } from 'lucide-react'

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
}

type Profile = {
  id: string
  first_name: string
  last_name: string
  avatar_url: string
}

export default function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [other, setOther] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: conn } = await supabase
        .from('connections')
        .select(`
          pilgrim:profiles!connections_pilgrim_id_fkey(id, first_name, last_name, avatar_url),
          host:profiles!connections_host_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (conn) {
        const pRaw: any = conn.pilgrim
        const hRaw: any = conn.host
        const pilgrimProfile = Array.isArray(pRaw) ? pRaw[0] : pRaw
        const hostProfile = Array.isArray(hRaw) ? hRaw[0] : hRaw

        const otherProfile = pilgrimProfile?.id === user.id ? hostProfile : pilgrimProfile
        setOther(otherProfile as Profile)
      }

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('connection_id', id)
        .order('created_at', { ascending: true })

      setMessages(msgs || [])
      setLoading(false)
    }

    init()

    const channel = supabase
      .channel(`chat-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `connection_id=eq.${id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return
    const content = newMessage.trim()
    setNewMessage('')

    await supabase.from('messages').insert({
      connection_id: id,
      sender_id: user.id,
      content,
      read: false
    })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0C1828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Cargando conversación...</p>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(12,24,40,0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(201,162,39,0.12)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <ChevronLeft size={22} />
        </button>
        {other?.avatar_url ? (
          <img src={other.avatar_url} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gold)' }} alt="" />
        ) : (
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="var(--gold)" />
          </div>
        )}
        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700', fontSize: '16px', color: 'var(--text)', margin: 0 }}>
          {other?.first_name} {other?.last_name}
        </p>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '60px', fontSize: '14px' }}>
            Sé el primero en escribir
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '280px', padding: '12px 16px', borderRadius: isMine ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                background: isMine ? 'linear-gradient(135deg, rgba(201,162,39,0.3), rgba(201,162,39,0.15))' : 'rgba(26,46,66,0.8)',
                border: isMine ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(245,240,232,0.1)',
                color: 'var(--text)', fontSize: '14px', lineHeight: 1.6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        position: 'fixed', bottom: '64px', left: 0, right: 0,
        background: 'rgba(12,24,40,0.95)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid rgba(201,162,39,0.12)',
        padding: '10px 16px', display: 'flex', gap: '8px',
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1, background: 'rgba(26,46,66,0.6)', border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: '9999px', padding: '10px 18px', color: 'var(--text)', fontSize: '14px', outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A227, #B8901A)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Send size={18} color="#0C1828" />
        </button>
      </div>
    </div>
  )
}