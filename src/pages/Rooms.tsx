import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Check, ArrowRight } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import CtaBanner from '@/components/CtaBanner'

interface RoomItem {
  id: string
  title: string
  specs: string
  size: string
  bed: string
  description: string
  image: string
  price: string
  amenities: string[]
}

const accommodations: RoomItem[] = [
  {
    id: 'standard',
    title: 'Chambres standard',
    specs: 'X M2 / 1 LIT KING',
    size: '24 m²',
    bed: '1 Lit King size',
    description:
      'Chaleureuse et fonctionnelle, la Chambre Standard offre tout le confort nécessaire pour un séjour relaxant ou un déplacement professionnel à Antsirabe.',
    image: '/images/imageOrigine/hotel-room-2021-08-26-17-52-59-utc.jpg',
    price: '280 000 Ar / nuit',
    amenities: ['Lit King Size haut de gamme', 'Wi-Fi haut débit gratuit', 'Salle de bain privative', 'Smart TV écran plat', 'Climatisation réversible'],
  },
  {
    id: 'superieure',
    title: 'Chambres supérieures',
    specs: 'X M2 / 1 LIT KING',
    size: '30 m²',
    bed: '1 Lit King size',
    description:
      'Plus spacieuse et lumineuse, la Chambre Supérieure dispose d’un coin salon élégant et d’une vue apaisante sur la ville ou nos jardins.',
    image: '/images/imageOrigine/bedroom-with-wooden-ceiling-2021-08-26-15-43-53-utc.jpg',
    price: '380 000 Ar / nuit',
    amenities: ['Lit King Size confort palace', 'Wi-Fi haut débit', 'Minibar & machine à café', 'Bureau de travail', 'Coffre-fort'],
  },
  {
    id: 'deluxe',
    title: 'Chambres Deluxe',
    specs: 'X M2 / 1 LIT KING',
    size: '38 m²',
    bed: '1 Lit King size',
    description:
      'Un écrin de raffinement avec des boiseries artisanales de Madagascar, une salle de bain en marbre et un balcon privatif pour savourer le calme.',
    image: '/images/imageOrigine/bed-setting-2021-08-28-22-29-35-utc.jpg',
    price: '520 000 Ar / nuit',
    amenities: ['Balcon privatif avec vue', 'Grande baignoire & douche pluie', 'Coin salon raffiné', 'Service en chambre 24/7', 'Machine Nespresso'],
  },
  {
    id: 'suite',
    title: 'Suites',
    specs: 'X M2 / 1 LIT KING',
    size: '56 m²',
    bed: '1 Lit King size',
    description:
      'Composée d’une vaste chambre séparée et d’un salon de réception majestueux, la Suite Royale incarne l’apogée du luxe et de l’élégance hôtelière.',
    image: '/images/imageOrigine/romantic-honeymoon-hotel-suite-2022-10-28-21-38-26-utc.jpg',
    price: '850 000 Ar / nuit',
    amenities: ['Salon de réception privé', 'Double balcon panoramique', 'Bain à remous privatif', 'Accueil VIP & fruits frais', 'Majordome dédié sur demande'],
  },
  {
    id: 'appartement',
    title: 'Appartements',
    specs: 'X M2 / 2 LIT KING / KITCHENETTE / SALON',
    size: '78 m²',
    bed: '2 Lits King size',
    description:
      'L’espace idéal pour les séjours en famille ou de longue durée, équipé d’une kitchenette moderne tout équipée, d’un salon chaleureux et de deux chambres séparées.',
    image: '/images/imageOrigine/stylish-interior-design-of-living-room-2022-12-07-04-20-46-utc-1.jpg',
    price: '1 100 000 Ar / nuit',
    amenities: ['Kitchenette moderne équipée', 'Grand salon familial', '2 chambres indépendantes', '2 salles de bain privatives', 'Espace repas convivial'],
  },
]

export default function Rooms() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="bg-white">
      {/* 1. Hero Section matching Screenshot 2 avec photo officielle */}
      <HeroBanner
        image="/images/imageOrigine/Photo-Chambres-et-Suites-1200.jpg"
        stars={3}
        eyebrow="CHAMBRE ET SUITE"
        title="Votre parenthèse"
        titleItalic="confort"
        buttonText="RÉSERVEZ"
        buttonLink="/contact#booking"
      />

      {/* 2. Introduction Section (White Background) */}
      <section className="py-20 md:py-28 px-6 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-8">
          Découvrez Antsirabe <span className="italic font-normal">autrement</span>
        </h2>
        <div className="space-y-4 text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
          <p>
            Notre hôtel vous ouvre ses portes pour une expérience unique alliant sérénité et convivialité.
            Un lieu idéal pour se détendre, profiter d’un sommeil réparateur et savourer des instants de calme.
          </p>
          <p>
            Que vous soyez en voyage d’affaires ou d’agrément, nous vous promettons un séjour ressourçant.
          </p>
        </div>
      </section>

      {/* 3. Nos Hébergements Accordion Section */}
      <section className="bg-[#FAF3EA] py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif italic text-3xl md:text-4xl text-center text-charcoal mb-14 font-normal">
            Nos Hébergements
          </h2>

          <div className="divide-y divide-charcoal/15 border-t border-b border-charcoal/15">
            {accommodations.map((item) => {
              const isOpen = openId === item.id
              return (
                <div key={item.id} className="transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full py-6 md:py-8 flex items-center justify-between text-left group transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                      <span className="font-serif text-xl sm:text-2xl text-charcoal group-hover:text-gold-700 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[11px] sm:text-xs text-charcoal/60 tracking-wider font-light uppercase">
                        {item.specs}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-charcoal/30 flex items-center justify-center shrink-0 ml-4 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-white transition-all">
                      {isOpen ? (
                        <Minus size={16} className="text-charcoal group-hover:text-white" />
                      ) : (
                        <Plus size={16} className="text-charcoal group-hover:text-white" />
                      )}
                    </div>
                  </button>

                  {/* Expandable details */}
                  {isOpen && (
                    <div className="pb-8 pt-2 animate-fade-in">
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-charcoal/5 shadow-sm">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm text-charcoal/80 leading-relaxed font-light">
                            {item.description}
                          </p>
                          <div className="text-xs text-gold-700 font-medium">
                            {item.price}
                          </div>
                          <div className="space-y-2 pt-2">
                            {item.amenities.map((amenity, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-charcoal/70">
                                <Check size={14} className="text-gold-600 shrink-0" />
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-4">
                            <Link
                              to={`/contact?room=${item.id}#booking`}
                              className="inline-flex items-center gap-2 bg-charcoal hover:bg-black text-white text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all"
                            >
                              <span>Réserver cette chambre</span>
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Pre-footer CTA banner */}
      <CtaBanner />
    </div>
  )
}
