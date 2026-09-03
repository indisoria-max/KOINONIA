import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Anuncio en Koinonia Partners',
            description: `Listing anual para: ${body.business_name}`,
          },
          unit_amount: 2900,
        },
        quantity: 1,
      }],
      success_url: `${req.nextUrl.origin}/partners/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${req.nextUrl.origin}/partners`,
      metadata: {
        partner_id:    body.partner_id,
        business_name: body.business_name,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Stripe error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}