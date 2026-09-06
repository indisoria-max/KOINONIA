'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'

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
  eclesiastes: { name: 'Eclesiastés', caps: 12 },
  cantares: { name: 'Cantar de los Cantares', caps: 8 },
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
  '1tesalonicenses': { name: '1 Tesalonicenses', caps: 5 },
  '2tesalonicenses': { name: '2 Tesalonicenses', caps: 3 },
  '1timoteo': { name: '1 Timoteo', caps: 6 }, '2timoteo': { name: '2 Timoteo', caps: 4 },
  tito: { name: 'Tito', caps: 3 }, filemon: { name: 'Filemón', caps: 1 },
  hebreos: { name: 'Hebreos', caps: 13 }, santiago: { name: 'Santiago', caps: 5 },
  '1pedro': { name: '1 Pedro', caps: 5 }, '2pedro': { name: '2 Pedro', caps: 3 },
  '1juan': { name: '1 Juan', caps: 5 }, '2juan': { name: '2 Juan', caps: 1 },
  '3juan': { name: '3 Juan', caps: 1 }, judas: { name: 'Judas', caps: 1 },
  apocalipsis: { name: 'Apocalipsis', caps: 22 },
}

type Verse = { verse: number; text: string }

export default function CapituloPage() {
  const { libro, capitulo } = useParams<{ libro: string; capitulo: string }>()
  const router = useRouter()
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeutero, setIsDeutero] = useState(false)
  const [error, setError] = useState(false)

  const info = LIBROS[libro]
  const cap = parseInt(capitulo)

  useEffect(() => {
    if (!info) { setError(true); setLoading(false); return }
    setLoading(true)
    setError(false)
    setIsDeutero(false)

    fetch(`/api/bible?slug=${libro}&chapter=${cap}`)
      .then(r => r.json())
      .then(data => {
        if (data.error === 'deuterocanonical') {
          setIsDeutero(true)
          return
        }
        if (!data.verses || data.verses.length === 0) {
          setError(true)
          return
        }
        setVerses(data.verses)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [libro, capitulo])

  if (!info) return null

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100%', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(10,16,25,0.98), rgba(15,26,46,0.95))',
        padding: '16px 16px 20px', position: 'sticky', top: 0, zIndex: 10,
        borderBottom: '1px solid var(--border2)', backdropFilter: 'blur(12px)',
      }}>
        <Link href={`/biblia/${libro}`} style={{
          textDecoration: 'none', display: 'flex', alignItems: 'center',
          gap: '6px', color: 'var(--muted)', marginBottom: '10px'
        }}>
          <ChevronLeft size={16} />
          <span style={{ fontSize: '13px' }}>{info.name}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              color: 'var(--text)', fontSize: '22px', fontWeight: 800, margin: 0,
              fontFamily: "'Playfair Display', serif"
            }}>{info.name}</h1>
            <p style={{ color: 'var(--gold)', fontSize: '12px', margin: '3px 0 0', fontWeight: 600 }}>
              Capítulo {cap} · RVR1960
            </p>
          </div>
          <BookOpen size={24} color="rgba(201,162,39,0.4)" />
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '20px 16px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <BookOpen size={32} color="var(--border)" style={{ marginBottom: '12px' }} />
            <p style={{ margin: 0 }}>Cargando versículos...</p>
          </div>
        )}

        {isDeutero && !loading && (
          <div style={{
            background: 'linear-gradient(135deg, var(--card), var(--surface))',
            borderRadius: '20px', padding: '32px 24px', textAlign: 'center',
            border: '1px solid var(--border)',
          }}>
            <BookOpen size={36} color="var(--gold)" style={{ marginBottom: '14px' }} />
            <p style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text)', fontWeight: 700, fontSize: '17px', margin: '0 0 8px'
            }}>
              Libro deuterocanónico
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
              {info.name} forma parte del canon católico completo.<br />
              Estamos trabajando para añadirlo próximamente.
            </p>
            <Link href={`/biblia/${libro}`} style={{
              display: 'inline-block', padding: '10px 24px',
              background: 'rgba(201,162,39,0.15)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: '12px', color: 'var(--gold)',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none'
            }}>
              Volver
            </Link>
          </div>
        )}

        {error && !loading && !isDeutero && (
          <div style={{
            background: 'var(--card)', borderRadius: '16px', padding: '28px',
            textAlign: 'center', border: '1px solid var(--border2)'
          }}>
            <p style={{ color: 'var(--text)', fontWeight: 700, margin: '0 0 6px' }}>No disponible</p>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
              No se pudo cargar este capítulo.
            </p>
          </div>
        )}

        {!loading && !error && !isDeutero && verses.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, var(--card), var(--surface))',
            borderRadius: '20px', padding: '20px',
            border: '1px solid var(--border2)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
          }}>
            {verses.map(v => (
              <div key={v.verse} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <span style={{
                  minWidth: '26px', height: '26px', borderRadius: '6px',
                  background: 'rgba(201,162,39,0.12)',
                  border: '1px solid rgba(201,162,39,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: 'var(--gold)',
                  flexShrink: 0, marginTop: '4px'
                }}>{v.verse}</span>
                <p style={{
                  fontSize: '15px', lineHeight: 1.85,
                  color: 'var(--text)', margin: 0,
                  fontFamily: "'Playfair Display', serif"
                }}>{v.text}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Navegación */}
      <div style={{
        position: 'fixed', bottom: '64px', left: 0, right: 0,
        display: 'flex', gap: '10px', padding: '10px 16px',
        background: 'rgba(10,16,25,0.97)', backdropFilter: 'blur(8px)',
        borderTop: '1px solid var(--border2)'
      }}>
        {cap > 1 && (
          <button onClick={() => router.push(`/biblia/${libro}/${cap - 1}`)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', background: 'var(--card)',
            border: '1px solid var(--border2)', borderRadius: '12px',
            padding: '12px', cursor: 'pointer',
            color: 'var(--text)', fontWeight: 600, fontSize: '13px'
          }}>
            <ChevronLeft size={16} /> Anterior
          </button>
        )}
        {cap < info.caps && (
          <button onClick={() => router.push(`/biblia/${libro}/${cap + 1}`)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, rgba(201,162,39,0.25), rgba(201,162,39,0.15))',
            border: '1px solid rgba(201,162,39,0.3)', borderRadius: '12px',
            padding: '12px', cursor: 'pointer',
            color: 'var(--gold)', fontWeight: 600, fontSize: '13px'
          }}>
            Siguiente <ChevronRight size={16} />
          </button>
        )}
      </div>

    </div>
  )
}