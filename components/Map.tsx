'use client'

import { useEffect } from 'react'

type Church = {
  id: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  has_adoration: boolean
  has_confessions: boolean
}

type MapProps = {
  churches: Church[]
  onSelect: (church: Church) => void
}

export default function Map({ churches, onSelect }: MapProps) {
  useEffect(() => {
    // Inyecta el CSS de Leaflet dinámicamente si no existe
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    let mapInstance: any = null

    // Carga asíncrona segura solo en el cliente
    import('leaflet').then((L) => {
      const container = document.getElementById('map-container')
      if (!container) return

      // Evita inicializar doble mapa
      if ((container as any)._leaflet_id) {
        return
      }

      mapInstance = L.map('map-container').setView([40.416775, -3.70379], 6)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(mapInstance)

      const defaultIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            width: 28px; height: 28px;
            background: linear-gradient(135deg, #C9A227, #B8901A);
            border: 2px solid #F5F0E8;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            color: #0C1828; font-weight: bold; font-size: 14px;
          ">⛪</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      churches.forEach((church) => {
        if (church.latitude && church.longitude) {
          const marker = L.marker([church.latitude, church.longitude], { icon: defaultIcon }).addTo(mapInstance)
          marker.on('click', () => {
            onSelect(church)
          })
        }
      })
    })

    return () => {
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [churches, onSelect])

  return (
    <div
      id="map-container"
      style={{
        width: '100%',
        height: '100%',
        background: '#0C1828',
      }}
    />
  )
}