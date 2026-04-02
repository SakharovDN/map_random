import { NOMINATIM_BASE } from '@/shared/config'
import type { LatLng } from '@/shared/types'

export type NominatimHit = {
  place_id: number
  lat: string
  lon: string
  display_name: string
}

export async function nominatimSearch(query: string): Promise<NominatimHit[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const params = new URLSearchParams({
    q,
    format: 'json',
    limit: '6',
    addressdetails: '0',
  })

  const base = NOMINATIM_BASE.replace(/\/$/, '')
  const url = `${base}/search?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) return []
  return (await res.json()) as NominatimHit[]
}

export function hitToLatLng(hit: NominatimHit): LatLng {
  return { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) }
}
