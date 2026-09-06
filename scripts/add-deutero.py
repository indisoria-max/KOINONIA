import json

print("Cargando archivos...")
main_bible = json.load(open('public/bible-es.json', encoding='utf-8'))
deutero_data = json.load(open('public/deutero-es.json', encoding='utf-8'))

books = deutero_data if isinstance(deutero_data, list) else (deutero_data.get('books') or list(deutero_data.values())[0])

DEUTERO_BOOKS = {
    'TOB': 'Tobías',
    'JDT': 'Judit',
    '1MA': '1 Macabeos',
    '2MA': '2 Macabeos',
    'WIS': 'Sabiduría',
    'SIR': 'Eclesiástico',
    'BAR': 'Baruc',
}

added = 0
for book in books:
    usfm = book.get('book_usfm', '')
    matched_key = next((k for k in DEUTERO_BOOKS if usfm == k or usfm.startswith(k)), None)
    if not matched_key:
        continue

    spanish_name = DEUTERO_BOOKS[matched_key]

    if any(b.get('name', '') == spanish_name for b in main_bible):
        print(f"Ya existe: {spanish_name}")
        continue

    chapters_data = []
    for chapter in book['chapters']:
        verses = []
        for item in chapter.get('items', []):
            if item.get('type') == 'verse' and item.get('verse_numbers') and item.get('lines'):
                verse_num = item['verse_numbers'][0]
                text = ' '.join(item['lines']).strip()
                if text:
                    verses.append((verse_num, text))
        verses.sort(key=lambda x: x[0])
        chapters_data.append([t for _, t in verses])

    main_bible.append({'name': spanish_name, 'chapters': chapters_data})
    print(f"✅ {spanish_name}: {len(chapters_data)} capítulos")
    added += 1

with open('public/bible-es.json', 'w', encoding='utf-8') as f:
    json.dump(main_bible, f, ensure_ascii=False)

print(f"\n✅ Guardado bible-es.json — {len(main_bible)} libros en total (+{added} nuevos)")