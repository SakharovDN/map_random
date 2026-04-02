import { useWalkSession } from '@/entities/walk-session'
import { findRandomWalkRoute } from '@/features/random-walk-route/model/find-random-route'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

function formatDuration(sec: number): string {
  const m = Math.round(sec / 60)
  if (m < 60) return `${m} мин`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return `${h} ч ${rest} мин`
}

export function RouteControls() {
  const pointA = useWalkSession((s) => s.pointA)
  const radiusKm = useWalkSession((s) => s.radiusKm)
  const setRadiusKm = useWalkSession((s) => s.setRadiusKm)
  const setPointB = useWalkSession((s) => s.setPointB)
  const setPolyline = useWalkSession((s) => s.setPolyline)
  const setRouting = useWalkSession((s) => s.setRouting)
  const setError = useWalkSession((s) => s.setError)
  const setRouteMeta = useWalkSession((s) => s.setRouteMeta)
  const isRouting = useWalkSession((s) => s.isRouting)
  const routeDistanceM = useWalkSession((s) => s.routeDistanceM)
  const routeDurationS = useWalkSession((s) => s.routeDurationS)

  if (!pointA) return null

  const onRandom = async () => {
    setError(null)
    setRouting(true)
    try {
      const r = await findRandomWalkRoute(pointA, radiusKm)
      setPointB(r.pointB)
      setPolyline(r.polyline)
      setRouteMeta(r.distanceM, r.durationS)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка маршрутизации')
    } finally {
      setRouting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Маршрут
      </p>
      <Input
        label="Радиус поиска точки B (км)"
        type="number"
        min={0.1}
        max={50}
        step={0.1}
        value={radiusKm}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (!Number.isFinite(v)) return
          setRadiusKm(v)
        }}
      />
      <Button onClick={onRandom} disabled={isRouting || radiusKm <= 0}>
        {isRouting ? 'Строим…' : 'Рандом'}
      </Button>
      {routeDistanceM != null && routeDurationS != null ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Длина: {(routeDistanceM / 1000).toFixed(2)} км · Время пешком:{' '}
          {formatDuration(routeDurationS)}
        </p>
      ) : null}
    </div>
  )
}
