import { osrmFootRoute, osrmNearest } from '@/shared/api/osrm'
import { haversineKm } from '@/shared/lib/geo'
import { randomPointInCircleKm } from '@/shared/lib/random-in-radius'
import type { LatLng } from '@/shared/types'

const MAX_ATTEMPTS = 28
const MIN_ROUTE_M = 100

export type RandomRouteOk = {
  pointB: LatLng
  polyline: [number, number][]
  distanceM: number
  durationS: number
}

/**
 * Случайная точка B в круге → привязка к сети пеших путей (OSRM nearest) → маршрут foot.
 * Повтор при воде/отсутствии дороги или слишком коротком пути.
 */
export async function findRandomWalkRoute(
  pointA: LatLng,
  radiusKm: number,
): Promise<RandomRouteOk> {
  let lastMessage = 'Не удалось найти подходящую конечную точку. Увеличьте радиус или сдвиньте точку А.'

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const raw = randomPointInCircleKm(pointA, radiusKm)
    const snapped = await osrmNearest(raw.lng, raw.lat)
    if (!snapped) continue

    const distA = haversineKm(pointA, snapped)
    if (distA > radiusKm * 1.1) continue

    const route = await osrmFootRoute(pointA, snapped)
    if (!route) continue
    if (route.distanceM < MIN_ROUTE_M) {
      lastMessage = 'Маршрут слишком короткий — пробуем другую точку.'
      continue
    }

    return {
      pointB: snapped,
      polyline: route.coordinatesLatLng,
      distanceM: route.distanceM,
      durationS: route.durationS,
    }
  }

  throw new Error(lastMessage)
}
