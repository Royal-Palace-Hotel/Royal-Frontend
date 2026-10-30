import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CarTaxiFront,
  Waves,
  Hammer,
  Droplets,
  MapPin,
  Bus,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from 'lucide-react'
import CtaBanner from '@/components/CtaBanner'
import AnimatedSection from '@/components/AnimatedSection'

interface GalleryItem {
  src: string
  title: string
}

const galleryPhotos: GalleryItem[] = [
  { src: '/images/discover/antsirabe-1.jpg', title: "Gare d'Antsirabe & Pousse-pousse" },
  { src: '/images/discover/antsirabe-2.jpg', title: "Avenue & Centre d'Antsirabe" },
  { src: '/images/discover/antsirabe-3.jpg', title: 'Hauts plateaux & Rizières' },
  { src: '/images/discover/garden-1.jpg', title: 'Sources thermales & Jardins' },
]

export default function Discover() {
  const { t } = useTranslation()
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setActivePhotoIndex(index)
  const closeLightbox = () => setActivePhotoIndex(null)
  const prevPhoto = () =>
    setActivePhotoIndex((curr) =>
      curr === null ? null : (curr - 1 + galleryPhotos.length) % galleryPhotos.length
    )
  const nextPhoto = () =>
    setActivePhotoIndex((curr) =>
      curr === null ? null : (curr + 1) % galleryPhotos.length
    )

  const activities = [
    {
      id: 'pousse',
      Icon: CarTaxiFront,
      image: '/images/discover/antsirabe-1.jpg',
      title: t('discover.activity1Title', 'Tour en pousse-pousse'),
      text: t(
        'discover.activity1Text',
        "Découvrez la ville à bord d'un pousse-pousse coloré, moyen de transport emblématique d'Antsirabe."
      ),
    },
    {
      id: 'lac',
      Icon: Waves,
      image: '/images/discover/antsirabe-2.jpg',
      title: t('discover.activity2Title', 'Lac Andraikiba'),
      text: t(
        'discover.activity2Text',
        'Un lac de cratère paisible, idéal pour une promenade ou un pique-nique en pleine nature.'
      ),
    },
    {
      id: 'artisanat',
      Icon: Hammer,
      image: '/images/discover/antsirabe-3.jpg',
      title: t('discover.activity3Title', "Ateliers d'artisanat"),
      text: t(
        'discover.activity3Text',
        'Visitez les ateliers de corne de zébu, de pierres précieuses et de miniatures automobiles.'
      ),
    },
    {
      id: 'thermales',
      Icon: Droplets,
      image: '/images/discover/garden-1.jpg',
      title: t('discover.activity4Title', 'Sources thermales'),
      text: t(
        'discover.activity4Text',
        "Profitez des vertus des eaux thermales, réputées depuis l'époque coloniale."
      ),
    },
  ]

  return (
    <div className="bg-white">
      {/* 1. HERO matching Mockup media_1793344204064_99a55d15.jpg */}
      <section className="relative h-[85vh] min-h-[520px] max-h-[780px] flex items-center justify-center text-center overflow-hidden pt-16">
        <img
          src="/images/discover/antsirabe-hero.jpg"
          alt="Antsirabe"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[heroZoom_14s_ease-out_forwards]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
        <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-6" direction="fade">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-wide mb-3 drop-shadow-md">
            {t('discover.heroTitle', 'Découvrir Antsirabe')}
          </h1>
          <p className="font-serif italic text-base sm:text-xl md:text-2xl text-[#E8D7B8] font-light mb-4 drop-shadow">
            {t('discover.heroSubtitle', 'La ville aux mille pousse-pousse')}
          </p>
          <div className="flex items-center justify-center gap-3 text-[#C6A87D] opacity-80">
            <span className="w-8 h-[1px] bg-[#C6A87D]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C6A87D]" />
            <span className="w-8 h-[1px] bg-[#C6A87D]" />
          </div>
        </AnimatedSection>
      </section>

      {/* 2. SECTION INTRO : Antsirabe, perle des hauts-plateaux malgaches */}
      <AnimatedSection className="py-20 md:py-28 px-6 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2B2B2B] font-normal leading-tight mb-6">
          {t('discover.introTitle', 'Antsirabe, perle des hauts-plateaux malgaches')}
        </h2>
        <p className="text-xs sm:text-sm md:text-[15px] text-gray-500 font-light leading-relaxed max-w-3xl mx-auto">
          {t(
            'discover.introText',
            "Fondée par les missionnaires norvégiens au XIXe siècle, Antsirabe est réputée pour son climat frais, son architecture coloniale, ses eaux thermales et ses célèbres pousse-pousse colorés. Située dans la province du Vakinankaratra, la ville est une étape incontournable sur la RN7, la route qui traverse Madagascar du nord au sud."
          )}
        </p>
      </AnimatedSection>

      {/* 3. SECTION ACTIVITÉS LOCALES */}
      <section className="bg-[#FAF7F2] py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] text-center font-normal tracking-wide mb-14" direction="up">
            {t('discover.activitiesTitle', 'Activités locales')}
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {activities.map((act, index) => (
              <AnimatedSection
                key={act.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row border border-black/5"
                delay={index * 0.08}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden shrink-0">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-center">
                  <act.Icon className="text-[#C6A87D] mb-3" size={24} />
                  <h3 className="font-serif text-lg sm:text-xl text-[#2B2B2B] font-medium mb-2">
                    {act.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
                    {act.text}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION À PROXIMITÉ & TRANSPORT */}
      <AnimatedSection className="bg-white py-16 md:py-24 px-6" direction="up">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Colonne 1: À proximité */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-[#C6A87D]" size={22} />
              <h3 className="font-serif text-xl sm:text-2xl text-[#2B2B2B] font-normal">
                {t('discover.attractionsTitle', 'À proximité')}
              </h3>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-gray-600 font-light">
              <li className="flex items-start gap-2.5">
                <span className="text-[#C6A87D] text-lg leading-none">•</span>
                <span>{t('discover.attraction1', 'Parc national de Ranomafana (à la journée)')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C6A87D] text-lg leading-none">•</span>
                <span>{t('discover.attraction2', 'Route des Baobabs (excursion)')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C6A87D] text-lg leading-none">•</span>
                <span>{t('discover.attraction3', 'Marché artisanal local')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C6A87D] text-lg leading-none">•</span>
                <span>{t('discover.attraction4', "Cathédrale d'Antsirabe")}</span>
              </li>
            </ul>
          </div>

          {/* Colonne 2: Transport & Accès */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Bus className="text-[#C6A87D]" size={22} />
              <h3 className="font-serif text-xl sm:text-2xl text-[#2B2B2B] font-normal">
                {t('discover.transportTitle', 'Transport & Accès')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              {t(
                'discover.transportText',
                "Antsirabe se situe à environ 170 km au sud d'Antananarivo (environ 3h30 de route par la RN7). Le Royal Palace peut organiser vos transferts depuis l'aéroport d'Ivato ou toute autre destination."
              )}
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* 5. SECTION GALERIE PHOTO */}
      <section className="bg-[#FAF7F2] py-20 md:py-28 px-6">
        <AnimatedSection className="max-w-6xl mx-auto text-center" direction="up">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C6A87D] font-medium mb-3">
            {t('home.galleryEyebrow', 'GALERIE PHOTO')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal mb-12">
            {t('discover.heroTitle', 'Découvrir Antsirabe')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPhotos.map((photo, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn
                    size={28}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* 6. BANNIÈRE PRÉ-FOOTER CTA */}
      <CtaBanner />

      {/* LIGHTBOX MODALE PLEIN ÉCRAN */}
      {activePhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevPhoto()
            }}
            className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            aria-label="Photo précédente"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[activePhotoIndex].src}
              alt={galleryPhotos[activePhotoIndex].title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white/80 text-sm mt-4 font-serif">
              {galleryPhotos[activePhotoIndex].title}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextPhoto()
            }}
            className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            aria-label="Photo suivante"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  )
}
