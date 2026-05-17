import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { LatLng } from '@/shared/types'

type Props = {
  point: LatLng | null
  polyline: [number, number][] | null
  fallback: LatLng
}

/**
 * Первый раз: если есть маршрут — fit по нему, иначе — центр на A или fallback.
 * Дальше: центрируем только при смене точки A; маршрут пользователь видит сам.
 */
export function MapRecenter({ point, polyline, fallback }: Props) {
  const map = useMap()
  const initialized = useRef(false)
  const lastPointKey = useRef<string | null>(null)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      if (polyline && polyline.length > 1) {
        map.fitBounds(L.latLngBounds(polyline), { padding: [40, 40] })
      } else if (point) {
        map.setView([point.lat, point.lng], 15)
      } else {
        map.setView([fallback.lat, fallback.lng], 12)
      }
      lastPointKey.current = point ? `${point.lat},${point.lng}` : null
      return
    }

    const key = point ? `${point.lat},${point.lng}` : null
    if (key !== lastPointKey.current) {
      lastPointKey.current = key
      if (point) {
        map.setView([point.lat, point.lng], 15)
      } else {
        map.setView([fallback.lat, fallback.lng], 12)
      }
    }
  }, [map, point, polyline, fallback])

  return null
}
