import Link from 'next/link'
import { Shield, Star, Globe, Users, ArrowRight, Heart, Map, MessageCircle, User, Building2, Pencil, Video, Mail, Navigation, Landmark, Clock, Flame, BookOpen, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import DonationForm from '@/components/DonationForm'

export const revalidate = 60 // refresca stats cada 60 segundos

export default async function HomePage() {
  const supabase = await createClient()

  const [{ count: churchCount }, { count: userCount }, { count: postCount }] = await Promise.all([
    supabase.from('churches').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { v: `${churchCount ?? 0}`, l: 'Iglesias mapeadas' },
    { v: `${userCount ?? 0}+`,  l: 'Peregrinos registrados' },
    { v: `${postCount ?? 0}+`,  l: 'Reflexiones compartidas' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0C1828', color: '#F5F0E8', fontFamily: "'Inter', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(12,24,40,0.9)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(201,162,39,0.12)', padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #1A2E44, #142233)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", color: '#C9A227', fontWeight: '700', fontSize: '18px' }}>K</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: '#F5F0E8' }}>Koinonia</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/login" style={{ color: 'rgba(245,240,232,0.7)', fontSize: '14px', fontWeight: '500', textDecoration: 'none', padding: '8px 14px' }}>Entrar</Link>
          <Link href="/register" style={{ background: 'linear-gradient(135deg, #C9A227, #B8901A)', color: '#0C1828', fontSize: '14px', fontWeight: '700', padding: '9px 18px', borderRadius: '12px', textDecoration: 'none' }}>Unirse gratis</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.2) saturate(0.6)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,14,24,0.7) 0%, rgba(12,24,40,0.85) 100%)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,162,39,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '860px', margin: '0 auto', padding: '100px 24px 60px', textAlign: 'center', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.28)', borderRadius: '9999px', padding: '8px 18px', marginBottom: '32px' }}>
            <Heart size={14} color="#E8C55A" />
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#E8C55A' }}>La comunidad católica española para viajeros de fe</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="30" height="38" viewBox="0 0 30 38" fill="none" style={{ filter: 'drop-shadow(0 0 18px rgba(201,162,39,0.85))' }}>
              <defs>
                <linearGradient id="heroGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F0D070" />
                  <stop offset="100%" stopColor="#B8901A" />
                </linearGradient>
              </defs>
              <rect x="11" y="0" width="8" height="38" rx="2.5" fill="url(#heroGold)" />
              <rect x="0" y="9" width="30" height="8" rx="2.5" fill="url(#heroGold)" />
            </svg>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: '700', lineHeight: 1.1, marginBottom: '24px', color: '#F5F0E8' }}>
            Viaja en <span style={{ color: '#E8C55A' }}>comunión</span> de fe
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', lineHeight: 1.7, color: 'rgba(245,240,232,0.75)', maxWidth: '680px', margin: '0 auto 14px' }}>
            Conecta con católicos, encuentra iglesias en España y comparte tu fe en comunidad.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(245,240,232,0.5)', maxWidth: '560px', margin: '0 auto 48px' }}>
            Mapa de iglesias, horarios de misas, adoración, confesiones y mucho más — todo en tu bolsillo.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
            <Link href="/register?rol=peregrino" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #C9A227, #B8901A)', color: '#0C1828', fontWeight: '700', fontSize: '16px', padding: '14px 28px', borderRadius: '16px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(201,162,39,0.3)' }}>
              <Navigation size={18} /> Soy Peregrino <ArrowRight size={18} />
            </Link>
            <Link href="/register?rol=anfitrion" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.2)', color: '#F5F0E8', fontWeight: '700', fontSize: '16px', padding: '14px 28px', borderRadius: '16px', textDecoration: 'none' }}>
              <Building2 size={18} /> Soy Anfitrión <Heart size={18} />
            </Link>
          </div>

          {/* Stats reales de la DB */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '520px', margin: '0 auto', paddingTop: '40px', borderTop: '1px solid rgba(245,240,232,0.1)' }}>
            {stats.map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '700', color: '#E8C55A' }}>{s.v}</div>
                <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', marginTop: '4px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(170deg, #0C1828, #102038)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '700', color: '#F5F0E8', marginBottom: '12px' }}>¿Cómo funciona?</h2>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>Empieza en segundos y descubre todo lo que Koinonia tiene para ti.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

            <div style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.8), rgba(20,34,51,0.75))', borderRadius: '24px', padding: '28px', border: '1px solid rgba(201,162,39,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Navigation size={22} color="#C9A227" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: '#F5F0E8', margin: 0 }}>Para Peregrinos</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.45)', margin: '2px 0 0' }}>Los que viajan</p>
                </div>
              </div>
              {[
                { n: '1', Icon: User,          t: 'Crea tu perfil',        d: 'Regístrate en segundos' },
                { n: '2', Icon: Map,           t: 'Explora el mapa',       d: 'Encuentra iglesias cercanas' },
                { n: '3', Icon: MessageCircle, t: 'Únete a la comunidad',  d: 'Comparte reflexiones y oraciones' },
                { n: '4', Icon: BookOpen,      t: 'Lee la Biblia',         d: 'RVR1960 completa en tu idioma' },
              ].map(({ n, Icon, t, d }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#E8C55A', flexShrink: 0 }}>{n}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#F5F0E8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={13} color="rgba(201,162,39,0.7)" /> {t}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(245,240,232,0.5)' }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.12), rgba(201,162,39,0.05))', borderRadius: '24px', padding: '28px', border: '1px solid rgba(201,162,39,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={22} color="#C9A227" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: '#F5F0E8', margin: 0 }}>Para Anfitriones</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.45)', margin: '2px 0 0' }}>Los que acogen</p>
                </div>
              </div>
              {[
                { n: '1', Icon: Pencil,        t: 'Crea tu perfil',        d: 'Comparte quién eres' },
                { n: '2', Icon: MessageCircle, t: 'Participa',             d: 'Comparte en la comunidad' },
                { n: '3', Icon: Mail,          t: 'Recibe peregrinos',     d: 'Conéctate con viajeros de fe' },
                { n: '4', Icon: Heart,         t: 'Anuncia tu negocio',    d: 'En Partners con valores católicos' },
              ].map(({ n, Icon, t, d }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#C9A227', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#0C1828', flexShrink: 0 }}>{n}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#F5F0E8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={13} color="rgba(201,162,39,0.7)" /> {t}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(245,240,232,0.5)' }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS ESPIRITUALES */}
      <section style={{ padding: '80px 24px', background: '#0B1820' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '700', color: '#F5F0E8', marginBottom: '12px' }}>Todo para tu vida espiritual</h2>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>Herramientas reales para alimentar tu fe cada día.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {[
              { Icon: Landmark,      t: 'Mapa de Iglesias',      d: 'Más de 80 iglesias católicas en España con GPS' },
              { Icon: Clock,         t: 'Horarios de Misas',     d: 'Consulta los horarios actualizados de cada parroquia' },
              { Icon: Flame,         t: 'Adoración Perpetua',    d: 'Capillas con adoración al Santísimo localizadas' },
              { Icon: Shield,        t: 'Confesiones',           d: 'Horarios de confesión en cada parroquia' },
              { Icon: BookOpen,      t: 'La Biblia Completa',    d: 'Reina-Valera 1960 — 66 libros en tu bolsillo' },
              { Icon: Users,         t: 'Comunidad de Fe',       d: 'Comparte reflexiones, oraciones y testimonios' },
            ].map(({ Icon, t, d }, i) => (
              <div key={i} style={{ background: 'linear-gradient(135deg, rgba(26,46,66,0.7), rgba(20,34,51,0.65))', borderRadius: '18px', padding: '22px', border: '1px solid rgba(201,162,39,0.12)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={20} color="#C9A227" />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F5F0E8', marginBottom: '6px' }}>{t}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.5)', lineHeight: 1.6, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(170deg, #0C1828, #102038)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,162,39,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Heart size={32} color="#C9A227" />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '700', color: '#F5F0E8', marginBottom: '16px' }}>Empieza tu peregrinaje hoy</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.75, color: 'rgba(245,240,232,0.55)', maxWidth: '480px', margin: '0 auto 40px' }}>
            Únete a la comunidad de católicos que viajan y acogen en el nombre de la fe. Gratuito para siempre.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #C9A227, #B8901A)', color: '#0C1828', fontWeight: '700', fontSize: '16px', padding: '15px 32px', borderRadius: '16px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(201,162,39,0.3)' }}>
              Registrarme gratis
            </Link>
            <Link href="/mapa" style={{ display: 'inline-block', background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.15)', color: '#F5F0E8', fontWeight: '700', fontSize: '16px', padding: '15px 32px', borderRadius: '16px', textDecoration: 'none' }}>
              Explorar el mapa
            </Link>
          </div>
        </div>
      </section>

      {/* DONACIÓN */}
      <section id="donacion" style={{ padding: '80px 24px', background: '#080E18' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Heart size={28} color="#C9A227" />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', color: '#F5F0E8', marginBottom: '12px' }}>Apoya a Koinonia</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'rgba(245,240,232,0.55)', marginBottom: '36px', maxWidth: '440px', margin: '0 auto 36px' }}>
            Koinonia es gratuita para todos. Si quieres contribuir a mantener y crecer esta comunidad de fe, cualquier donación es bienvenida.
          </p>
          <DonationForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 24px', background: '#060A12', borderTop: '1px solid rgba(245,240,232,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #1A2E44, #142233)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", color: '#C9A227', fontWeight: '700' }}>K</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '700', color: '#F5F0E8' }}>Koinonia</span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.35)', textAlign: 'center', margin: 0, lineHeight: 1.7 }}>
            κοινωνία — Comunión · Fraternidad · Fe<br />
            © 2026 Koinonia. Hecho con fe
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacidad', 'Términos', 'Contacto'].map(l => (
              <a key={l} href="#" style={{ fontSize: '13px', color: 'rgba(245,240,232,0.35)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}