import { AddressSearch } from '@/features/address-search/ui/AddressSearch'
import { GeolocationButton } from '@/features/geolocation/ui/GeolocationButton'
import { RouteControls } from '@/features/random-walk-route/ui/RouteControls'
import { useWalkSession } from '@/entities/walk-session'
import { MapWidget } from './MapWidget'

export function MapShell() {
  const error = useWalkSession((s) => s.error)

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 md:w-[380px] md:border-b-0 md:border-r">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Random Walk Planner
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Клик по карте — точка A. Задайте радиус и нажмите «Рандом» для маршрута до случайной точки B.
          </p>
        </div>
        <AddressSearch />
        <GeolocationButton />
        <RouteControls />
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200">
            {error}
          </p>
        ) : null}
      </aside>
      <div className="relative min-h-[50vh] flex-1 md:min-h-0">
        <MapWidget />
      </div>
    </div>
  )
}
