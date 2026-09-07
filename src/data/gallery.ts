import type { GalleryImage } from '@/types'

/**
 * GALLERY IMAGES
 * --------------
 * Central registry of all photos used across the site.
 * EASY TO REPLACE: simply swap the file under /public/images/<category>/
 * keeping the same filename, or update the `src` path here.
 * Recommended format: JPG, landscape 3:2, min. 1600px wide.
 */
export const galleryImages: GalleryImage[] = [
  { id: 'hero-1', src: '/images/hero/hero-building.jpg', alt: 'Façade du Royal Palace Antsirabe au crépuscule', category: 'hero' },

  { id: 'room-1', src: '/images/rooms/room-1.jpg', alt: 'Chambre supérieure avec lit confortable', category: 'rooms' },
  { id: 'room-2', src: '/images/rooms/room-2.jpg', alt: 'Chambre deluxe élégante', category: 'rooms' },
  { id: 'room-3', src: '/images/rooms/room-3.jpg', alt: 'Suite royale avec décoration raffinée', category: 'rooms' },
  { id: 'room-4', src: '/images/rooms/room-4.jpg', alt: 'Chambre classique lumineuse', category: 'rooms' },

  { id: 'restaurant-1', src: '/images/restaurant/restaurant-1.jpg', alt: 'Salle du restaurant Royal Palace', category: 'restaurant' },
  { id: 'restaurant-2', src: '/images/restaurant/restaurant-2.jpg', alt: 'Table dressée dans une ambiance élégante', category: 'restaurant' },
  { id: 'restaurant-3', src: '/images/restaurant/food-1.jpg', alt: 'Plat gastronomique raffiné', category: 'restaurant' },
  { id: 'restaurant-4', src: '/images/restaurant/breakfast-1.jpg', alt: 'Buffet petit-déjeuner gourmand', category: 'restaurant' },

  { id: 'pool-1', src: '/images/pool/pool-1.jpg', alt: 'Piscine entourée de palmiers', category: 'pool' },
  { id: 'pool-2', src: '/images/pool/pool-2.jpg', alt: 'Piscine et jardin tropical', category: 'pool' },
  { id: 'pool-3', src: '/images/pool/pool-3.jpg', alt: 'Espace détente au bord de la piscine', category: 'pool' },

  { id: 'spa-1', src: '/images/spa/spa-1.jpg', alt: 'Cabine de soin du spa', category: 'spa' },
  { id: 'spa-2', src: '/images/spa/spa-2.jpg', alt: 'Ambiance zen du spa', category: 'spa' },
  { id: 'spa-3', src: '/images/spa/spa-3.jpg', alt: 'Salle de massage apaisante', category: 'spa' },

  { id: 'events-1', src: '/images/events/events-1.jpg', alt: 'Salle de réunion équipée', category: 'events' },
  { id: 'events-2', src: '/images/events/events-2.jpg', alt: 'Salle de conférence professionnelle', category: 'events' },
  { id: 'events-3', src: '/images/events/events-3.jpg', alt: 'Espace de réception pour événements', category: 'events' },

  { id: 'discover-1', src: '/images/discover/antsirabe-1.jpg', alt: "Rue d'Antsirabe avec architecture coloniale", category: 'discover' },
  { id: 'discover-2', src: '/images/discover/antsirabe-2.jpg', alt: 'Paysage des hauts-plateaux malgaches', category: 'discover' },
  { id: 'discover-3', src: '/images/discover/antsirabe-3.jpg', alt: "Vue d'Antsirabe", category: 'discover' },
  { id: 'discover-4', src: '/images/discover/garden-1.jpg', alt: 'Jardin tropical luxuriant', category: 'discover' },

  { id: 'gallery-1', src: '/images/gallery/lobby-1.jpg', alt: "Hall d'accueil élégant du Royal Palace", category: 'gallery' },
]

export const getImagesByCategory = (category: GalleryImage['category']) =>
  galleryImages.filter((img) => img.category === category)

export default galleryImages
