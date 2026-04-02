import type { LatLng } from '@/shared/types'

/**
 * Равномерная случайная точка в круге на плоскости (equirectangular приближение).
 * Для малых радиусов (до десятков км) погрешность приемлема для пеших маршрутов.
 */
export function randomPointInCircleKm(center: LatLng, radiusKm: number): LatLng {
  if (radiusKm <= 0) return { ...center }

  const u = Math.random()
  const v = Math.random()
  const r = radiusKm * Math.sqrt(u)
  const theta = 2 * Math.PI * v

  const dxKm = r * Math.cos(theta)
  const dyKm = r * Math.sin(theta)

  const cosLat = Math.cos((center.lat * Math.PI) / 180)
  const dLat = dyKm / 111
  const dLng = dxKm / (111 * Math.max(0.01, Math.abs(cosLat)))

  return {
    lat: center.lat + dLat,
    lng: center.lng + dLng,
  }
}
