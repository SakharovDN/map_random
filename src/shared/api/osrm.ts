import { OSRM_BASE } from '@/shared/config'
import type { LatLng } from '@/shared/types'

type OsrmRouteResponse = {
  code: string
  routes?: Array<{
    distance: number
    duration: number
    geometry: { type: string; coordinates: [number, number][] }
  }>
}

type OsrmNearestResponse = {
  code: string
  waypoints?: Array<{
    location: [number, number]
  }>
}

function buildUrl(path: string): string {
  const base = OSRM_BASE.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/** Снап точки к ближайшей дороге/тропе (профиль foot) */
export async function osrmNearest(lon: number, lat: number): Promise<LatLng | null> {
  const url = buildUrl(`/nearest/v1/foot/${lon},${lat}`)
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as OsrmNearestResponse
  const loc = data.waypoints?.[0]?.location
  if (!loc) return null
  return { lng: loc[0], lat: loc[1] }
}

export type RouteResult = {
  coordinatesLatLng: [number, number][]
  distanceM: number
  durationS: number
}

/** Пеший маршрут между двумя точками */
export async function osrmFootRoute(
  from: LatLng,
  to: LatLng,
): Promise<RouteResult | null> {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`
  const url = buildUrl(
    `/route/v1/foot/${coords}?overview=full&geometries=geojson&steps=false`,
  )
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as OsrmRouteResponse
  if (data.code !== 'Ok' || !data.routes?.[0]) return null
  const route = data.routes[0]
  const coordsLngLat = route.geometry.coordinates
  const coordinatesLatLng: [number, number][] = coordsLngLat.map(([lng, lat]) => [
    lat,
    lng,
  ])
  return {
    coordinatesLatLng,
    distanceM: route.distance,
    durationS: route.duration,
  }
}
