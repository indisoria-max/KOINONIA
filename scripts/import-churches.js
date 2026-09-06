const https = require('https')
const http = require('http')

const SUPABASE_URL = 'https://rrtrrstavukdytulymjd.supabase.co'
const ANON_KEY = 'sb_publishable_Xdg-b8bSYoxJRfj-7wyDbA_i64-Xw3t'

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
  'https://overpass.kumi.systems/api/interpreter',
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

async function supabaseInsert(batch) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(batch)
    const url = new URL(`${SUPABASE_URL}/rest/v1/churches`)
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Prefer': 'return=minimal'
      }
    }
    const req = https.request(options, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        if (res.statusCode >= 400) console.error('\n⚠️', raw.slice(0, 150))
        resolve()
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
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

  if (!data) throw new Error('Todos los servidores fallaron. Intenta en 10 minutos.')

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
      phone: t.phone || t['contact:phone'] || null,
      website: t.website || t['contact:website'] || t['contact:url'] || null,
      has_adoration: false,
      has_confessions: false
    }
  }).filter(Boolean)

  console.log(`✅ ${churches.length} iglesias con nombre y coordenadas`)
  console.log('⬆️  Subiendo a Supabase...\n')

  const BATCH = 100
  let done = 0
  for (let i = 0; i < churches.length; i += BATCH) {
    await supabaseInsert(churches.slice(i, i + BATCH))
    done += Math.min(BATCH, churches.length - i)
    process.stdout.write(`\r   ${done}/${churches.length} iglesias subidas...`)
  }

  console.log(`\n\n✅ ¡Completado! ${done} iglesias en el mapa 🗺️`)
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })