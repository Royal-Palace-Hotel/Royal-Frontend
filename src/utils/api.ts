import rooms from '@/data/rooms'
import { menuSections } from '@/data/menu'
import spaTreatments from '@/data/spa'
import eventRooms from '@/data/events'
import galleryImages from '@/data/gallery'
import { activities, attractionKeys } from '@/data/discover'

/**
 * Repli de la page « Découvrir » quand l'API est injoignable.
 * Les données statiques portent des clés i18n (`activity1Title`) ; on les
 * ramène à la forme de l'API, où `key` vaut `activity1` et le composant
 * reconstruit la clé de traduction.
 */
const discoverFallback = {
  activities: activities.map((activity, index) => ({
    id: activity.id,
    type: 'activity' as const,
    key: activity.titleKey.replace(/Title$/, ''),
    title: null, titleEn: null, text: null, textEn: null,
    icon: activity.icon,
    image: activity.image,
    order: index,
  })),
  attractions: attractionKeys.map((key, index) => ({
    id: key,
    type: 'attraction' as const,
    key,
    title: null, titleEn: null, text: null, textEn: null,
    icon: null, image: null,
    order: index,
  })),
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

/** Réponse de `POST /bookings/availability`. */
export interface AvailabilityResult {
  available: boolean
  availableRooms: number
  requestedRooms: number
  totalRooms: number
  bookedRooms: number
  blockedRooms: number
  /** Faux quand la chambre est libre mais trop petite pour le groupe. */
  fitsParty: boolean
  maxGuests?: number
  roomId?: string
}

export interface AvailabilityDay {
  date: string
  free: number
  /** Détaillé seulement côté back-office. */
  total?: number
  booked?: number
  blocked?: number
}

export interface RoomAvailability {
  roomId: string
  slug: string
  name: string | null
  nameEn: string | null
  totalUnits: number
  days: AvailabilityDay[]
}

/** Une réservation telle que la vue « journée » la présente. */
export interface DayBooking {
  id: string
  guestName: string
  guestEmail: string | null
  guestPhone: string | null
  roomName: string | null
  rooms: number
  adults: number
  children: number
  nights: number
  checkIn: string
  checkOut: string
  status: string
  source: string
}

export interface RoomBlock {
  id: string
  roomId: string
  roomName: string | null
  startDate: string
  endDate: string
  units: number
  reason: string | null
}

export interface PageMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

interface ApiResponse<T> {
  data?: T
  error?: string
  details?: any
  message?: string
  meta?: PageMeta
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch (error) {
    return { error: 'Unable to reach the server. Check that the API is running and try again.' }
  }

  const data: ApiResponse<T> = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      error: endpoint === '/auth/login' && response.status === 401
        ? 'Adresse e-mail ou mot de passe incorrect.'
        : data.error || `Request failed (${response.status})`,
      details: data.details,
    }
  }

  return data
}

/**
 * Pour les pages de contenu (chambres, menu, spa, événements) :
 * si l'API est injoignable ou renvoie une erreur, on utilise les
 * données locales de src/data/ afin que la page s'affiche quand même.
 * Dès que le backend répond, ce sont ses données qui sont utilisées.
 */
async function withFallback<T>(
  call: () => Promise<ApiResponse<T>>,
  fallback: T
): Promise<ApiResponse<T>> {
  const response = await call()
  if (response.error || !response.data) {
    return { data: fallback }
  }
  return response
}

export const api = {
  // Content (avec repli sur les données locales)
  getRooms: () => withFallback(() => request<any[]>('/content/rooms'), rooms as any[]),
  getMenu: () => withFallback(() => request<any[]>('/content/menu'), menuSections as any[]),
  getSpa: () => withFallback(() => request<any[]>('/content/spa'), spaTreatments as any[]),
  getEvents: () => withFallback(() => request<any[]>('/content/events'), eventRooms as any[]),
  getGallery: () => withFallback(() => request<any[]>('/content/gallery'), galleryImages as any[]),
  getDiscover: () => withFallback(
    () => request<{ activities: any[]; attractions: any[] }>('/content/discover'),
    discoverFallback,
  ),

  // Bookings
  checkAvailability: (data: {
    checkIn: string
    checkOut: string
    rooms: number
    roomId?: string
    adults?: number
    children?: number
  }) => request<AvailabilityResult>('/bookings/availability', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  /**
   * Disponibilité jour par jour, toutes chambres confondues : un seul appel
   * remplace une vérification par chambre.
   */
  getAvailabilityCalendar: (from: string, to: string) =>
    request<RoomAvailability[]>(`/content/availability?from=${from}&to=${to}`),

  createBooking: (data: {
    guestName: string
    guestEmail: string
    guestPhone?: string
    checkIn: string
    checkOut: string
    rooms: number
    adults: number
    children: number
    roomId?: string
  }) => request<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Contact
  sendContact: (data: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
  }) => request<any>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  sendEventInquiry: (data: {
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
    eventDate: string
    guestCount: string
  }) => request<any>('/contact/event-inquiry', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Newsletter
  subscribeNewsletter: (email: string) => request<any>('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
}

export async function adminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('royal-admin-token')
  let response: Response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    return { error: 'Unable to reach the API server. Check that it is running and try again.' }
  }

  let body: ApiResponse<T>
  try {
    body = await response.json()
  } catch {
    return { error: `Invalid API response (HTTP ${response.status}).` }
  }

  if (!response.ok) {
    return {
      error: `${body.error || response.statusText || 'Request failed'} (HTTP ${response.status})`,
      details: body.details,
    }
  }

  return body.data !== undefined ? body : { data: body as T }
}

