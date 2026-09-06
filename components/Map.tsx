'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

type Church = {
  id: string; name: string; address: string; city: string
  latitude: number; longitude: number; phone: string; website: string
  has_adoration: boolean; has_confessions: boolean
}

interface MapProps {
  churches: Church[]
  onSelect: (church: Church) => void
}

export default function Map({ churches, onSelect }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const clusterRef = useRef<any>(null)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    import('leaflet').then(L => {
      const map = L.map(containerRef.current!, {
        center: [40.4, -3.7],
        zoom: 6,
        zoomControl: true
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || churches.length === 0) return

    Promise.all([
      import('leaflet'),
      import('leaflet.markercluster')
    ]).then(([L]) => {
      const map = mapRef.current

      if (clusterRef.current) {
        map.removeLayer(clusterRef.current)
      }

      const cluster = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: (c: any) => {
          const count = c.getChildCount()
          return (L as any).divIcon({
            html: `<div style="
              background: linear-gradient(135deg, rgba(201,162,39,0.9), rgba(180,140,30,0.9));
              color: white; border-radius: 50%; width: 36px; height: 36px;
              display: flex; align-items: center; justify-content: center;
              font-size: 12px; font-weight: 700;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              border: 2px solid rgba(255,255,255,0.6);
            ">${count > 999 ? '999+' : count}</div>`,
            className: '',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          })
        }
      })

      const icon = (L as any).divIcon({
        html: `<div style="
          width: 12px; height: 12px;
          background: #C9A227; border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        "></div>`,
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      })

      churches.forEach(church => {
        const marker = (L as any).marker(
          [church.latitude, church.longitude],
          { icon }
        )
        marker.on('click', () => onSelect(church))
        cluster.addLayer(marker)
      })

      map.addLayer(cluster)
      clusterRef.current = cluster
    })
  }, [churches])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}