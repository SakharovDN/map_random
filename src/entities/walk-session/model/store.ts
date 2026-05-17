import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LatLng } from '@/shared/types'

export type WalkSessionState = {
  pointA: LatLng | null
  pointALabel: string | null
  pointB: LatLng | null
  polyline: [number, number][] | null
  radiusKm: number
  isRouting: boolean
  error: string | null
  routeDistanceM: number | null
  routeDurationS: number | null
  setPointA: (p: LatLng | null, label?: string | null) => void
  setPointB: (p: LatLng | null) => void
  setPolyline: (p: [number, number][] | null) => void
  setRadiusKm: (r: number) => void
  setRouting: (v: boolean) => void
  setError: (e: string | null) => void
  setRouteMeta: (distanceM: number | null, durationS: number | null) => void
  resetRoute: () => void
  resetAll: () => void
}

export const useWalkSession = create<WalkSessionState>()(
  persist(
    (set) => ({
      pointA: null,
      pointALabel: null,
      pointB: null,
      polyline: null,
      radiusKm: 2,
      isRouting: false,
      error: null,
      routeDistanceM: null,
      routeDurationS: null,
      setPointA: (pointA, label = null) =>
        set(() => ({
          pointA,
          pointALabel: pointA ? label : null,
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
      setRouteMeta: (routeDistanceM, routeDurationS) =>
        set({ routeDistanceM, routeDurationS }),
      resetRoute: () =>
        set({
          pointB: null,
          polyline: null,
          routeDistanceM: null,
          routeDurationS: null,
          error: null,
        }),
      resetAll: () =>
        set({
          pointA: null,
          pointALabel: null,
          pointB: null,
          polyline: null,
          routeDistanceM: null,
          routeDurationS: null,
          error: null,
        }),
    }),
    {
      name: 'random-walk-session/v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        pointA: s.pointA,
        pointALabel: s.pointALabel,
        pointB: s.pointB,
        polyline: s.polyline,
        radiusKm: s.radiusKm,
        routeDistanceM: s.routeDistanceM,
        routeDurationS: s.routeDurationS,
      }),
    },
  ),
)
