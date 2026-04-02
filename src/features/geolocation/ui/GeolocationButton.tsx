import { useState } from 'react'
import { useWalkSession } from '@/entities/walk-session'
import { Button } from '@/shared/ui/Button'

export function GeolocationButton() {
  const setPointA = useWalkSession((s) => s.setPointA)
  const [busy, setBusy] = useState(false)
  const setError = useWalkSession((s) => s.setError)

  const onClick = () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается браузером')
      return
    }
    setBusy(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPointA({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setBusy(false)
      },
      () => {
        setError('Не удалось получить координаты. Проверьте разрешения.')
        setBusy(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  return (
    <Button type="button" variant="secondary" onClick={onClick} disabled={busy}>
      {busy ? 'Определяем…' : 'Определить моё местоположение'}
    </Button>
  )
}
