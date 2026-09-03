import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

type Verse = { text: string; ref: string }

let allVerses: Verse[] | null = null

function getAllVerses(): Verse[] {
  if (!allVerses) {
    const path = join(process.cwd(), 'public', 'bible-es.json')
    const bible: any[] = JSON.parse(readFileSync(path, 'utf-8'))

    allVerses = []
    for (const book of bible) {
      book.chapters.forEach((chapter: string[], chapIdx: number) => {
        chapter.forEach((text: string, verseIdx: number) => {
          if (text?.trim()) {
            allVerses!.push({
              text: text.trim(),
              ref: `${book.name} ${chapIdx + 1}:${verseIdx + 1}`
            })
          }
        })
      })
    }
  }
  return allVerses
}

export async function GET() {
  try {
    const verses = getAllVerses()
    const random = verses[Math.floor(Math.random() * verses.length)]
    return NextResponse.json(random)
  } catch (e) {
    return NextResponse.json({ error: 'Error', detail: String(e) }, { status: 500 })
  }
}