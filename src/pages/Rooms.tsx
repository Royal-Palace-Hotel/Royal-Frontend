import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import PageHero from '@/components/PageHero'
import AnimatedSection from '@/components/AnimatedSection'
import SectionHeading from '@/components/SectionHeading'
import RoomCard from '@/components/RoomCard'
import ImageGallery from '@/components/ImageGallery'
import { rooms } from '@/data/rooms'
import { getImagesByCategory } from '@/data/gallery'
import { formatCurrency } from '@/utils/helpers'

export default function Rooms() {
  const { t } = useTranslation()
  const roomImages = getImagesByCategory('rooms')

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
              <RoomCard room={room} featured={room.id === 'suite'} />
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
                    {t(`roomsData.${r.translationKey}.name`)}
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
                  <td key={r.id} className="px-6 py-4">{t(`roomsData.${r.translationKey}.view`)}</td>
                ))}
              </tr>
              <tr className="bg-cream/50">
                <td className="px-6 py-4 font-medium text-gray-500">{t('rooms.bedType')}</td>
                {rooms.map((r) => (
                  <td key={r.id} className="px-6 py-4">{t(`roomsData.${r.translationKey}.bedType`)}</td>
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
