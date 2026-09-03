'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

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
        const otherProfile = (conn.pilgrim as any)?.id === user.id ? conn.host : conn.pilgrim
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
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-400">Cargando chat...</p>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-500 text-xl">‹</button>
        {other?.avatar_url ? (
          <img src={other.avatar_url} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">👤</div>
        )}
        <p className="font-bold text-gray-800">{other?.first_name} {other?.last_name}</p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-16">Sé el primero en escribir 👋</p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                isMine
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 shadow rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          ➤
        </button>
      </div>
    </div>
  )
}