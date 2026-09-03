'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

const LIBROS: Record<string, { name: string; caps: number }> = {
  genesis: { name: 'Génesis', caps: 50 }, exodo: { name: 'Éxodo', caps: 40 },
  levitico: { name: 'Levítico', caps: 27 }, numeros: { name: 'Números', caps: 36 },
  deuteronomio: { name: 'Deuteronomio', caps: 34 }, josue: { name: 'Josué', caps: 24 },
  jueces: { name: 'Jueces', caps: 21 }, rut: { name: 'Rut', caps: 4 },
  '1samuel': { name: '1 Samuel', caps: 31 }, '2samuel': { name: '2 Samuel', caps: 24 },
  '1reyes': { name: '1 Reyes', caps: 22 }, '2reyes': { name: '2 Reyes', caps: 25 },
  '1cronicas': { name: '1 Crónicas', caps: 29 }, '2cronicas': { name: '2 Crónicas', caps: 36 },
  esdras: { name: 'Esdras', caps: 10 }, nehemias: { name: 'Nehemías', caps: 13 },
  tobias: { name: 'Tobías', caps: 14 }, judit: { name: 'Judit', caps: 16 },
  ester: { name: 'Ester', caps: 10 }, '1macabeos': { name: '1 Macabeos', caps: 16 },
  '2macabeos': { name: '2 Macabeos', caps: 15 }, job: { name: 'Job', caps: 42 },
  salmos: { name: 'Salmos', caps: 150 }, proverbios: { name: 'Proverbios', caps: 31 },
  eclesiastes: { name: 'Eclesiastés', caps: 12 }, cantares: { name: 'Cantar de los Cantares', caps: 8 },
  sabiduria: { name: 'Sabiduría', caps: 19 }, eclesiastico: { name: 'Eclesiástico', caps: 51 },
  isaias: { name: 'Isaías', caps: 66 }, jeremias: { name: 'Jeremías', caps: 52 },
  lamentaciones: { name: 'Lamentaciones', caps: 5 }, baruc: { name: 'Baruc', caps: 6 },
  ezequiel: { name: 'Ezequiel', caps: 48 }, daniel: { name: 'Daniel', caps: 14 },
  oseas: { name: 'Oseas', caps: 14 }, joel: { name: 'Joel', caps: 4 },
  amos: { name: 'Amós', caps: 9 }, abdias: { name: 'Abdías', caps: 1 },
  jonas: { name: 'Jonás', caps: 4 }, miqueas: { name: 'Miqueas', caps: 7 },
  nahum: { name: 'Nahúm', caps: 3 }, habacuc: { name: 'Habacuc', caps: 3 },
  sofonias: { name: 'Sofonías', caps: 3 }, hageo: { name: 'Hageo', caps: 2 },
  zacarias: { name: 'Zacarías', caps: 14 }, malaquias: { name: 'Malaquías', caps: 4 },
  mateo: { name: 'Mateo', caps: 28 }, marcos: { name: 'Marcos', caps: 16 },
  lucas: { name: 'Lucas', caps: 24 }, juan: { name: 'Juan', caps: 21 },
  hechos: { name: 'Hechos', caps: 28 }, romanos: { name: 'Romanos', caps: 16 },
  '1corintios': { name: '1 Corintios', caps: 16 }, '2corintios': { name: '2 Corintios', caps: 13 },
  galatas: { name: 'Gálatas', caps: 6 }, efesios: { name: 'Efesios', caps: 6 },
  filipenses: { name: 'Filipenses', caps: 4 }, colosenses: { name: 'Colosenses', caps: 4 },
  '1tesalonicenses': { name: '1 Tesalonicenses', caps: 5 }, '2tesalonicenses': { name: '2 Tesalonicenses', caps: 3 },
  '1timoteo': { name: '1 Timoteo', caps: 6 }, '2timoteo': { name: '2 Timoteo', caps: 4 },
  tito: { name: 'Tito', caps: 3 }, filemon: { name: 'Filemón', caps: 1 },
  hebreos: { name: 'Hebreos', caps: 13 }, santiago: { name: 'Santiago', caps: 5 },
  '1pedro': { name: '1 Pedro', caps: 5 }, '2pedro': { name: '2 Pedro', caps: 3 },
  '1juan': { name: '1 Juan', caps: 5 }, '2juan': { name: '2 Juan', caps: 1 },
  '3juan': { name: '3 Juan', caps: 1 }, judas: { name: 'Judas', caps: 1 },
  apocalipsis: { name: 'Apocalipsis', caps: 22 },
}

export default function LibroPage() {
  const { libro } = useParams<{ libro: string }>()
  const info = LIBROS[libro]

  if (!info) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
    }}>
      <p style={{ color: 'var(--muted)' }}>Libro no encontrado</p>
      <Link href="/biblia" style={{ color: 'var(--gold)', fontSize: '14px' }}>← Volver</Link>
    </div>
  )

  const capitulos = Array.from({ length: info.caps }, (_, i) => i + 1)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '100px',
    }}>

      {/* Header */}
      <div style={{
        padding: '56px 20px 28px',
        position: 'relative',
        borderBottom: '1px solid rgba(201,162,39,0.12)',
      }}>
        {/* Glow ambiental */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '140px',
          background: 'radial-gradient(ellipse at 30% 0%, rgba(201,162,39,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Botón volver */}
        <Link href="/biblia" style={{
          textDecoration: 'none', display: 'inline-flex',
          alignItems: 'center', gap: '4px',
          color: 'var(--muted)', marginBottom: '16px',
          fontSize: '13px',
        }}>
          <ChevronLeft size={16} />
          <span>La Biblia</span>
        </Link>

        {/* Título */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px', fontWeight: '700',
          color: 'var(--text)', margin: '0 0 6px', lineHeight: 1.1,
        }}>
          {info.name}
        </h1>
        <p style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '600', margin: 0, letterSpacing: '0.05em' }}>
          {info.caps} capítulos
        </p>
      </div>

      {/* Grid de capítulos */}
      <div style={{ padding: '24px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}>
          {capitulos.map(n => (
            <Link key={n} href={`/biblia/${libro}/${n}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(26,46,66,0.9), rgba(20,34,51,0.8))',
                borderRadius: '12px',
                height: '52px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '600', fontSize: '16px',
                color: 'var(--text)',
                border: '1px solid rgba(201,162,39,0.15)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}>
                {n}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}