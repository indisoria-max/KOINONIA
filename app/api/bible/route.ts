import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const SLUG_TO_NAMES: Record<string, string[]> = {
  genesis: ['Génesis'], exodo: ['Éxodo'], levitico: ['Levítico'],
  numeros: ['Números'], deuteronomio: ['Deuteronomio'], josue: ['Josué'],
  jueces: ['Jueces'], rut: ['Rut'],
  '1samuel': ['1 Samuel'], '2samuel': ['2 Samuel'],
  '1reyes': ['1 Reyes'], '2reyes': ['2 Reyes'],
  '1cronicas': ['1 Crónicas'], '2cronicas': ['2 Crónicas'],
  esdras: ['Esdras'], nehemias: ['Nehemías'],
  ester: ['Ester'], job: ['Job'], salmos: ['Salmos'],
  proverbios: ['Proverbios'], eclesiastes: ['Eclesiastés'],
  cantares: ['Cantares', 'Cantar de los Cantares'],
  isaias: ['Isaías'], jeremias: ['Jeremías'], lamentaciones: ['Lamentaciones'],
  ezequiel: ['Ezequiel'], daniel: ['Daniel'], oseas: ['Oseas'],
  joel: ['Joel'], amos: ['Amós'], abdias: ['Abdías'], jonas: ['Jonás'],
  miqueas: ['Miqueas'], nahum: ['Nahúm'], habacuc: ['Habacuc'],
  sofonias: ['Sofonías'], hageo: ['Hageo'], zacarias: ['Zacarías'],
  malaquias: ['Malaquías'],
  // Evangelios — tu JSON usa "S. Mateo", "S.Juan" etc.
  mateo: ['S. Mateo', 'Mateo', 'San Mateo'],
  marcos: ['S. Marcos', 'Marcos', 'San Marcos'],
  lucas: ['S. Lucas', 'Lucas', 'San Lucas'],
  juan: ['S.Juan', 'S. Juan', 'Juan', 'San Juan'],
  // Resto NT
  hechos: ['Hechos', 'Hechos de los Apóstoles'],
  romanos: ['Romanos'],
  '1corintios': ['1 Corintios'], '2corintios': ['2 Corintios'],
  galatas: ['Gálatas'], efesios: ['Efesios'], filipenses: ['Filipenses'],
  colosenses: ['Colosenses'],
  '1tesalonicenses': ['1 Tesalonicenses'], '2tesalonicenses': ['2 Tesalonicenses'],
  '1timoteo': ['1 Timoteo'], '2timoteo': ['2 Timoteo'],
  tito: ['Tito'], filemon: ['Filemón'], hebreos: ['Hebreos'],
  santiago: ['Santiago'], '1pedro': ['1 Pedro'], '2pedro': ['2 Pedro'],
  '1juan': ['1 Juan'], '2juan': ['2 Juan'], '3juan': ['3 Juan'],
  judas: ['Judas'], apocalipsis: ['Apocalipsis'],
  // Deuterocanónicos (no están en este JSON, se muestra mensaje)
  tobias: ['Tobit', 'Tobías'], judit: ['Judit'],
  '1macabeos': ['1 Macabeos'], '2macabeos': ['2 Macabeos'],
  sabiduria: ['Sabiduría'], eclesiastico: ['Eclesiástico', 'Sirácida'],
  baruc: ['Baruc'],
}

let cachedBible: any[] | null = null

function getBible(): any[] {
  if (!cachedBible) {
    const filePath = join(process.cwd(), 'public', 'bible-es.json')
    cachedBible = JSON.parse(readFileSync(filePath, 'utf-8'))
  }
  return cachedBible!
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || ''
  const chapter = parseInt(searchParams.get('chapter') || '1')

  try {
    const bibleData = getBible()
    const possibleNames = SLUG_TO_NAMES[slug]

    if (!possibleNames) {
      return NextResponse.json({ error: 'Libro no reconocido' }, { status: 404 })
    }

    const targetBook = bibleData.find((b: any) => {
      const bookName = (b.name || b.book || '').trim()
      return possibleNames.some(n => bookName.toLowerCase() === n.toLowerCase())
    })

    if (!targetBook) {
      return NextResponse.json(
        { error: 'deuterocanonical', message: 'No disponible en esta versión' },
        { status: 404 }
      )
    }

    const versesArray = targetBook.chapters?.[chapter - 1]
    if (!versesArray) {
      return NextResponse.json({ error: 'Capítulo no encontrado' }, { status: 404 })
    }

    const verses = versesArray.map((v: any, index: number) => ({
      verse: index + 1,
      text: (typeof v === 'string' ? v : v.text || v.verse || '')?.trim() || ''
    }))

    return NextResponse.json({ book: targetBook.name || targetBook.book, chapter, verses })
  } catch (e) {
    return NextResponse.json({ error: 'Error interno', detail: String(e) }, { status: 500 })
  }
}