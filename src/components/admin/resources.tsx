import { resolveImageUrl } from '@/utils/api'
import type { ResourceSpec } from './ResourceManager'

const price = (row: any) => row.price == null ? '—' : `${row.price} ${row.currency ?? ''}`.trim()
const truncate = (value: unknown, max = 60) => {
  const text = String(value ?? '')
  return text.length > max ? `${text.slice(0, max)}…` : text || '—'
}

export const GALLERY_CATEGORIES = [
  { value: 'hero', label: 'Bandeau d’accueil' },
  { value: 'rooms', label: 'Chambres' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'pool', label: 'Piscine' },
  { value: 'spa', label: 'Spa' },
  { value: 'events', label: 'Événements' },
  { value: 'discover', label: 'Découvrir' },
  { value: 'gallery', label: 'Galerie générale' },
]

export const resources: Record<string, ResourceSpec> = {
  rooms: {
    endpoint: '/admin/rooms',
    title: 'Chambres',
    addLabel: 'Ajouter une chambre',
    fields: [
      { key: 'slug', label: 'Identifiant d’URL (slug)', help: 'Minuscules et tirets, ex. suite-royale.' },
      { key: 'translationKey', label: 'Clé de traduction', optional: true },
      { key: 'name', label: 'Nom (FR)' },
      { key: 'nameEn', label: 'Nom (EN)' },
      { key: 'description', label: 'Description (FR)', type: 'textarea' },
      { key: 'descriptionEn', label: 'Description (EN)', type: 'textarea' },
      { key: 'price', label: 'Prix par nuit', type: 'number' },
      { key: 'currency', label: 'Devise' },
      { key: 'size', label: 'Superficie (m²)', type: 'number' },
      { key: 'maxGuests', label: 'Voyageurs maximum', type: 'number' },
      { key: 'totalUnits', label: 'Nombre d’unités', type: 'number' },
      { key: 'images', label: 'Photos de la chambre', type: 'imageList' },
      { key: 'amenities', label: 'Équipements', type: 'list', help: 'Un par ligne : wifi, tv, ac, minibar…' },
    ],
    defaults: { currency: 'EUR', totalUnits: '1', maxGuests: '2' },
    columns: [
      { label: 'Nom', value: (row) => row.name || row.slug },
      { label: 'Prix', value: price },
      { label: 'Capacité', value: (row) => `${row.maxGuests} pers. · ${row.totalUnits} unité(s)` },
      { label: 'Images', value: (row) => row.images?.length ?? 0 },
    ],
  },

  'menu-sections': {
    endpoint: '/admin/menu/sections',
    title: 'Sections de la carte',
    addLabel: 'Ajouter une section',
    fields: [
      { key: 'title', label: 'Nom de section (FR)' },
      { key: 'titleEn', label: 'Nom de section (EN)' },
      { key: 'sortOrder', label: 'Ordre d’affichage', type: 'number' },
    ],
    columns: [
      { label: 'Section', value: (row) => row.title },
      { label: 'Anglais', value: (row) => row.titleEn },
      { label: 'Ordre', value: (row) => row.sortOrder },
    ],
  },

  'menu-items': {
    endpoint: '/admin/menu/items',
    title: 'Plats et boissons',
    addLabel: 'Ajouter un plat',
    fields: [
      { key: 'name', label: 'Nom (FR)' },
      { key: 'nameEn', label: 'Nom (EN)' },
      { key: 'description', label: 'Description (FR)', type: 'textarea' },
      { key: 'descriptionEn', label: 'Description (EN)', type: 'textarea' },
      { key: 'price', label: 'Prix (Ar)', type: 'number' },
      {
        key: 'sectionId', label: 'Section',
        optionsFrom: { endpoint: '/admin/menu/sections', value: 'id', label: 'title' },
      },
      { key: 'sortOrder', label: 'Ordre d’affichage', type: 'number' },
    ],
    columns: [
      { label: 'Plat', value: (row) => row.name },
      { label: 'Prix', value: (row) => row.price },
      { label: 'Section', value: (row) => row.sectionId },
      { label: 'Ordre', value: (row) => row.sortOrder },
    ],
  },

  'event-rooms': {
    endpoint: '/admin/event-rooms',
    title: 'Salles de réunion',
    addLabel: 'Ajouter une salle',
    fields: [
      { key: 'key', label: 'Clé de traduction', optional: true },
      { key: 'name', label: 'Nom (FR)' },
      { key: 'nameEn', label: 'Nom (EN)' },
      { key: 'description', label: 'Description (FR)', type: 'textarea' },
      { key: 'descriptionEn', label: 'Description (EN)', type: 'textarea' },
      { key: 'image', label: 'Photo de la salle', type: 'image' },
      { key: 'capacity', label: 'Capacité', type: 'number', optional: true, nullWhenEmpty: true },
      { key: 'schedule', label: 'Horaires / disponibilité', optional: true, nullWhenEmpty: true },
      { key: 'price', label: 'Prix', type: 'number', optional: true, nullWhenEmpty: true },
      { key: 'currency', label: 'Devise', optional: true, nullWhenEmpty: true },
      { key: 'sortOrder', label: 'Ordre d’affichage', type: 'number' },
    ],
    columns: [
      { label: 'Salle', value: (row) => row.name || row.key },
      { label: 'Capacité', value: (row) => row.capacity ?? '—' },
      { label: 'Tarif', value: price },
      { label: 'Horaires', value: (row) => row.schedule || '—' },
    ],
  },

  spa: {
    endpoint: '/admin/spa',
    title: 'Soins du spa',
    addLabel: 'Ajouter un soin',
    fields: [
      { key: 'name', label: 'Nom du soin (FR)' },
      { key: 'nameEn', label: 'Nom du soin (EN)' },
      { key: 'duration', label: 'Durée (FR)', optional: true, nullWhenEmpty: true, help: 'ex. 60 minutes' },
      { key: 'durationEn', label: 'Durée (EN)', optional: true, nullWhenEmpty: true },
      { key: 'description', label: 'Description (FR)', type: 'textarea', optional: true, nullWhenEmpty: true },
      { key: 'descriptionEn', label: 'Description (EN)', type: 'textarea', optional: true, nullWhenEmpty: true },
      { key: 'price', label: 'Prix (Ar)', type: 'number' },
      { key: 'key', label: 'Clé de traduction', optional: true },
      { key: 'sortOrder', label: 'Ordre d’affichage', type: 'number' },
      { key: 'isActive', label: 'Visible sur le site', type: 'checkbox' },
    ],
    defaults: { isActive: 'true' },
    columns: [
      { label: 'Soin', value: (row) => row.name || row.key },
      { label: 'Durée', value: (row) => row.duration || '—' },
      { label: 'Prix', value: (row) => row.price },
      { label: 'Visible', value: (row) => (row.isActive ? 'Oui' : 'Non') },
    ],
  },

  gallery: {
    endpoint: '/admin/gallery',
    title: 'Galerie photo',
    addLabel: 'Ajouter une image',
    fields: [
      { key: 'src', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Texte alternatif (FR)', help: 'Décrit l’image pour les lecteurs d’écran.' },
      { key: 'altEn', label: 'Texte alternatif (EN)', optional: true, nullWhenEmpty: true },
      { key: 'category', label: 'Catégorie', type: 'select', options: GALLERY_CATEGORIES },
      { key: 'sortOrder', label: 'Ordre d’affichage', type: 'number' },
    ],
    defaults: { category: 'gallery' },
    columns: [
      {
        label: 'Aperçu',
        value: (row) => (
          <img src={resolveImageUrl(row.src)} alt="" loading="lazy"
            className="h-12 w-16 border border-gray-200 object-cover" />
        ),
      },
      { label: 'Description', value: (row) => truncate(row.alt, 48) },
      { label: 'Catégorie', value: (row) => GALLERY_CATEGORIES.find((c) => c.value === row.category)?.label ?? row.category },
      { label: 'Ordre', value: (row) => row.sortOrder },
    ],
  },

  discover: {
    endpoint: '/admin/discover',
    title: 'Page « Découvrir »',
    addLabel: 'Ajouter un élément',
    fields: [
      {
        key: 'type', label: 'Type', type: 'select',
        options: [
          { value: 'activity', label: 'Activité (encadré illustré)' },
          { value: 'attraction', label: 'À proximité (simple ligne)' },
        ],
      },
      { key: 'title', label: 'Titre (FR)' },
      { key: 'titleEn', label: 'Titre (EN)' },
      { key: 'text', label: 'Texte (FR)', type: 'textarea', optional: true, nullWhenEmpty: true },
      { key: 'textEn', label: 'Texte (EN)', type: 'textarea', optional: true, nullWhenEmpty: true },
      {
        key: 'icon', label: 'Icône', optional: true, nullWhenEmpty: true,
        help: 'Nom lucide-react : CarTaxiFront, Waves, Hammer, Droplets, MapPin…',
      },
      { key: 'image', label: 'Illustration', type: 'image', optional: true, nullWhenEmpty: true },
      { key: 'key', label: 'Clé de traduction', optional: true, nullWhenEmpty: true },
      { key: 'sortOrder', label: 'Ordre d’affichage', type: 'number' },
    ],
    defaults: { type: 'activity' },
    columns: [
      { label: 'Titre', value: (row) => row.title || row.key },
      { label: 'Type', value: (row) => (row.type === 'activity' ? 'Activité' : 'À proximité') },
      { label: 'Texte', value: (row) => truncate(row.text, 48) },
      { label: 'Ordre', value: (row) => row.sortOrder },
    ],
  },
}