/** Origine de l'API, sans le suffixe `/api`. */
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '')

/**
 * Résout le chemin d'une image.
 *
 * Les fichiers envoyés depuis le back-office sont stockés par l'API et
 * référencés en base par un chemin relatif `/uploads/<fichier>` — la base
 * reste ainsi valable si le domaine de l'API change. Ils sont servis par
 * l'API, pas par le front : ce sont les seuls chemins à préfixer. Les images
 * livrées avec le site (`/images/...`) et les URL absolues passent telles
 * quelles.
 */
export function resolveImageUrl(src?: string | null): string {
  if (!src) return ''
  if (src.startsWith('/uploads/')) return `${API_ORIGIN}${src}`
  return src
}

export interface UploadedFile {
  url: string
  filename: string
  originalName: string
  size: number
  mimeType: string
}

/**
 * Envoie une ou plusieurs images.
 *
 * On ne pose pas `Content-Type` : le navigateur doit l'écrire lui-même pour
 * y inclure la limite (`boundary`) du corps multipart.
 */
export async function uploadImages(files: File[]): Promise<ApiResponse<UploadedFile[]>> {
  const token = localStorage.getItem('royal-admin-token')
  const body = new FormData()
  for (const file of files) body.append('files', file)

  let response: Response
  try {
    response = await fetch(`${API_URL}/admin/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    })
  } catch {
    return { error: 'Envoi impossible : serveur injoignable.' }
  }

  let payload: ApiResponse<UploadedFile[]>
  try {
    payload = await response.json()
  } catch {
    return { error: `Envoi impossible (HTTP ${response.status}).` }
  }
  if (!response.ok) return { error: payload.error || `Envoi impossible (HTTP ${response.status}).` }
  return payload
}

/** Construit une query string en ignorant les filtres vides. */
export function queryString(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

export interface AdminUser {
  userId: string
  email: string
  name: string | null
  role: string
  lastLoginAt: string | null
}

export const adminApi = {
  login: (email: string, password: string) => request<{ token: string; user: { id: string; email: string; role: string } }>(
    '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
  ),
  me: () => adminRequest<{ user: AdminUser }>('/auth/me'),
  get: <T>(endpoint: string) => adminRequest<T>(endpoint),
  /** Arrivées, départs et clients sur place pour une date donnée. */
  day: (date: string) => adminRequest<{
    date: string
    arrivals: DayBooking[]
    departures: DayBooking[]
    inHouse: DayBooking[]
  }>(`/admin/day?date=${date}`),

  /** Tableau de disponibilité : calendrier détaillé + périodes bloquées de la fenêtre. */
  availability: (from: string, to: string, ignoreBooking?: string) => adminRequest<{
    from: string
    to: string
    rooms: RoomAvailability[]
    blocks: RoomBlock[]
  }>(`/admin/availability?from=${from}&to=${to}`
    + (ignoreBooking ? `&ignoreBooking=${encodeURIComponent(ignoreBooking)}` : '')),

  /** La traduction FR → EN est facultative côté serveur : à demander avant de la proposer. */
  translationStatus: () => adminRequest<{ enabled: boolean }>('/admin/translate'),
  translate: (texts: string[]) => adminRequest<{ translations: string[] }>(
    '/admin/translate', { method: 'POST', body: JSON.stringify({ texts }) }
  ),
  create: <T>(endpoint: string, data: unknown) => adminRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  update: <T>(endpoint: string, data: unknown) => adminRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) => adminRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => adminRequest<T>(endpoint, { method: 'DELETE' }),
}

/**
 * Télécharge un export CSV.
 *
 * Un simple lien ne conviendrait pas : l'endpoint exige l'en-tête
 * Authorization, que le navigateur n'enverrait pas sur une navigation.
 * On récupère donc le fichier en mémoire avant de déclencher la sauvegarde.
 */
export async function downloadCsv(endpoint: string, fallbackName: string): Promise<string | null> {
  const token = localStorage.getItem('royal-admin-token')
  let response: Response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch {
    return 'Serveur injoignable. Vérifiez que l’API est démarrée.'
  }

  if (!response.ok) {
    try {
      const body = await response.json()
      return body.error || `Export impossible (HTTP ${response.status}).`
    } catch {
      return `Export impossible (HTTP ${response.status}).`
    }
  }

  const disposition = response.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="([^"]+)"/)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = match?.[1] || fallbackName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  return null
}