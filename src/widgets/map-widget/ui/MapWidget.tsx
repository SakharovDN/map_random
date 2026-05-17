import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { useWalkSession } from '@/entities/walk-session'
import { PickStartOnMap } from '@/features/pick-start-on-map/ui/PickStartOnMap'
import { ensureDefaultLeafletIcons } from '@/shared/lib/leaflet-icons'
import type { LatLng } from '@/shared/types'
import { MapRecenter } from './MapRecenter'

const DEFAULT_CENTER: LatLng = { lat: 55.751244, lng: 37.618423 }

export function MapWidget() {
  const pointA = useWalkSession((s) => s.pointA)
  const pointB = useWalkSession((s) => s.pointB)
  const polyline = useWalkSession((s) => s.polyline)

  useEffect(() => {
    ensureDefaultLeafletIcons()
  }, [])

  return (
    <MapContainer
      center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
      zoom={12}
      className="h-full min-h-[320px] w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenter point={pointA} polyline={polyline} fallback={DEFAULT_CENTER} />
      <PickStartOnMap />
      {pointA ? <Marker position={[pointA.lat, pointA.lng]} /> : null}
      {pointB ? <Marker position={[pointB.lat, pointB.lng]} /> : null}
      {polyline && polyline.length > 1 ? (
        <Polyline positions={polyline} pathOptions={{ color: '#059669', weight: 5, opacity: 0.9 }} />
      ) : null}
    </MapContainer>
  )
}
