import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const { amount } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'El importe mínimo es 1€' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Donación a Koinonia',
            description: 'Gracias por apoyar la comunidad de fe',
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      success_url: `${req.nextUrl.origin}/donacion/gracias`,
      cancel_url:  `${req.nextUrl.origin}/#donacion`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Stripe donate error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}