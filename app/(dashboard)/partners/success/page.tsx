import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import Link from 'next/link'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  let success = false

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)

      if (session.payment_status === 'paid' && session.metadata?.partner_id) {
        const supabase = await createClient()
        await supabase
          .from('partners')
          .update({ status: 'active', stripe_session_id: session_id })
          .eq('id', session.metadata.partner_id)
        success = true
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)', fontFamily: "'Inter', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26,46,66,0.96), rgba(14,28,48,0.92))',
        border: '1px solid rgba(201,162,39,0.2)',
        borderRadius: '24px', padding: '40px 32px',
        textAlign: 'center', maxWidth: '420px', width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>
        {success ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✝️</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '700', color: 'var(--text)', margin: '0 0 12px' }}>
              ¡Bienvenido a Partners!
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, margin: '0 0 28px' }}>
              Tu negocio ya está publicado en el directorio de Koinonia. La comunidad podrá encontrarte.
            </p>
            <span style={{ display: 'inline-block', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)', color: 'var(--gold-light)', fontSize: '12px', fontWeight: '500', padding: '5px 16px', borderRadius: '9999px', marginBottom: '28px' }}>
              ✅ Valores católicos certificados
            </span>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: 'var(--text)', margin: '0 0 12px' }}>
              Algo fue mal
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 28px' }}>
              No se pudo verificar el pago. Contacta con soporte.
            </p>
          </>
        )}

        <Link href="/partners" style={{
          display: 'block', textDecoration: 'none',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.28), rgba(201,162,39,0.16))',
          border: '1px solid rgba(201,162,39,0.4)',
          borderRadius: '14px', padding: '14px',
          color: 'var(--gold-light)', fontWeight: '600', fontSize: '15px',
        }}>
          Ver Partners →
        </Link>
      </div>
    </div>
  )
}