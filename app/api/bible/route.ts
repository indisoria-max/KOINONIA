import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookNum = parseInt(searchParams.get('book') || '1')
  const chapterNum = parseInt(searchParams.get('chapter') || '1')

  try {
    const filePath = join(process.cwd(), 'public', 'bible-es.json')
    const bibleData = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (!Array.isArray(bibleData)) {
      return NextResponse.json({ error: 'Formato de Biblia inválido' }, { status: 500 })
    }

    // Los libros están en orden de 0 a 65
    const targetBook = bibleData[bookNum - 1] || bibleData.find((b: any) => b.number === bookNum)
    if (!targetBook) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 })
    }

    const versesArray = targetBook.chapters?.[chapterNum - 1]
    if (!versesArray) {
      return NextResponse.json({ error: 'Capítulo no encontrado' }, { status: 404 })
    }

    const verses = versesArray.map((text: string, index: number) => ({
      verse: index + 1,
      text: typeof text === 'string' ? text.trim() : (text as any)?.text || ''
    }))

    return NextResponse.json({
      book: targetBook.name,
      chapter: chapterNum,
      verses
    })
  } catch (e) {
    return NextResponse.json({ error: 'Error interno', detail: String(e) }, { status: 500 })
  }
}