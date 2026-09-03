'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft } from 'lucide-react'

function RegisterForm() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('rol') as 'peregrino' | 'anfitrion' | null

  const [step, setStep] = useState(initialRole ? 2 : 1)
  const [role, setRole] = useState<'peregrino' | 'anfitrion' | null>(initialRole)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, role }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          role,
          first_name: firstName,
          last_name: lastName,
        })

      if (profileError) {
        setError('Error al crear el perfil. Inténtalo de nuevo.')
        setLoading(false)
        return
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl shadow-md p-10 border border-gray-100">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-serif font-bold mb-4" style={{color: '#1B3A6B'}}>
            ¡Cuenta creada!
          </h2>
          <p className="text-gray-600 mb-8">
            Revisa tu email para confirmar tu cuenta y luego inicia sesión.
          </p>
          <Link
            href="/login"
            className="block w-full text-white font-bold py-3 rounded-xl text-center transition-all shadow-md"
            style={{background: '#C9A227'}}
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">

      {/* PASO 1 — Elegir rol */}
      {step === 1 && (
        <>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md" style={{background: '#1B3A6B'}}>
              <span className="font-serif text-2xl font-bold" style={{color: '#C9A227'}}>K</span>
            </div>
            <h1 className="text-3xl font-serif font-bold" style={{color: '#1B3A6B'}}>Únete a Koinonia</h1>
            <p className="text-gray-500 mt-2">¿Cómo quieres participar?</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => { setRole('peregrino'); setStep(2) }}
              className="w-full bg-white rounded-2xl p-6 border-2 text-left hover:shadow-lg transition-all"
              style={{borderColor: '#1B3A6B'}}
            >
              <div className="text-4xl mb-3">🎒</div>
              <h3 className="text-xl font-serif font-bold mb-2" style={{color: '#1B3A6B'}}>
                Soy Peregrino
              </h3>
              <p className="text-gray-500 text-sm">
                Quiero viajar y conocer la vida católica local de la mano de un anfitrión
              </p>
            </button>

            <button
              onClick={() => { setRole('anfitrion'); setStep(2) }}
              className="w-full rounded-2xl p-6 border-2 text-left hover:shadow-lg transition-all"
              style={{background: '#1B3A6B', borderColor: '#1B3A6B'}}
            >
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-xl font-serif font-bold mb-2 text-white">
                Soy Anfitrión
              </h3>
              <p className="text-sm" style={{color: '#bfcde9'}}>
                Quiero acoger a peregrinos y mostrarles mi ciudad con ojos de fe
              </p>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{color: '#1B3A6B'}}>
              Inicia sesión
            </Link>
          </p>
        </>
      )}

      {/* PASO 2 — Datos personales */}
      {step === 2 && (
        <>
          <div className="text-center mb-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mx-auto mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Cambiar rol
            </button>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 text-sm font-medium border"
              style={{
                background: role === 'peregrino' ? '#fdf9ed' : '#f0f3fa',
                borderColor: role === 'peregrino' ? '#eccb6a' : '#bfcde9',
                color: role === 'peregrino' ? '#8B6914' : '#1B3A6B',
              }}
            >
              {role === 'peregrino' ? '🎒 Peregrino' : '🏠 Anfitrión'}
            </div>
            <h1 className="text-3xl font-serif font-bold" style={{color: '#1B3A6B'}}>
              Crea tu cuenta
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8 border border-gray-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Tu apellido"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                style={{background: '#C9A227'}}
              >
                {loading ? 'Creando cuenta...' : (
                  <>Crear mi cuenta <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="underline">Términos de uso</a>
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterForm />
    </Suspense>
  )
}