import { Globe, Landmark, Heart } from 'lucide-react'

const FEATURES = [
  { Icon: Globe,    text: 'Conecta con católicos de todo el mundo' },
  { Icon: Landmark, text: 'Encuentra iglesias y misas donde vayas' },
  { Icon: Heart,    text: 'Vive la fe más allá del turismo' },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0C1828' }}>

      {/* Panel izquierdo — solo desktop */}
      <div style={{
        width: '45%', flexShrink: 0,
        background: 'linear-gradient(160deg, #080E18 0%, #0F2038 50%, #0C1828 100%)',
        borderRight: '1px solid rgba(201,162,39,0.12)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', position: 'relative', overflow: 'hidden',
      }}
      className="auth-left-panel"
      >
        {/* Glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(201,162,39,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Cruz decorativa */}
        <div style={{ marginBottom: '32px' }}>
          <svg width="36" height="46" viewBox="0 0 36 46" fill="none"
            style={{ filter: 'drop-shadow(0 0 20px rgba(201,162,39,0.7))' }}>
            <defs>
              <linearGradient id="authGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F0D070" />
                <stop offset="100%" stopColor="#B8901A" />
              </linearGradient>
            </defs>
            <rect x="13" y="0" width="10" height="46" rx="3" fill="url(#authGold)" />
            <rect x="0"  y="11" width="36" height="10" rx="3" fill="url(#authGold)" />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid rgba(201,162,39,0.4)', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 0 24px rgba(201,162,39,0.2)' }}>
          <img src="/icon-192.png" alt="Koinonia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 6px', textAlign: 'center' }}>
          Koinonia
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '14px', marginBottom: '36px', letterSpacing: '0.1em' }}>κοινωνία</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '280px' }}>
          {FEATURES.map(({ Icon, text }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color="#C9A227" />
              </div>
              <span style={{ fontSize: '14px', color: 'rgba(245,240,232,0.6)', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
        overflowY: 'auto',
      }}>
        {children}
      </div>

    </div>
  )
}