const https = require('https')
const fs = require('fs')
const path = require('path')

const QUERY = `[out:json][timeout:300];
(
  node["amenity"="place_of_worship"]["denomination"="catholic"](35.16,-9.67,43.79,4.34);
  way["amenity"="place_of_worship"]["denomination"="catholic"](35.16,-9.67,43.79,4.34);
);
out center tags;`

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

function postRequest(urlStr, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr)
    const data = `data=${encodeURIComponent(body)}`
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'koinonia-app/1.0'
      },
      timeout: 310000
    }
    const req = https.request(options, res => {
      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      let raw = ''
      res.on('data', chunk => raw += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) }
        catch (e) { reject(new Error('JSON inválido')) }
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
    req.write(data)
    req.end()
  })
}

function escapeCsv(val) {
  if (val === null || val === undefined) return ''
  const s = String(val).replace(/"/g, '""')
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s
}

async function main() {
  let data = null
  for (const mirror of MIRRORS) {
    try {
      console.log(`🌍 Probando ${mirror}...`)
      data = await postRequest(mirror, QUERY)
      console.log('   ✅ Conectado!')
      break
    } catch (e) {
      console.log(`   ❌ ${e.message}`)
    }
  }

  if (!data) throw new Error('Todos los servidores fallaron.')

  const elements = data.elements || []
  console.log(`\n📍 ${elements.length} iglesias encontradas`)

  const churches = elements.map(el => {
    const lat = el.lat ?? el.center?.lat
    const lon = el.lon ?? el.center?.lon
    const t = el.tags || {}
    if (!lat || !lon || !t.name) return null
    return {
      name: t.name,
      address: [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ') || t['addr:full'] || '',
      city: t['addr:city'] || t['addr:municipality'] || t['addr:town'] || t['addr:village'] || '',
      latitude: lat,
      longitude: lon,
      phone: t.phone || t['contact:phone'] || '',
      website: t.website || t['contact:website'] || t['contact:url'] || '',
      has_adoration: false,
      has_confessions: false
    }
  }).filter(Boolean)

  console.log(`✅ ${churches.length} iglesias con nombre y coordenadas`)

  // Generar CSV
  const header = 'name,address,city,latitude,longitude,phone,website,has_adoration,has_confessions'
  const rows = churches.map(c =>
    [c.name, c.address, c.city, c.latitude, c.longitude, c.phone, c.website, c.has_adoration, c.has_confessions]
      .map(escapeCsv).join(',')
  )
  const csv = [header, ...rows].join('\n')

  const outPath = path.join(__dirname, '..', 'churches-spain.csv')
  fs.writeFileSync(outPath, csv, 'utf-8')
  console.log(`\n✅ Archivo generado: churches-spain.csv (${churches.length} iglesias)`)
  console.log('📋 Ahora importa este CSV en Supabase → Table Editor → churches → Import Data')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })