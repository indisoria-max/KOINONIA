import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Koinonia',
    short_name: 'Koinonia',
    description: 'La comunidad católica para viajeros de fe',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C1828',
    theme_color: '#C9A227',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}