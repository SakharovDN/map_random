const dev = import.meta.env.DEV

/** База OSRM: в dev — прокси Vite (обход CORS), иначе публичный инстанс */
export const OSRM_BASE =
  import.meta.env.VITE_OSRM_BASE ?? (dev ? '/osrm' : 'https://router.project-osrm.org')

/** Nominatim: в dev — прокси с User-Agent; в проде лучше свой бэкенд */
export const NOMINATIM_BASE =
  import.meta.env.VITE_NOMINATIM_BASE ?? (dev ? '/nominatim' : 'https://nominatim.openstreetmap.org')
