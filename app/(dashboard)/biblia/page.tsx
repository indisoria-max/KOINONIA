'use client'

import Link from 'next/link'
import { ChevronRight, BookOpen } from 'lucide-react'

const AT = [
  { slug: 'genesis',        name: 'Génesis',                caps: 50  },
  { slug: 'exodo',          name: 'Éxodo',                  caps: 40  },
  { slug: 'levitico',       name: 'Levítico',               caps: 27  },
  { slug: 'numeros',        name: 'Números',                caps: 36  },
  { slug: 'deuteronomio',   name: 'Deuteronomio',           caps: 34  },
  { slug: 'josue',          name: 'Josué',                  caps: 24  },
  { slug: 'jueces',         name: 'Jueces',                 caps: 21  },
  { slug: 'rut',            name: 'Rut',                    caps: 4   },
  { slug: '1samuel',        name: '1 Samuel',               caps: 31  },
  { slug: '2samuel',        name: '2 Samuel',               caps: 24  },
  { slug: '1reyes',         name: '1 Reyes',                caps: 22  },
  { slug: '2reyes',         name: '2 Reyes',                caps: 25  },
  { slug: '1cronicas',      name: '1 Crónicas',             caps: 29  },
  { slug: '2cronicas',      name: '2 Crónicas',             caps: 36  },
  { slug: 'esdras',         name: 'Esdras',                 caps: 10  },
  { slug: 'nehemias',       name: 'Nehemías',               caps: 13  },
  { slug: 'tobias',         name: 'Tobías',                 caps: 14  },
  { slug: 'judit',          name: 'Judit',                  caps: 16  },
  { slug: 'ester',          name: 'Ester',                  caps: 10  },
  { slug: '1macabeos',      name: '1 Macabeos',             caps: 16  },
  { slug: '2macabeos',      name: '2 Macabeos',             caps: 15  },
  { slug: 'job',            name: 'Job',                    caps: 42  },
  { slug: 'salmos',         name: 'Salmos',                 caps: 150 },
  { slug: 'proverbios',     name: 'Proverbios',             caps: 31  },
  { slug: 'eclesiastes',    name: 'Eclesiastés',            caps: 12  },
  { slug: 'cantares',       name: 'Cantar de los Cantares', caps: 8   },
  { slug: 'sabiduria',      name: 'Sabiduría',              caps: 19  },
  { slug: 'eclesiastico',   name: 'Eclesiástico',           caps: 51  },
  { slug: 'isaias',         name: 'Isaías',                 caps: 66  },
  { slug: 'jeremias',       name: 'Jeremías',               caps: 52  },
  { slug: 'lamentaciones',  name: 'Lamentaciones',          caps: 5   },
  { slug: 'baruc',          name: 'Baruc',                  caps: 6   },
  { slug: 'ezequiel',       name: 'Ezequiel',               caps: 48  },
  { slug: 'daniel',         name: 'Daniel',                 caps: 14  },
  { slug: 'oseas',          name: 'Oseas',                  caps: 14  },
  { slug: 'joel',           name: 'Joel',                   caps: 4   },
  { slug: 'amos',           name: 'Amós',                   caps: 9   },
  { slug: 'abdias',         name: 'Abdías',                 caps: 1   },
  { slug: 'jonas',          name: 'Jonás',                  caps: 4   },
  { slug: 'miqueas',        name: 'Miqueas',                caps: 7   },
  { slug: 'nahum',          name: 'Nahúm',                  caps: 3   },
  { slug: 'habacuc',        name: 'Habacuc',                caps: 3   },
  { slug: 'sofonias',       name: 'Sofonías',               caps: 3   },
  { slug: 'hageo',          name: 'Hageo',                  caps: 2   },
  { slug: 'zacarias',       name: 'Zacarías',               caps: 14  },
  { slug: 'malaquias',      name: 'Malaquías',              caps: 4   },
]

