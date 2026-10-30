import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import PageHero from '@/components/PageHero'
import AnimatedSection from '@/components/AnimatedSection'
import SectionHeading from '@/components/SectionHeading'
import RoomCard from '@/components/RoomCard'
import ImageGallery from '@/components/ImageGallery'
import { api } from '@/utils/api'
import { useGalleryImages } from '@/hooks/useGallery'
import { formatCurrency } from '@/utils/helpers'
import type { Room } from '@/types'

export default function Rooms() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availability, setAvailability] = useState<Record<string, { availableRooms: number; available: boolean }>>({})
  const roomImages = useGalleryImages('rooms')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const requestedRooms = searchParams.get('rooms')
  const english = i18n.resolvedLanguage?.startsWith('en')

  /**
   * Vue et literie, dans l'ordre : ce qui est saisi au back-office, sinon la
   * traduction livrée pour les quatre chambres d'origine, sinon un tiret.
   *
   * Le dernier repli n'est pas décoratif : `t()` renvoie la clé elle-même
   * quand elle n'existe pas. Sans lui, une chambre créée au back-office
   * affichait « roomsData.<clé>.view » au visiteur.
   */
  const detail = (room: Room, field: 'view' | 'bedType') => {
    const saved = english ? room[`${field}En` as const] : room[field]
    if (saved) return saved
    return t(`roomsData.${room.translationKey}.${field}`, { defaultValue: '' }) || '—'
  }

  useEffect(() => {
    async function fetchRooms() {
      const response = await api.getRooms()
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setRooms(response.data)
      }
      setLoading(false)
    }
    fetchRooms()
  }, [])

  /**
   * Un seul appel pour toutes les chambres : le calendrier renvoie les unités
   * libres par nuit, et la disponibilité d'un séjour est celle de sa pire nuit.
   * On interrogeait auparavant l'API une fois par chambre.
   */
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setAvailability({})
      return
    }

    const startDate = checkIn
    const endDate = checkOut
    let active = true
    const requestedCount = Number(requestedRooms)
    const roomCount = Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : 1

    async function fetchAvailability() {
      const response = await api.getAvailabilityCalendar(startDate, endDate)
      if (!active || response.error || !response.data) return

      const next: Record<string, { availableRooms: number; available: boolean }> = {}
      for (const room of response.data) {
        const free = room.days.length === 0 ? 0 : Math.min(...room.days.map((day) => day.free))
        // Les cartes sont identifiées par le slug : c'est ce que l'API publique
        // expose comme `id` d'une chambre.
        next[room.slug] = { availableRooms: free, available: free >= roomCount }
      }
      setAvailability(next)
    }

    fetchAvailability()
    return () => {
      active = false
    }
  }, [checkIn, checkOut, requestedRooms])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load rooms: {error}</p>
          <button onClick={() => window.location.reload()} className="btn-gold">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHero image="/images/rooms/room-3.jpg" title={t('rooms.heroTitle')} subtitle={t('rooms.heroSubtitle')} />

      {/* Intro */}
      <AnimatedSection className="container-luxe py-20 md:py-24">
        <SectionHeading eyebrow={t('common.ourStory')} title={t('rooms.introTitle')} text={t('rooms.introText')} />
      </AnimatedSection>

      {/* Amenities */}
      <section className="bg-cream py-16">
        <div className="container-luxe">
          <h3 className="font-serif text-2xl text-center mb-10">{t('rooms.amenitiesTitle')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {(t('rooms.amenities', { returnObjects: true }) as string[]).map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-charcoal">
                <Check size={16} className="text-gold-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room cards grid */}
      <AnimatedSection className="container-luxe py-20 md:py-24">
        <SectionHeading title={t('rooms.compareTitle')} text={t('rooms.compareText')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {rooms.map((room, idx) => (
            <AnimatedSection key={room.id} delay={idx * 0.08}>
              <RoomCard room={room} featured={room.id === 'suite'} availability={availability[room.slug]} />
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>

      {/* Comparison table (desktop) */}
      <section className="container-luxe pb-20 hidden lg:block">
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-charcoal text-white">
              <tr>
                <th className="text-left px-6 py-4 font-serif text-base">&nbsp;</th>
                {rooms.map((r) => (
                  <th key={r.id} className="text-left px-6 py-4 font-serif text-base">
                    {(english ? r.nameEn : r.name) || t(`roomsData.${r.translationKey}.name`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-500">{t('rooms.size')}</td>
                {rooms.map((r) => (
                  <td key={r.id} className="px-6 py-4">{r.size} m²</td>
                ))}
              </tr>
              <tr className="bg-cream/50">
                <td className="px-6 py-4 font-medium text-gray-500">{t('rooms.guests')}</td>
                {rooms.map((r) => (
                  <td key={r.id} className="px-6 py-4">{r.maxGuests}</td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-500">{t('rooms.view')}</td>
                {rooms.map((r) => (
                  <td key={r.id} className="px-6 py-4">{detail(r, 'view')}</td>
                ))}
              </tr>
              <tr className="bg-cream/50">
                <td className="px-6 py-4 font-medium text-gray-500">{t('rooms.bedType')}</td>
                {rooms.map((r) => (
                  <td key={r.id} className="px-6 py-4">{detail(r, 'bedType')}</td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-500">{t('common.from')}</td>
                {rooms.map((r) => (
                  <td key={r.id} className="px-6 py-4 text-gold-600 font-serif text-lg">
                    {formatCurrency(r.price)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow={t('home.galleryEyebrow')} title={t('rooms.heroTitle')} />
          <div className="mt-14">
            <ImageGallery images={roomImages} columns={4} />
          </div>
        </div>
      </section>
    </>
  )
}
