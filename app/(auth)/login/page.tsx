'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }
    if (data.session) {
      window.location.replace('/dashboard')
    } else {
      setError('No se pudo iniciar sesión. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(26,46,66,0.6)',
    border: '1px solid rgba(201,162,39,0.2)',
    borderRadius: '14px', padding: '13px 14px 13px 44px',
    color: '#F5F0E8', fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid rgba(201,162,39,0.4)', boxShadow: '0 0 24px rgba(201,162,39,0.2)', margin: '0 auto 16px', overflow: 'hidden', background: '#0C1828' }}>
          <img src="/icon-192.png" alt="Koinonia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 6px' }}>
          Bienvenido
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '14px', margin: 0 }}>
          Inicia sesión en tu cuenta
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(26,46,66,0.9), rgba(20,34,51,0.85))',
        borderRadius: '24px', padding: '32px',
        border: '1px solid rgba(201,162,39,0.18)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#FCA5A5', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="rgba(201,162,39,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="rgba(201,162,39,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
                style={{ ...inputStyle, paddingRight: '52px' }}
              />
              <div
                onPointerDown={e => { e.preventDefault(); setShowPwd(v => !v) }}
                style={{
                  position: 'absolute', right: '0', top: '0', bottom: '0',
                  width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(245,240,232,0.4)',
                }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #C9A227, #B8901A)',
              border: 'none', borderRadius: '14px',
              color: '#0C1828', fontWeight: '700', fontSize: '15px',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(201,162,39,0.3)',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(245,240,232,0.45)', marginTop: '20px', marginBottom: 0 }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" style={{ color: '#C9A227', fontWeight: '600', textDecoration: 'none' }}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}