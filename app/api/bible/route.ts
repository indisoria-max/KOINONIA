import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const book = parseInt(searchParams.get('book') || '1')
  const chapter = parseInt(searchParams.get('chapter') || '1')

  try {
    const filePath = join(process.cwd(), 'public', 'bible-es.json')
    const bibleData = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (!Array.isArray(bibleData)) {
      return NextResponse.json({ error: 'Formato de Biblia inválido' }, { status: 500 })
    }

    const targetBook = bibleData.find((b: any) => b.number === book)
    if (!targetBook) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 440 })
    }

    const versesArray = targetBook.chapters?.[chapter - 1]
    if (!versesArray) {
      return NextResponse.json({ error: 'Capítulo no encontrado' }, { status: 404 })
    }

    const verses = versesArray.map((text: string, index: number) => ({
      verse: index + 1,
      text: text?.trim() || ''
    }))

    return NextResponse.json({
      book: targetBook.name,
      chapter,
      verses
    })
  } catch (e) {
    return NextResponse.json({ error: 'Error interno', detail: String(e) }, { status: 500 })
  }
}