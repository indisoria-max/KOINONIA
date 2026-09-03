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
  job: { name: 'Job', caps: 42 }, salmos: { name: 'Salmos', caps: 150 },
  proverbios: { name: 'Proverbios', caps: 31 }, eclesiastes: { name: 'Eclesiastés', caps: 12 },
  cantares: { name: 'Cantar de los Cantares', caps: 8 }, isaias: { name: 'Isaías', caps: 66 },
  jeremias: { name: 'Jeremías', caps: 52 }, lamentaciones: { name: 'Lamentaciones', caps: 5 },
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
  tobias: { name: 'Tobías', caps: 14 }, judit: { name: 'Judit', caps: 16 },
  '1macabeos': { name: '1 Macabeos', caps: 16 }, '2macabeos': { name: '2 Macabeos', caps: 15 },
  sabiduria: { name: 'Sabiduría', caps: 19 }, eclesiastico: { name: 'Eclesiástico', caps: 51 },
  baruc: { name: 'Baruc', caps: 6 }, ester: { name: 'Ester', caps: 10 },
}

const BOOK_NUM: Record<string, number> = {
  genesis: 1, exodo: 2, levitico: 3, numeros: 4, deuteronomio: 5,
  josue: 6, jueces: 7, rut: 8, '1samuel': 9, '2samuel': 10,
  '1reyes': 11, '2reyes': 12, '1cronicas': 13, '2cronicas': 14,
  esdras: 15, nehemias: 16, ester: 17, job: 18, salmos: 19,
  proverbios: 20, eclesiastes: 21, cantares: 22, isaias: 23,
  jeremias: 24, lamentaciones: 25, ezequiel: 26, daniel: 27,
  oseas: 28, joel: 29, amos: 30, abdias: 31, jonas: 32,
  miqueas: 33, nahum: 34, habacuc: 35, sofonias: 36, hageo: 37,
  zacarias: 38, malaquias: 39, mateo: 40, marcos: 41, lucas: 42,
  juan: 43, hechos: 44, romanos: 45, '1corintios': 46, '2corintios': 47,
  galatas: 48, efesios: 49, filipenses: 50, colosenses: 51,
  '1tesalonicenses': 52, '2tesalonicenses': 53, '1timoteo': 54,
  '2timoteo': 55, tito: 56, filemon: 57, hebreos: 58, santiago: 59,
  '1pedro': 60, '2pedro': 61, '1juan': 62, '2juan': 63, '3juan': 64,
  judas: 65, apocalipsis: 66,
}

const DEUTEROCANONICOS = ['tobias', 'judit', '1macabeos', '2macabeos', 'sabiduria', 'eclesiastico', 'baruc']

type Verse = { verse: number; text: string }

