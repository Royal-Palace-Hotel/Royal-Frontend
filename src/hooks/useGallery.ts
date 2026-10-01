import { useEffect, useState } from 'react'
import { api } from '@/utils/api'
import staticImages from '@/data/gallery'
import type { GalleryImage } from '@/types'

/**
 * Images de la galerie, administrables depuis le back-office.
 *
 * Le repli sur `src/data/gallery.ts` garde les pages affichables si l'API est
 * injoignable — même principe que les autres contenus dans `utils/api.ts`.
 * La réponse est mise en cache au niveau du module : les pages affichent
 * plusieurs catégories et ne doivent pas refaire la requête à chaque montage.
 */
let cache: GalleryImage[] | null = null
let inFlight: Promise<GalleryImage[]> | null = null

async function loadGallery(): Promise<GalleryImage[]> {
  if (cache) return cache
  if (!inFlight) {
    inFlight = api.getGallery()
      .then((response) => {
        const rows = (response.data as GalleryImage[] | undefined) ?? staticImages
        cache = rows.length > 0 ? rows : staticImages
        return cache
      })
      .catch(() => staticImages)
      .finally(() => { inFlight = null })
  }
  return inFlight
}

export function useGalleryImages(category?: GalleryImage['category']) {
  const [images, setImages] = useState<GalleryImage[]>(() => (
    cache ? filter(cache, category) : filter(staticImages, category)
  ))

  useEffect(() => {
    let cancelled = false
    loadGallery().then((rows) => {
      if (!cancelled) setImages(filter(rows, category))
    })
    return () => { cancelled = true }
  }, [category])

  return images
}

function filter(images: GalleryImage[], category?: GalleryImage['category']) {
  return category ? images.filter((image) => image.category === category) : images
}
