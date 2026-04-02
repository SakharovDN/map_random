import { useCallback, useEffect, useRef, useState } from 'react'
import { useWalkSession } from '@/entities/walk-session'
import { hitToLatLng, nominatimSearch, type NominatimHit } from '@/shared/api/nominatim'
import { Input } from '@/shared/ui/Input'

export function AddressSearch() {
  const setPointA = useWalkSession((s) => s.setPointA)
  const setError = useWalkSession((s) => s.setError)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [hits, setHits] = useState<NominatimHit[]>([])
  const [loading, setLoading] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (q.trim().length < 2) {
        setHits([])
        return
      }
      setLoading(true)
      try {
        const res = await nominatimSearch(q)
        if (!cancelled) setHits(res)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    const t = window.setTimeout(run, 350)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [q])

  const pick = useCallback(
    (hit: NominatimHit) => {
      setPointA(hitToLatLng(hit))
      setQ(hit.display_name)
      setOpen(false)
      setError(null)
    },
    [setPointA, setError],
  )

  return (
    <div ref={wrapRef} className="relative">
      <Input
        label="Поиск адреса"
        placeholder="Город, улица…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && (hits.length > 0 || loading) ? (
        <ul className="absolute z-[5000] mt-1 max-h-56 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 text-left text-sm shadow-xl dark:border-zinc-600 dark:bg-zinc-900">
          {loading ? (
            <li className="px-3 py-2 text-zinc-500">Поиск…</li>
          ) : (
            hits.map((h) => (
              <li key={h.place_id}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => pick(h)}
                >
                  {h.display_name}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
