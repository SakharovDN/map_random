import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { LatLng } from '@/shared/types'

type Props = {
  point: LatLng | null
  fallback: LatLng
}

/** Центрирует карту при появлении/смене точки A */
export function MapRecenter({ point, fallback }: Props) {
  const map = useMap()
  useEffect(() => {
    const p = point ?? fallback
    map.setView([p.lat, p.lng], point ? 15 : 12)
  }, [map, point, fallback])
  return null
}
