import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

let bible: any[] | null = null

function getBible() {
  if (!bible) {
    const path = join(process.cwd(), 'public', 'bible-es.json')
    bible = JSON.parse(readFileSync(path, 'utf-8'))
  }
  return bible
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const book    = parseInt(searchParams.get('book')    || '43')
  const chapter = parseInt(searchParams.get('chapter') || '1')

  try {
    const data       = getBible()
    const bookData   = data[book - 1]
    if (!bookData) return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 })

    const chapterArr = bookData.chapters[chapter - 1]
    if (!chapterArr) return NextResponse.json({ error: 'Capítulo no encontrado' }, { status: 404 })

    const verses = chapterArr.map((text: string, i: number) => ({
      verse: i + 1,
      text
    }))

    return NextResponse.json({ verses, book: bookData.name })

  } catch (e) {
    return NextResponse.json({ error: 'Error', detail: String(e) }, { status: 500 })
  }
}