export default function CapituloPage() {
  const { libro, capitulo } = useParams<{ libro: string; capitulo: string }>()
  const router = useRouter()
  const [verses, setVerses]   = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  const info      = LIBROS[libro]
  const cap       = parseInt(capitulo)
  const bookNum   = BOOK_NUM[libro]
  const isDeutero = DEUTEROCANONICOS.includes(libro)

  useEffect(() => {
    if (isDeutero || !bookNum) { setError(true); setLoading(false); return }
    setLoading(true)
    setError(false)
    fetch(`/api/bible?book=${bookNum}&chapter=${cap}`)
      .then(r => r.json())
      .then(data => {
        if (!data.verses) { setError(true); return }
        setVerses(data.verses.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text,
        })))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [libro, capitulo])

  if (!info) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '140px',
    }}>

      {/* ── Header sticky ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(12,24,40,0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(201,162,39,0.12)',
        padding: '12px 16px 14px',
      }}>
        <Link href={`/biblia/${libro}`} style={{
          textDecoration: 'none', display: 'inline-flex',
          alignItems: 'center', gap: '4px',
          color: 'var(--muted)', marginBottom: '8px', fontSize: '13px',
        }}>
          <ChevronLeft size={15} />
          <span>{info.name}</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', fontWeight: '700',
              color: 'var(--text)', margin: 0,
            }}>
              {info.name}
            </h1>
            <p style={{ color: 'var(--gold)', fontSize: '12px', margin: '3px 0 0', fontWeight: '600', letterSpacing: '0.04em' }}>
              Capítulo {cap} · RVR1960
            </p>
          </div>
          <BookOpen size={22} color="rgba(201,162,39,0.4)" />
        </div>
      </div>

      {/* ── Contenido ── */}
      <div style={{ padding: '20px 16px' }}>

        {/* Cargando */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <BookOpen size={32} color="rgba(201,162,39,0.35)" style={{ marginBottom: '14px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>Cargando versículos...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(26,46,66,0.96), rgba(14,28,48,0.92))',
            borderRadius: '20px', padding: '32px 24px',
            textAlign: 'center',
            border: '1px solid rgba(201,162,39,0.2)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          }}>
            <BookOpen size={36} color="rgba(201,162,39,0.5)" style={{ marginBottom: '14px' }} />
            <p style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text)', fontWeight: '600',
              fontSize: '16px', margin: '0 0 8px',
            }}>
              {isDeutero ? 'Libro deuterocanónico' : 'No disponible'}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
              {isDeutero
                ? 'Este libro está en proceso de integración.'
                : 'No se pudo cargar. Revisa tu conexión.'}
            </p>
          </div>
        )}

        {/* Versículos */}
        {!loading && !error && verses.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(26,46,66,0.7), rgba(20,34,51,0.65))',
            borderRadius: '20px', padding: '20px',
            border: '1px solid rgba(201,162,39,0.15)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
          }}>
            {verses.map((v, i) => (
              <div key={v.verse} style={{
                display: 'flex', gap: '12px',
                marginBottom: i < verses.length - 1 ? '18px' : 0,
              }}>
                {/* Número versículo */}
                <span style={{
                  minWidth: '22px', height: '22px',
                  borderRadius: '6px',
                  background: 'rgba(201,162,39,0.15)',
                  border: '1px solid rgba(201,162,39,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: '700',
                  color: 'var(--gold)', flexShrink: 0, marginTop: '3px',
                }}>
                  {v.verse}
                </span>
                {/* Texto */}
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '15px', lineHeight: 1.85,
                  color: 'var(--text)', margin: 0,
                }}>
                  {v.text.trim()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Navegación anterior / siguiente ── */}
      <div style={{
        position: 'fixed', bottom: '60px', left: 0, right: 0,
        display: 'flex', gap: '10px', padding: '10px 16px',
        background: 'rgba(12,24,40,0.95)',
        backdropFilter: 'blur(14px)',
        borderTop: '1px solid rgba(201,162,39,0.12)',
      }}>
        {cap > 1 ? (
          <button
            onClick={() => router.push(`/biblia/${libro}/${cap - 1}`)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: 'rgba(26,46,66,0.8)',
              border: '1px solid rgba(201,162,39,0.2)',
              borderRadius: '12px', padding: '12px',
              cursor: 'pointer', color: 'var(--text)',
              fontWeight: '600', fontSize: '13px',
            }}>
            <ChevronLeft size={16} /> Anterior
          </button>
        ) : <div style={{ flex: 1 }} />}

        {cap < info.caps && (
          <button
            onClick={() => router.push(`/biblia/${libro}/${cap + 1}`)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: 'linear-gradient(135deg, rgba(201,162,39,0.25), rgba(201,162,39,0.15))',
              border: '1px solid rgba(201,162,39,0.35)',
              borderRadius: '12px', padding: '12px',
              cursor: 'pointer', color: 'var(--gold-light)',
              fontWeight: '600', fontSize: '13px',
            }}>
            Siguiente <ChevronRight size={16} />
          </button>
        )}
      </div>

    </div>
  )
}