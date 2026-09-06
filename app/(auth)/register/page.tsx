'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft, Navigation, Building2, Users, Check } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(26,46,66,0.6)',
  border: '1px solid rgba(201,162,39,0.2)',
  borderRadius: '14px', padding: '13px 14px',
  color: '#F5F0E8', fontSize: '15px',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
}

function RegisterForm() {
  const searchParams  = useSearchParams()
  const initialRole   = searchParams.get('rol') as 'peregrino' | 'anfitrion' | 'ambos' | null
  const [step, setStep]           = useState(initialRole ? 2 : 1)
  const [role, setRole]           = useState<'peregrino' | 'anfitrion' | 'ambos' | null>(initialRole)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { first_name: firstName, last_name: lastName, role } }
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id, role, first_name: firstName, last_name: lastName,
      })
      if (profileError) { setError('Error al crear el perfil.'); setLoading(false); return }
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(201,162,39,0.15)', border: '2px solid rgba(201,162,39,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Check size={36} color="#C9A227" />
      </div>
      <div style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.9), rgba(20,34,51,0.85))', borderRadius: '24px', padding: '36px 32px', border: '1px solid rgba(201,162,39,0.18)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#F5F0E8', marginBottom: '12px' }}>¡Cuenta creada!</h2>
        <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
          Revisa tu email para confirmar tu cuenta y luego inicia sesión.
        </p>
        <Link href="/login" style={{ display: 'block', background: 'linear-gradient(135deg, #C9A227, #B8901A)', color: '#0C1828', fontWeight: '700', fontSize: '15px', padding: '14px', borderRadius: '14px', textDecoration: 'none', textAlign: 'center' }}>
          Ir a iniciar sesión
        </Link>
      </div>
    </div>
  )

  if (step === 1) return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid rgba(201,162,39,0.4)', boxShadow: '0 0 24px rgba(201,162,39,0.2)', margin: '0 auto 16px', overflow: 'hidden', background: '#0C1828' }}>
          <img src="/icon-192.png" alt="Koinonia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 8px' }}>Únete a Koinonia</h1>
        <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: '14px', margin: 0 }}>¿Cómo quieres participar?</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => { setRole('peregrino'); setStep(2) }}
          style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '20px', padding: '18px', textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <Navigation size={20} color="#C9A227" />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 4px' }}>Soy Peregrino</h3>
          <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', margin: 0 }}>Quiero viajar y conocer la vida católica local</p>
        </button>

        <button
          type="button"
          onClick={() => { setRole('anfitrion'); setStep(2) }}
          style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '20px', padding: '18px', textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <Building2 size={20} color="#C9A227" />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 4px' }}>Soy Anfitrión</h3>
          <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', margin: 0 }}>Quiero acoger a peregrinos y mostrarles mi ciudad</p>
        </button>

        <button
          type="button"
          onClick={() => { setRole('ambos'); setStep(2) }}
          style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.14), rgba(201,162,39,0.06))', border: '1px solid rgba(201,162,39,0.35)', borderRadius: '20px', padding: '18px', textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(201,162,39,0.18)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <Users size={20} color="#C9A227" />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 4px' }}>Ambos (Peregrino y Anfitrión)</h3>
          <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', margin: 0 }}>Quiero viajar y también acoger en mi ciudad</p>
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(245,240,232,0.4)' }}>
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" style={{ color: '#C9A227', fontWeight: '600', textDecoration: 'none' }}>Inicia sesión</Link>
      </p>
    </div>
  )

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(245,240,232,0.45)', fontSize: '13px', cursor: 'pointer', marginBottom: '14px' }}
        >
          <ArrowLeft size={14} /> Cambiar rol
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '9999px', padding: '5px 14px', marginBottom: '16px', width: 'fit-content', margin: '0 auto 16px' }}>
          {role === 'peregrino' && <><Navigation size={13} color="#E8C55A" /><span style={{ fontSize: '12px', color: '#E8C55A', fontWeight: '500' }}>Peregrino</span></>}
          {role === 'anfitrion' && <><Building2 size={13} color="#E8C55A" /><span style={{ fontSize: '12px', color: '#E8C55A', fontWeight: '500' }}>Anfitrión</span></>}
          {role === 'ambos' && <><Users size={13} color="#E8C55A" /><span style={{ fontSize: '12px', color: '#E8C55A', fontWeight: '500' }}>Peregrino y Anfitrión</span></>}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#F5F0E8', margin: 0 }}>Crea tu cuenta</h1>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.9), rgba(20,34,51,0.85))', borderRadius: '24px', padding: '28px', border: '1px solid rgba(201,162,39,0.18)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#FCA5A5', marginBottom: '20px' }}>{error}</div>
        )}
        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Nombre</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Tu nombre" required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Apellido</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Tu apellido" required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#C9A227', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required minLength={8} style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #C9A227, #B8901A)',
            border: 'none', borderRadius: '14px',
            color: '#0C1828', fontWeight: '700', fontSize: '15px',
            cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(201,162,39,0.3)',
          }}>
            {loading ? 'Creando cuenta...' : <><span>Crear mi cuenta</span><ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ color: 'rgba(245,240,232,0.4)', fontSize: '14px' }}>Cargando...</div>}>
      <RegisterForm />
    </Suspense>
  )
}