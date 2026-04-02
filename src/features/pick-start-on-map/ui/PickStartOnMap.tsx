import { useMapEvents } from 'react-leaflet'
import { useWalkSession } from '@/entities/walk-session'

/** Клик по карте задаёт точку A */
export function PickStartOnMap() {
  const setPointA = useWalkSession((s) => s.setPointA)
  const setError = useWalkSession((s) => s.setError)

  useMapEvents({
    click(e) {
      setError(null)
      setPointA({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}
