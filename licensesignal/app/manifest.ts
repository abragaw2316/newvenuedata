import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'New Venue Data — Florida License Intelligence',
    short_name: 'New Venue Data',
    description:
      'Real-time Florida liquor and food-service license intelligence via API, webhooks, and data exports.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
