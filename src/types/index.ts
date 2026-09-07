// ============================================================
// Global TypeScript type definitions for Royal Palace Antsirabe
// ============================================================

export interface Room {
  id: string
  slug: string
  translationKey: string // key in roomsData.* translations
  price: number // in EUR per night (base price)
  currency: string
  images: string[] // paths under /images/rooms/
  size: number // in m²
  maxGuests: number
  amenities: string[] // icon keys, see RoomCard
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: 'hero' | 'rooms' | 'restaurant' | 'pool' | 'spa' | 'events' | 'discover' | 'gallery'
}

export interface MenuItem {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  price: number
}

export interface MenuSection {
  id: string
  title: string
  titleEn: string
  items: MenuItem[]
}

export interface SpaTreatment {
  id: string
  key: string // i18n key suffix e.g. 'treatment1'
  durationKey: string
  price: number
}

export interface EventRoom {
  id: string
  key: string
  image: string
}

export interface BookingState {
  checkIn: Date | null
  checkOut: Date | null
  rooms: number
  adults: number
  children: number
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface EventFormData extends ContactFormData {
  eventDate: string
  guestCount: string
}