const NT = [
  { slug: 'mateo',           name: 'Mateo',            caps: 28 },
  { slug: 'marcos',          name: 'Marcos',           caps: 16 },
  { slug: 'lucas',           name: 'Lucas',            caps: 24 },
  { slug: 'juan',            name: 'Juan',             caps: 21 },
  { slug: 'hechos',          name: 'Hechos',           caps: 28 },
  { slug: 'romanos',         name: 'Romanos',          caps: 16 },
  { slug: '1corintios',      name: '1 Corintios',      caps: 16 },
  { slug: '2corintios',      name: '2 Corintios',      caps: 13 },
  { slug: 'galatas',         name: 'Gálatas',          caps: 6  },
  { slug: 'efesios',         name: 'Efesios',          caps: 6  },
  { slug: 'filipenses',      name: 'Filipenses',       caps: 4  },
  { slug: 'colosenses',      name: 'Colosenses',       caps: 4  },
  { slug: '1tesalonicenses', name: '1 Tesalonicenses', caps: 5  },
  { slug: '2tesalonicenses', name: '2 Tesalonicenses', caps: 3  },
  { slug: '1timoteo',        name: '1 Timoteo',        caps: 6  },
  { slug: '2timoteo',        name: '2 Timoteo',        caps: 4  },
  { slug: 'tito',            name: 'Tito',             caps: 3  },
  { slug: 'filemon',         name: 'Filemón',          caps: 1  },
  { slug: 'hebreos',         name: 'Hebreos',          caps: 13 },
  { slug: 'santiago',        name: 'Santiago',         caps: 5  },
  { slug: '1pedro',          name: '1 Pedro',          caps: 5  },
  { slug: '2pedro',          name: '2 Pedro',          caps: 3  },
  { slug: '1juan',           name: '1 Juan',           caps: 5  },
  { slug: '2juan',           name: '2 Juan',           caps: 1  },
  { slug: '3juan',           name: '3 Juan',           caps: 1  },
  { slug: 'judas',           name: 'Judas',            caps: 1  },
  { slug: 'apocalipsis',     name: 'Apocalipsis',      caps: 22 },
]

function LibroItem({ libro, isLast }: { libro: typeof AT[0]; isLast: boolean }) {
  return (
    <Link href={`/biblia/${libro.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px',
        borderBottom: isLast ? 'none' : '1px solid rgba(245,240,232,0.06)',
        transition: 'background 0.15s',
      }}>
        <div>
          <p style={{ margin: 0, fontWeight: 500, fontSize: '14px', color: 'var(--text)' }}>
            {libro.name}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--muted)' }}>
            {libro.caps} capítulos
          </p>
        </div>
        <ChevronRight size={16} color="rgba(201,162,39,0.45)" />
      </div>
    </Link>
  )
}

function Seccion({ titulo, libros }: { titulo: string; libros: typeof AT }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Cabecera */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(201,162,39,0.18), rgba(201,162,39,0.04))',
        borderRadius: '16px 16px 0 0',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
        border: '1px solid rgba(201,162,39,0.2)',
        borderBottom: 'none',
      }}>
        <div style={{ width: '2px', height: '16px', background: 'var(--gold)', borderRadius: '1px' }} />
        <p style={{
          fontFamily: "'Playfair Display', serif",
          color: 'var(--text)', fontWeight: '600', fontSize: '15px', margin: 0,
        }}>
          {titulo}
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '11px', margin: '0 0 0 auto' }}>
          {libros.length} libros
        </p>
      </div>

      {/* Lista */}
      <div style={{
        background: 'rgba(20,34,51,0.7)',
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
        border: '1px solid rgba(201,162,39,0.15)',
        borderTop: 'none',
        backdropFilter: 'blur(8px)',
      }}>
        {libros.map((l, i) => (
          <LibroItem key={l.slug} libro={l} isLast={i === libros.length - 1} />
        ))}
      </div>
    </div>
  )
}

export default function BibliaPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #0C1828 0%, #102038 45%, #0B1820 100%)',
      color: 'var(--text)',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '100px',
    }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.38) saturate(0.7)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(170deg, rgba(12,24,40,0.3) 0%, rgba(12,24,40,0.92) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          padding: '20px 20px 24px',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <BookOpen
            size={30} color="var(--gold)"
            style={{ filter: 'drop-shadow(0 0 10px rgba(201,162,39,0.6))' }}
          />
          <div>
            <p style={{
              color: 'var(--gold)', fontSize: '10px',
              letterSpacing: '0.28em', textTransform: 'uppercase',
              fontWeight: 600, margin: 0,
            }}>
              Sagradas Escrituras
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text)', fontSize: '24px',
              fontWeight: '700', margin: '4px 0 0',
            }}>
              La Biblia Católica
            </h1>
          </div>
        </div>
      </div>

      {/* Listas */}
      <div style={{ padding: '20px 16px 0' }}>
        <Seccion titulo="Antiguo Testamento" libros={AT} />
        <Seccion titulo="Nuevo Testamento"   libros={NT} />
      </div>

    </div>
  )
}