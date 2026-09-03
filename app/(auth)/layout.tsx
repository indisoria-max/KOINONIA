export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden" style={{background: '#1B3A6B'}}>
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
          <div className="absolute top-10 left-10 text-[200px] font-serif leading-none text-white">✝</div>
          <div className="absolute bottom-10 right-10 text-[150px] font-serif leading-none text-white">✝</div>
        </div>
        <div className="relative text-center text-white">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{background: '#C9A227'}}>
            <span className="font-serif text-4xl font-bold text-white">K</span>
          </div>
          <h1 className="text-5xl font-serif font-bold mb-2">Koinonia</h1>
          <p className="text-lg mb-8" style={{color: '#94aed9'}}>κοινωνία</p>
          <div className="max-w-xs mx-auto space-y-4">
            {[
              { emoji: '🌍', text: 'Conecta con católicos de todo el mundo' },
              { emoji: '⛪', text: 'Encuentra iglesias y misas donde vayas' },
              { emoji: '🙏', text: 'Vive la fe más allá del turismo' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm" style={{color: '#bfcde9'}}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-8" style={{background: '#F5F0E8'}}>
        {children}
      </div>

    </div>
  )
}