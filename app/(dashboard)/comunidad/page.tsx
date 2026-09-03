'use client'

import { useEffect, useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Heart, Plus, X, ImageIcon, Video, Music } from 'lucide-react'

type Post = {
  id: string
  content: string
  type: 'reflexion' | 'oracion' | 'testimonio'
  media_url:  string | null
  media_type: 'image' | 'video' | 'audio' | null
  created_at: string
  user_id: string
  profiles: { first_name: string; last_name: string; avatar_url: string | null }
  post_likes: { user_id: string }[]
}

const TYPE_CONFIG = {
  reflexion:  { label: 'Reflexión',  emoji: '🌿' },
  oracion:    { label: 'Oración',    emoji: '🙏' },
  testimonio: { label: 'Testimonio', emoji: '✨' },
}

function timeAgo(date: string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60)    return 'ahora'
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}

export default function ComunidadPage() {
  const [posts, setPosts]         = useState<Post[]>([])
  const [userId, setUserId]       = useState('')
  const [showNew, setShowNew]     = useState(false)
  const [content, setContent]     = useState('')
  const [type, setType]           = useState<Post['type']>('reflexion')
  const [posting, setPosting]     = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null)

  const imgRef   = useRef<HTMLInputElement>(null)
  const vidRef   = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(first_name, last_name, avatar_url), post_likes(user_id)')
      .order('created_at', { ascending: false })
      .limit(30)
    if (data) setPosts(data as Post[])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
    loadPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, mt: 'image' | 'video' | 'audio') {
    const file = e.target.files?.[0]
    if (!file) return
    setMediaFile(file)
    setMediaType(mt)
    setMediaPreview(URL.createObjectURL(file))
  }

  function clearMedia() {
    setMediaFile(null)
    setMediaPreview(null)
    setMediaType(null)
  }

  async function uploadMedia(file: File): Promise<string | null> {
    const ext  = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('community-media').upload(path, file)
    if (error) return null
    return supabase.storage.from('community-media').getPublicUrl(path).data.publicUrl
  }

  async function handleLike(post: Post) {
    if (!userId) return
    const liked = post.post_likes.some(l => l.user_id === userId)
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', userId)
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: userId })
    }
    loadPosts()
  }

  async function handlePost() {
    if (!content.trim() || !userId) return
    setPosting(true)
    let mediaUrl = null
    if (mediaFile) mediaUrl = await uploadMedia(mediaFile)
    await supabase.from('posts').insert({
      user_id: userId, content: content.trim(), type,
      media_url: mediaUrl, media_type: mediaUrl ? mediaType : null,
    })
    setContent(''); clearMedia(); setShowNew(false); setPosting(false)
    loadPosts()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)', fontFamily: "'Inter', sans-serif", paddingBottom: '100px',
    }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.38) saturate(0.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(12,24,40,0.3), rgba(12,24,40,0.9))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px 20px 20px' }}>
          <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 4px' }}>Koinonia</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontSize: '24px', fontWeight: '700', margin: 0 }}>Comunidad</h1>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Botón nueva publicación */}
        <button onClick={() => setShowNew(true)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
          background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))',
          border: '1px solid rgba(201,162,39,0.18)', borderRadius: '16px',
          padding: '14px 16px', cursor: 'pointer', marginBottom: '20px',
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plus size={18} color="var(--gold)" />
          </div>
          <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Comparte una reflexión, oración o testimonio...</span>
        </button>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--text)', marginBottom: '8px' }}>Sé el primero en compartir</p>
              <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>La comunidad te está esperando 🙏</p>
            </div>
          )}

          {posts.map(post => {
            const liked   = post.post_likes.some(l => l.user_id === userId)
            const cfg     = TYPE_CONFIG[post.type]
            const name    = `${post.profiles?.first_name || ''} ${post.profiles?.last_name || ''}`.trim() || 'Usuario'
            const inicial = name[0]?.toUpperCase() || '?'

            return (
              <div key={post.id} style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.75), rgba(20,34,51,0.7))', borderRadius: '20px', padding: '16px', border: '1px solid rgba(201,162,39,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}>
                
                {/* Cabecera */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid rgba(201,162,39,0.3)', overflow: 'hidden', background: 'linear-gradient(135deg, #1A2E44, #142233)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--gold)', flexShrink: 0 }}>
                    {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : inicial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>{timeAgo(post.created_at)}</p>
                  </div>
                  <span style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', color: 'var(--gold-light)', fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: '9999px' }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                </div>

                {/* Media */}
                {post.media_url && post.media_type === 'image' && (
                  <img src={post.media_url} alt="" style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', maxHeight: '320px', objectFit: 'cover', display: 'block' }} />
                )}
                {post.media_url && post.media_type === 'video' && (
                  <video controls src={post.media_url} style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', maxHeight: '320px' }} />
                )}
                {post.media_url && post.media_type === 'audio' && (
                  <audio controls src={post.media_url} style={{ width: '100%', marginBottom: '12px' }} />
                )}

                {/* Texto */}
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', lineHeight: 1.75, color: 'var(--text)', margin: '0 0 14px' }}>
                  {post.content}
                </p>

                {/* Like */}
                <button onClick={() => handleLike(post)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Heart size={18} color={liked ? '#E8C55A' : 'rgba(245,240,232,0.35)'} fill={liked ? '#E8C55A' : 'none'} />
                  <span style={{ fontSize: '13px', color: liked ? 'var(--gold-light)' : 'var(--muted)' }}>{post.post_likes.length}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal nueva publicación */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(8,14,24,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'linear-gradient(180deg, rgba(20,34,51,0.99), rgba(12,22,38,1))', borderRadius: '24px 24px 0 0', borderTop: '1px solid rgba(201,162,39,0.2)', padding: '20px 20px 44px' }}>

            {/* Header modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '2px', height: '18px', background: 'var(--gold)', borderRadius: '1px' }} />
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>Nueva publicación</span>
              </div>
              <button onClick={() => { setShowNew(false); clearMedia() }} style={{ background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.12)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} color="var(--muted)" />
              </button>
            </div>

            {/* Tipo */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {(Object.entries(TYPE_CONFIG) as [Post['type'], typeof TYPE_CONFIG[Post['type']]][]).map(([key, cfg]) => (
                <button key={key} onClick={() => setType(key)} style={{ flex: 1, padding: '8px 4px', borderRadius: '12px', cursor: 'pointer', border: type === key ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(245,240,232,0.1)', background: type === key ? 'rgba(201,162,39,0.15)' : 'transparent', color: type === key ? 'var(--gold-light)' : 'var(--muted)', fontSize: '12px', fontWeight: '500' }}>
                  {cfg.emoji} {cfg.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Escribe aquí..." rows={4}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(26,46,66,0.6)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: '14px', padding: '14px', color: 'var(--text)', fontSize: '15px', lineHeight: 1.7, fontFamily: "'Playfair Display', serif", resize: 'none', outline: 'none', marginBottom: '12px' }}
            />

            {/* Preview media */}
            {mediaPreview && (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                {mediaType === 'image' && <img src={mediaPreview} alt="" style={{ width: '100%', borderRadius: '12px', maxHeight: '180px', objectFit: 'cover' }} />}
                {mediaType === 'video' && <video src={mediaPreview} style={{ width: '100%', borderRadius: '12px', maxHeight: '180px' }} />}
                {mediaType === 'audio' && <audio controls src={mediaPreview} style={{ width: '100%' }} />}
                <button onClick={clearMedia} style={{ position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(8,14,24,0.8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={14} color="white" />
                </button>
              </div>
            )}

            {/* Botones media + publicar */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Foto */}
              <label style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <input ref={imgRef} type="file" accept="image/*" onChange={e => handleFileSelect(e, 'image')} style={{ display: 'none' }} />
                <ImageIcon size={18} color="var(--gold)" />
              </label>
              {/* Video */}
              <label style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <input ref={vidRef} type="file" accept="video/*" onChange={e => handleFileSelect(e, 'video')} style={{ display: 'none' }} />
                <Video size={18} color="var(--gold)" />
              </label>
              {/* Audio */}
              <label style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <input ref={audioRef} type="file" accept="audio/*" onChange={e => handleFileSelect(e, 'audio')} style={{ display: 'none' }} />
                <Music size={18} color="var(--gold)" />
              </label>
              {/* Publicar */}
              <button onClick={handlePost} disabled={!content.trim() || posting} style={{ flex: 1, background: content.trim() ? 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.16))' : 'rgba(245,240,232,0.05)', border: content.trim() ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(245,240,232,0.08)', borderRadius: '12px', padding: '12px', color: content.trim() ? 'var(--gold-light)' : 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: content.trim() ? 'pointer' : 'default' }}>
                {posting ? 'Subiendo...' : 'Publicar'}
              </button>
            </div>

            {/* Inputs ocultos */}
          </div>
        </div>
      )}
    </div>
  )
}