import { useState } from 'react'
import { X, Sparkles, Clock } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import CtaBanner from '@/components/CtaBanner'

const spaTreatments = [
  { name: 'Massage Royal Signature aux huiles précieuses', duration: '75 min', price: '95 000 Ar', desc: 'Massage corps entier relaxant combinant les techniques orientales et occidentales, aux huiles d’ylang-ylang et de katrafay de Madagascar.' },
  { name: 'Soin du visage éclat & jeunesse', duration: '60 min', price: '75 000 Ar', desc: 'Nettoyage en profondeur, gommage doux aux pépites de vanille et masque hydratant aux actifs botaniques des hauts plateaux.' },
  { name: 'Gommage corporel au café & sucre de canne', duration: '45 min', price: '60 000 Ar', desc: 'Exfoliation tonifiante et adoucissante pour une peau veloutée et éclatante.' },
  { name: 'Bain aux fleurs et sels minéraux d’Antsirabe', duration: '45 min', price: '50 000 Ar', desc: 'Immersion apaisante dans une eau thermale enrichie aux pétales d’orchidées et sels bienfaisants.' },
  { name: 'Massage pierres chaudes volcaniques', duration: '90 min', price: '120 000 Ar', desc: 'Détente musculaire profonde grâce à la chaleur enveloppante des galets de basalte d’Itasy.' },
  { name: 'Escapade Sérénité en Duo', duration: '120 min', price: '210 000 Ar', desc: 'Bain thermal partagé, gommage et massage complet en cabine double avec coupe de champagne.' },
]

export default function Spa() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* 1. Hero matching Screenshot 4 avec la photo officielle Bien-être */}
      <HeroBanner
        image="/images/imageOrigine/Photo-Bien-etre-1200.jpg"
        stars={3}
        eyebrow="BIEN-ÊTRE"
        title="Votre parenthèse"
        titleItalic="relaxante"
        buttonText="RÉSERVEZ"
        buttonLink="/contact#booking"
      />

      {/* 2. Section 1: Bien-être et évasion (Piscine) avec photos d'origine */}
      <section className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide">
              Bien-être et <span className="italic font-normal">évasion</span>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              <p>Notre piscine est l’endroit parfait pour ralentir et profiter.</p>
              <p>
                On y nage pour se réveiller en douceur, on s’y rafraîchit en plein après-midi, ou on
                s’installe simplement au bord pour savourer un instant de calme.
              </p>
              <p>
                C’est un lieu convivial, où chacun trouve son rythme : plonger, jouer, se détendre ou
                lire au soleil.
              </p>
              <p>
                Et pour prolonger ce bien-être, notre Spa complète l’expérience avec des soins
                relaxants et des produits de qualité inspirés de notre savoir-faire local.
              </p>
            </div>
          </div>

          {/* Right Asymmetric Overlapping Photos */}
          <div className="relative w-full max-w-md mx-auto lg:max-w-none h-[380px] sm:h-[460px] flex items-center justify-center">
            {/* Top Large Photo: Piscine overview */}
            <div className="absolute top-0 right-0 w-[78%] h-[68%] rounded-sm overflow-hidden shadow-lg border-2 border-white">
              <img
                src="/images/imageOrigine/Photo-Piscine-2.webp"
                alt="Piscine vue d'en haut"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Left Overlapping Photo: Bord de piscine */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-sm overflow-hidden shadow-xl border-4 border-white z-10">
              <img
                src="/images/imageOrigine/Photo-Piscine-1.webp"
                alt="Bord de piscine"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 2: Notre Spa avec photos d'origine */}
      <section className="py-20 md:py-28 px-6 max-w-6xl mx-auto border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Asymmetric Overlapping Photos */}
          <div className="order-2 lg:order-1 relative w-full max-w-md mx-auto lg:max-w-none h-[420px] sm:h-[500px] flex items-center justify-center">
            {/* Top Left Photo: Spa lounge hallway */}
            <div className="absolute top-0 left-0 w-[70%] h-[78%] rounded-sm overflow-hidden shadow-lg border-2 border-white">
              <img
                src="/images/imageOrigine/Photo-Spa-1.webp"
                alt="Couloir et salon du Spa"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Right Overlapping Photo: Massage cabin */}
            <div className="absolute bottom-6 right-0 w-[58%] h-[50%] rounded-sm overflow-hidden shadow-2xl border-4 border-white z-10">
              <img
                src="/images/imageOrigine/Photo-Spa-2.webp"
                alt="Cabine de massage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide">
              Notre <span className="italic font-normal">Spa</span>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              <p>Plongez dans une ambiance apaisante et laissez-vous envelopper par la sérénité.</p>
              <p>
                Nos massages et soins, réalisés par des expertes, vous offrent un moment unique de
                relaxation.
              </p>
              <p>
                Chaque traitement associe savoir-faire local et produits de haute qualité pour un maximum
                de bien-être.
              </p>
              <p>
                Vivez une expérience sensorielle complète, où détente, confort et raffinement se
                rencontrent.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal font-medium text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all shadow-sm border border-charcoal/5"
              >
                DÉCOUVREZ NOS SERVICES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pre-footer CTA banner */}
      <CtaBanner />

      {/* Spa Services Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-gold-600" size={24} />
              <h3 className="font-serif text-2xl text-charcoal">
                Nos Soins & Rituels Bien-Être
              </h3>
            </div>

            <div className="divide-y divide-gray-100 space-y-4">
              {spaTreatments.map((tr, idx) => (
                <div key={idx} className="pt-4 first:pt-0">
                  <div className="flex justify-between items-baseline gap-4 mb-1">
                    <h4 className="font-serif text-base text-charcoal font-medium">{tr.name}</h4>
                    <span className="text-gold-700 font-semibold text-sm whitespace-nowrap">
                      {tr.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
                    <Clock size={12} />
                    <span>{tr.duration}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-light">{tr.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-400">
                Ouvert tous les jours de 9h00 à 20h00
              </span>
              <a
                href="tel:+261344904040"
                className="inline-flex items-center gap-2 bg-charcoal text-white text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-black transition-all"
              >
                <span>Réserver un soin</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
