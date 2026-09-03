'use client'

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const churchIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

type Church = {
  id: string
  name: string
  address: string
  city: string
  phone: string
  website: string
  latitude: number
  longitude: number
  has_adoration: boolean
  has_confessions: boolean
}

function ResizeMap() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

export default function Map({
  churches,
  onSelect
}: {
  churches: Church[]
  onSelect: (church: Church) => void
}) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
      <MapContainer
        center={[40.4168, -3.7038]}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <ResizeMap />
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {churches.map(church => (
          <Marker
            key={church.id}
            position={[church.latitude, church.longitude]}
            icon={churchIcon}
            eventHandlers={{ click: () => onSelect(church) }}
          />
        ))}
      </MapContainer>
    </div>
  )
}