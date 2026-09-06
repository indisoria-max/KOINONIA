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

    // Buscar el libro por índice (0-based) o por propiedad number
    const targetBook = bibleData[bookNum - 1] || bibleData.find((b: any) => b.number === bookNum)
    
    if (!targetBook) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 })
    }

    // Los capítulos están en targetBook.chapters
    const chapters = targetBook.chapters || targetBook.c
    const versesArray = chapters?.[chapterNum - 1]

    if (!versesArray) {
      return NextResponse.json({ error: 'Capítulo no encontrado' }, { status: 404 })
    }

    const verses = versesArray.map((verseItem: any, index: number) => {
      if (typeof verseItem === 'string') {
        return { verse: index + 1, text: verseItem.trim() }
      }
      return {
        verse: verseItem.verse || index + 1,
        text: (verseItem.text || verseItem.t || '').trim()
      }
    })

    return NextResponse.json({
      book: targetBook.name || targetBook.n,
      chapter: chapterNum,
      verses
    })
  } catch (e) {
    return NextResponse.json({ error: 'Error interno', detail: String(e) }, { status: 500 })
  }
}