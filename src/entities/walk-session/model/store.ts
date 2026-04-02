import { create } from 'zustand'
import type { LatLng } from '@/shared/types'

export type WalkSessionState = {
  pointA: LatLng | null
  pointB: LatLng | null
  polyline: [number, number][] | null
  radiusKm: number
  isRouting: boolean
  error: string | null
  routeDistanceM: number | null
  routeDurationS: number | null
  setPointA: (p: LatLng | null) => void
  setPointB: (p: LatLng | null) => void
  setPolyline: (p: [number, number][] | null) => void
  setRadiusKm: (r: number) => void
  setRouting: (v: boolean) => void
  setError: (e: string | null) => void
  setRouteMeta: (distanceM: number | null, durationS: number | null) => void
  resetRoute: () => void
}

export const useWalkSession = create<WalkSessionState>((set) => ({
  pointA: null,
  pointB: null,
  polyline: null,
  radiusKm: 2,
  isRouting: false,
  error: null,
  routeDistanceM: null,
  routeDurationS: null,
  setPointA: (pointA) =>
    set(() => ({
      pointA,
      pointB: null,
      polyline: null,
      routeDistanceM: null,
      routeDurationS: null,
      error: null,
    })),
  setPointB: (pointB) => set({ pointB }),
  setPolyline: (polyline) => set({ polyline }),
  setRadiusKm: (radiusKm) => set({ radiusKm }),
  setRouting: (isRouting) => set({ isRouting }),
  setError: (error) => set({ error }),
  setRouteMeta: (routeDistanceM, routeDurationS) => set({ routeDistanceM, routeDurationS }),
  resetRoute: () =>
    set({
      pointB: null,
      polyline: null,
      routeDistanceM: null,
      routeDurationS: null,
      error: null,
    }),
}))
