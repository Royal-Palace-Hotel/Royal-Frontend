import rooms from '@/data/rooms'
import { menuSections } from '@/data/menu'
import spaTreatments from '@/data/spa'
import eventRooms from '@/data/events'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  details?: any
  message?: string
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

  // Bookings
  checkAvailability: (data: {
    checkIn: string
    checkOut: string
    rooms: number
    roomId?: string
  }) => request<any>('/bookings/availability', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

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
        ...(typeof FormData !== 'undefined' && options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
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

export const adminApi = {
  login: (email: string, password: string) => request<{ token: string; user: { id: string; email: string; role: string } }>(
    '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
  ),
  me: () => adminRequest<{ user: { userId: string; email: string; role: string } }>('/auth/me'),
  get: <T>(endpoint: string) => adminRequest<T>(endpoint),
  create: <T>(endpoint: string, data: unknown) => adminRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  update: <T>(endpoint: string, data: unknown) => adminRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) => adminRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => adminRequest<T>(endpoint, { method: 'DELETE' }),
  uploadImage: (file: File) => {
    const body = new FormData()
    body.append('image', file)
    return adminRequest<{ path: string }>('/admin/uploads', { method: 'POST', body })
  },
}