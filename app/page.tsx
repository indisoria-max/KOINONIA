import Link from "next/link";
import { Shield, Star, Globe, Users, ArrowRight, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-navy-800 rounded-full flex items-center justify-center shadow-md">
                <span className="text-gold-400 font-serif text-lg font-bold">K</span>
              </div>
              <span className="font-serif text-xl font-bold text-navy-800">Koinonia</span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-2">κοινωνία</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-gray-600 hover:text-navy-800 transition-colors text-sm font-medium">Cómo funciona</a>
              <a href="#espiritual" className="text-gray-600 hover:text-navy-800 transition-colors text-sm font-medium">Recursos espirituales</a>
              <a href="#seguridad" className="text-gray-600 hover:text-navy-800 transition-colors text-sm font-medium">Seguridad</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-navy-800 font-semibold text-sm hover:text-navy-600 transition-colors hidden sm:block">
                Entrar
              </Link>
              <Link href="/register" className="bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow-md">
                Unirse gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-20 min-h-screen flex items-center relative overflow-hidden" style={{background: 'linear-gradient(135deg, #162d53 0%, #1B3A6B 50%, #162d53 100%)'}}>
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
          <div className="absolute top-20 left-16 text-[200px] font-serif leading-none text-white">✝</div>
          <div className="absolute bottom-20 right-16 text-[200px] font-serif leading-none text-white">✝</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 border" style={{background: 'rgba(201,162,39,0.2)', borderColor: 'rgba(201,162,39,0.3)'}}>
              <span className="text-sm font-medium" style={{color: '#e5b43f'}}>🙏 La comunidad católica global para viajeros de fe</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold leading-tight mb-6 text-white">
              Viaja en <span style={{color: '#e5b43f'}}>comunión</span> de fe
            </h1>
            <p className="text-xl md:text-2xl mb-4 leading-relaxed max-w-3xl mx-auto" style={{color: '#bfcde9'}}>
              Conecta con católicos locales que te mostrarán su ciudad desde el corazón — más allá del turismo.
            </p>
            <p className="text-base mb-12 max-w-2xl mx-auto" style={{color: '#94aed9'}}>
              Encuentra iglesias, horarios de misas, capillas de adoración y mucho más — en cualquier lugar del mundo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/register?rol=peregrino" className="w-full sm:w-auto text-white font-bold text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg" style={{background: '#C9A227'}}>
                🎒 Soy Peregrino <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register?rol=anfitrion" className="w-full sm:w-auto font-bold text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border text-white" style={{background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)'}}>
                🏠 Soy Anfitrión <Heart className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-10 border-t max-w-2xl mx-auto" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
              {[
                { valor: "+10k", etiqueta: "Iglesias mapeadas" },
                { valor: "50+", etiqueta: "Países" },
                { valor: "100%", etiqueta: "Gratuito" },
              ].map((stat) => (
                <div key={stat.valor} className="text-center">
                  <div className="text-3xl font-serif font-bold" style={{color: '#e5b43f'}}>{stat.valor}</div>
                  <div className="text-sm mt-1" style={{color: '#94aed9'}}>{stat.etiqueta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-24" style={{background: '#F5F0E8'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{color: '#1B3A6B'}}>¿Cómo funciona?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">En pocos pasos vivirás una experiencia única de fe y hermandad.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{background: '#f9f0d0'}}>🎒</div>
                <div>
                  <h3 className="text-2xl font-serif font-bold" style={{color: '#1B3A6B'}}>Para Peregrinos</h3>
                  <p className="text-sm text-gray-500">Los que viajan</p>
                </div>
              </div>
              <div className="space-y-5">
                {[
                  { n: "1", emoji: "🌍", title: "Elige tu destino", desc: "Escribe la ciudad que vas a visitar" },
                  { n: "2", emoji: "👤", title: "Elige tu anfitrión", desc: "Explora perfiles con vídeo de presentación" },
                  { n: "3", emoji: "💬", title: "Conéctate", desc: "Chatea o haz una videollamada para conocerle" },
                  { n: "4", emoji: "🏙️", title: "Vive la ciudad", desc: "Descubre los rincones que solo conocen los locales" },
                ].map((paso) => (
                  <div key={paso.n} className="flex items-start gap-4">
                    <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background: '#1B3A6B'}}>{paso.n}</div>
                    <div>
                      <p className="font-semibold text-gray-800">{paso.emoji} {paso.title}</p>
                      <p className="text-gray-500 text-sm">{paso.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl p-8 text-white shadow-md" style={{background: '#1B3A6B'}}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{background: 'rgba(255,255,255,0.1)'}}>🏠</div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">Para Anfitriones</h3>
                  <p className="text-sm" style={{color: '#bfcde9'}}>Los que acogen</p>
                </div>
              </div>
              <div className="space-y-5">
                {[
                  { n: "1", emoji: "✍️", title: "Crea tu perfil", desc: "Comparte quién eres y lo que puedes ofrecer" },
                  { n: "2", emoji: "🎥", title: "Graba tu vídeo", desc: "Preséntate para que los peregrinos te conozcan" },
                  { n: "3", emoji: "📩", title: "Recibe solicitudes", desc: "Los peregrinos interesados te contactarán" },
                  { n: "4", emoji: "❤️", title: "Comparte tu fe", desc: "Muéstrales tu ciudad con ojos de fe y amor" },
                ].map((paso) => (
                  <div key={paso.n} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background: '#C9A227', color: '#1B3A6B'}}>{paso.n}</div>
                    <div>
                      <p className="font-semibold text-white">{paso.emoji} {paso.title}</p>
                      <p className="text-sm" style={{color: '#bfcde9'}}>{paso.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS ESPIRITUALES */}
      <section id="espiritual" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{color: '#1B3A6B'}}>Tu guía espiritual completa</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Todo lo que necesitas para alimentar tu fe mientras viajas.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "⛪", title: "Mapa de Iglesias", desc: "Encuentra todas las iglesias católicas cerca de ti con un solo toque", bg: "#eff6ff", border: "#bfcde9" },
              { emoji: "🕐", title: "Horarios de Misas", desc: "Consulta los horarios de misas actualizados para no perderte ninguna", bg: "#fdf9ed", border: "#eccb6a" },
              { emoji: "🕯️", title: "Adoración Perpetua", desc: "Localiza las capillas donde puedes estar ante el Señor 24h", bg: "#faf5ff", border: "#d8b4fe" },
              { emoji: "🙏", title: "Confesiones", desc: "Horarios de confesión en cada parroquia para no perderte este sacramento", bg: "#f0fdf4", border: "#86efac" },
              { emoji: "🏛️", title: "Santuarios y Retiros", desc: "Descubre santuarios, monasterios y lugares de peregrinación locales", bg: "#fff1f2", border: "#fda4af" },
              { emoji: "👥", title: "Grupos de Oración", desc: "Conéctate con grupos de oración locales durante tu visita", bg: "#eef2ff", border: "#a5b4fc" },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl p-6 border-2 hover:shadow-md transition-all" style={{background: f.bg, borderColor: f.border}}>
                <div className="text-4xl mb-4">{f.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section id="seguridad" className="py-24" style={{background: '#F5F0E8'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6" style={{color: '#1B3A6B'}}>Tu seguridad es nuestra prioridad</h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">Nuestro sistema de verificación por niveles te da la confianza necesaria para conectar con desconocidos.</p>
              <div className="space-y-5">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: "Perfiles verificados", desc: "Verificación de identidad y comunidad parroquial en 4 niveles" },
                  { icon: <Star className="w-5 h-5" />, title: "Sistema de reseñas", desc: "Lee las experiencias de otros antes de conectar con alguien" },
                  { icon: <Globe className="w-5 h-5" />, title: "Moderación activa", desc: "Equipo dedicado a mantener la comunidad segura y respetuosa" },
                  { icon: <Users className="w-5 h-5" />, title: "Menores protegidos", desc: "Las familias con menores tienen protecciones adicionales" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-yellow-400" style={{background: '#1B3A6B'}}>{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 rounded-3xl p-8 text-white shadow-xl w-full max-w-md" style={{background: '#1B3A6B'}}>
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">🛡️</div>
                <h3 className="text-2xl font-serif font-bold">Niveles de verificación</h3>
                <p className="text-sm mt-2" style={{color: '#94aed9'}}>Cuanto mayor el nivel, más confianza</p>
              </div>
              <div className="space-y-3">
                {[
                  { nivel: 1, texto: "Email verificado", color: "#60a5fa" },
                  { nivel: 2, texto: "Teléfono verificado", color: "#4ade80" },
                  { nivel: 3, texto: "Documento de identidad", color: "#C9A227" },
                  { nivel: 4, texto: "Verificación parroquial", color: "#c084fc" },
                ].map((v) => (
                  <div key={v.nivel} className="flex items-center gap-3 rounded-xl px-4 py-3 border" style={{background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.05)'}}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0" style={{background: v.color, color: '#1B3A6B'}}>{v.nivel}</div>
                    <span className="text-sm flex-1">{v.texto}</span>
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl p-4 text-center border" style={{background: 'rgba(201,162,39,0.2)', borderColor: 'rgba(201,162,39,0.3)'}}>
                <p className="text-sm" style={{color: '#e5b43f'}}>🏆 Los anfitriones con Nivel 4 tienen el sello <strong>«Verificado Koinonia»</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 text-white text-center" style={{background: 'linear-gradient(135deg, #162d53 0%, #1B3A6B 100%)'}}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-6xl mb-6">🙏</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Empieza tu peregrinaje hoy</h2>
          <p className="text-lg mb-12 leading-relaxed" style={{color: '#bfcde9'}}>Únete a la comunidad de católicos que viajan y acogen en el nombre de la fe. Gratuito para siempre en su esencia.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all shadow-lg" style={{background: '#C9A227'}}>
              Registrarme gratis
            </Link>
            <Link href="/mapa" className="font-bold text-lg px-10 py-4 rounded-2xl transition-all border text-white" style={{background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)'}}>
              Explorar el mapa
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12" style={{background: '#0a0f1a'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: '#1B3A6B'}}>
                <span className="font-serif font-bold text-sm" style={{color: '#C9A227'}}>K</span>
              </div>
              <span className="font-serif font-bold text-lg text-white">Koinonia</span>
            </div>
            <div className="text-sm text-center leading-loose text-gray-400">
              <p className="text-gray-300">κοινωνία — Comunión · Fraternidad · Fe</p>
              <p>© 2026 Koinonia. Hecho con ❤️ y ✝️</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}