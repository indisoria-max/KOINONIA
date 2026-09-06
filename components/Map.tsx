'use client'

import { useEffect, useRef, useState } from 'react'
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
  const userMarkerRef = useRef<any>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    import('leaflet').then(L => {
      const map = L.map(containerRef.current!, {
        center: [40.4, -3.7],
        zoom: 6,
        zoomControl: false,
      })

      // Base oscura ESRI — gratis, sin API key
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri © OpenStreetMap', maxZoom: 16 }
      ).addTo(map)

      // Etiquetas de calles y ciudades
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16 }
      ).addTo(map)

      L.control.zoom({ position: 'topright' }).addTo(map)

      mapRef.current = map
      setMapReady(true)
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapRef.current || churches.length === 0) return

    Promise.all([
      import('leaflet'),
      import('leaflet.markercluster')
    ]).then(([L]) => {
      const map = mapRef.current
      if (!map) return

      if (clusterRef.current) map.removeLayer(clusterRef.current)

      const cluster = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: (c: any) => {
          const count = c.getChildCount()
          return (L as any).divIcon({
            html: `<div style="
              background: linear-gradient(135deg, rgba(201,162,39,0.92), rgba(168,126,24,0.92));
              color: white; border-radius: 50%;
              width: 38px; height: 38px;
              display: flex; align-items: center; justify-content: center;
              font-size: 12px; font-weight: 700;
              box-shadow: 0 2px 10px rgba(0,0,0,0.5);
              border: 2px solid rgba(255,255,255,0.5);
            ">${count > 999 ? '999+' : count}</div>`,
            className: '', iconSize: [38, 38], iconAnchor: [19, 19]
          })
        }
      })

      const icon = (L as any).divIcon({
        html: `<div style="
          width: 12px; height: 12px;
          background: #C9A227; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 1px 6px rgba(0,0,0,0.6);
        "></div>`,
        className: '', iconSize: [12, 12], iconAnchor: [6, 6]
      })

      churches.forEach(church => {
        const marker = (L as any).marker([church.latitude, church.longitude], { icon })
        marker.on('click', () => onSelect(church))
        cluster.addLayer(marker)
      })

      map.addLayer(cluster)
      clusterRef.current = cluster
    })
  }, [churches, mapReady])

  const handleLocate = () => {
    if (!mapRef.current || !navigator.geolocation) return
    const map = mapRef.current

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        import('leaflet').then(L => {
          const { latitude: lat, longitude: lng } = pos.coords
          map.flyTo([lat, lng], 15, { duration: 1.5 })

          if (userMarkerRef.current) map.removeLayer(userMarkerRef.current)

          const userIcon = (L as any).divIcon({
            html: `<div style="
              width: 18px; height: 18px;
              background: #3B82F6; border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 0 0 5px rgba(59,130,246,0.25), 0 2px 8px rgba(0,0,0,0.4);
            "></div>`,
            className: '', iconSize: [18, 18], iconAnchor: [9, 9]
          })

          userMarkerRef.current = (L as any).marker([lat, lng], { icon: userIcon }).addTo(map)
        })
      },
      () => alert('Activa la ubicación en tu dispositivo')
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <button onClick={handleLocate} style={{
        position: 'absolute', bottom: '16px', right: '10px', zIndex: 1000,
        width: '42px', height: '42px', borderRadius: '10px',
        background: 'rgba(12,20,35,0.92)',
        border: '1px solid rgba(201,162,39,0.3)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" fill="#C9A227" fillOpacity="0.3"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          <circle cx="12" cy="12" r="8"/>
        </svg>
      </button>
    </div>
  )
}