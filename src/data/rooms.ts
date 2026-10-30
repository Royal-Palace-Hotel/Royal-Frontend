import type { Room } from '@/types'

/**
 * ROOMS DATA
 * ----------
 * To add/edit a room, update this array. Each room references a
 * `translationKey` matching an entry in `src/i18n/locales/{fr,en}.ts`
 * under the `roomsData` namespace (name/description/view/bedType).
 *
 * IMAGES: place files under /public/images/rooms/ and reference them
 * here as '/images/rooms/your-file.jpg'. Recommended size: 1600x1067px.
 */
export const rooms: Room[] = [
  {
    id: 'classic',
    slug: 'chambre-classique',
    translationKey: 'classic',
    price: 65,
    currency: 'EUR',
    images: ['/images/Photo-chambre.jpg'],
    size: 22,
    maxGuests: 2,
    amenities: ['ac', 'wifi', 'tv', 'bathroom'],
  },
  {
    id: 'superior',
    slug: 'chambre-superieure',
    translationKey: 'superior',
    price: 95,
    currency: 'EUR',
    images: ['/images/Photo-Bloc-1.webp'],
    size: 28,
    maxGuests: 3,
    amenities: ['ac', 'wifi', 'tv', 'minibar', 'safe', 'bathroom'],
  },
  {
    id: 'deluxe',
    slug: 'chambre-deluxe',
    translationKey: 'deluxe',
    price: 130,
    currency: 'EUR',
    images: ['/images/Image-GYX72HV.jpg'],
    size: 34,
    maxGuests: 3,
    amenities: ['ac', 'wifi', 'tv', 'minibar', 'safe', 'bathroom', 'balcony'],
  },
  {
    id: 'suite',
    slug: 'suite-royale',
    translationKey: 'suite',
    price: 220,
    currency: 'EUR',
    images: ['/images/Photo-Gallerie-5-1200.jpg'],
    size: 55,
    maxGuests: 4,
    amenities: ['ac', 'wifi', 'tv', 'minibar', 'safe', 'bathroom', 'balcony', 'lounge'],
  },
]

export default rooms
