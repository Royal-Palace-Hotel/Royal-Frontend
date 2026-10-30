import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Star, X } from 'lucide-react'
import HeroBanner from '@/components/HeroBanner'
import CtaBanner from '@/components/CtaBanner'

interface FaqItem {
  question: string
  answer: string | React.ReactNode
}

const faqs: FaqItem[] = [
  {
    question: "Quelle est la politique d'annulation ?",
    answer: (
      <div className="space-y-4 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        <div>
          <p className="font-medium text-charcoal mb-1">Chambre et hébergement :</p>
          <p>
            Vous pouvez annuler gratuitement votre séjour jusqu’à 72 heures avant votre arrivée.
            En cas d’annulation tardive ou de non-présentation, le montant de la première nuitée sera facturé.
          </p>
        </div>
        <div>
          <p className="font-medium text-charcoal mb-1">Réservations d’événements et groupes :</p>
          <p>
            L’annulation est gratuite jusqu’à 30 jours avant l’événement. Un acompte de 30 % est demandé à la confirmation.
          </p>
        </div>
      </div>
    ),
  },
  {
    question: "Quelles sont les heures d'arrivée et de départ ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        L’enregistrement s’effectue à partir de 14h00 et les départs sont possibles jusqu’à 11h00.
      </p>
    ),
  },
  {
    question: "Est-il possible de partir plus tard que midi ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        Oui, un départ tardif est possible selon les disponibilités du jour auprès de notre réception.
      </p>
    ),
  },
  {
    question: "Est-ce que les animaux de compagnie sont acceptés ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        Pour des raisons d’hygiène et de tranquillité, les animaux de compagnie ne sont pas admis.
      </p>
    ),
  },
  {
    question: "Y a-t-il une liaison entre la gare et l'hôtel ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        Oui, nous pouvons organiser votre transfert privé sur simple demande préalable.
      </p>
    ),
  },
  {
    question: "Où puis-je me stationner ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        L’hôtel dispose d’un parking privé, clos et gardé 24h/24, entièrement gratuit pour nos clients.
      </p>
    ),
  },
]

const galleryImages = [
  { src: '/images/imageOrigine/Photo-Gallerie-1-1200.jpg', title: 'Façade & Piscine' },
  { src: '/images/imageOrigine/Photo-Gallerie-2-1200.jpg', title: 'Jardin & Cadre' },
  { src: '/images/imageOrigine/Photo-Gallerie-3-1200.jpg', title: 'Intérieur raffiné' },
  { src: '/images/imageOrigine/Photo-Gallerie-4-1200.jpg', title: 'Restaurant & Gastronomie' },
  { src: '/images/imageOrigine/Photo-Gallerie-5-1200.jpg', title: 'Chambre confort' },
  { src: '/images/imageOrigine/Photo-Gallerie-6-1200.jpg', title: 'Détente au bord de l’eau' },
]

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx)
  }

  return (
    <div className="bg-white">
      {/* 1. Hero matching Accueil Mockup avec la photo d'origine */}
      <HeroBanner
        image="/images/imageOrigine/Photo-titre-1-1920.jpg"
        stars={3}
        eyebrow="ROYAL PALACE"
        title="Un emplacement parfait pour vos"
        titleItalic="escapades à Antsirabe"
        buttonText="RÉSERVEZ"
        buttonLink="/contact#booking"
      />

      {/* 2. Section: Un havre de sérénité et de raffinement au cœur du Vakinankaratra */}
      <section className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide leading-tight">
              Un havre de sérénité et de raffinement au cœur du{' '}
              <span className="italic font-normal">Vakinankaratra</span>
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              <p>
                Niché au cœur d’Antsirabe, la célèbre « ville d’eau » des hauts plateaux de Madagascar,
                l’Hôtel Royal Palace vous accueille dans un cadre alliant élégance intemporelle et douceur de vivre.
              </p>
              <p>
                Que vous soyez en voyage d’affaires, en escapade romantique ou en vacances en famille,
                notre hôtel 3 étoiles met à votre disposition un service d’exception, une table gourmande
                et un espace bien-être conçu pour vous ressourcer.
              </p>
              <p>
                Chaque détail a été pensé pour que votre séjour soit une véritable parenthèse de sérénité.
              </p>
            </div>
          </div>

          {/* Right Asymmetric Photos */}
          <div className="relative w-full max-w-md mx-auto lg:max-w-none h-[380px] sm:h-[460px] flex items-center justify-center">
            {/* Top Right Photo: Havre de paix */}
            <div className="absolute top-0 right-0 w-[78%] h-[68%] rounded-sm overflow-hidden shadow-lg border-2 border-white">
              <img
                src="/images/imageOrigine/premiere-page-havre-de-paix-1200.jpg"
                alt="Façade et piscine Royal Palace"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Left Photo: Chambre & suite */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-sm overflow-hidden shadow-xl border-4 border-white z-10">
              <img
                src="/images/imageOrigine/Photo-Chambres-et-Suites-1200.jpg"
                alt="Chambre de luxe"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: 4 Grids Services avec photos d'origine */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Tile 1: Chambres */}
        <div className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden group">
          <img
            src="/images/imageOrigine/Photo-Chambres-et-Suites-1200.jpg"
            alt="Chambres, Suites & Appartements"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 font-normal tracking-wide">
              Chambres, Suites & Appartements
            </h3>
            <Link
              to="/chambres-suites"
              className="bg-[#FAF3EA] hover:bg-white text-charcoal text-[11px] uppercase tracking-widest font-medium px-8 py-3 rounded-full transition-all shadow-md transform group-hover:-translate-y-0.5"
            >
              DÉCOUVRIR
            </Link>
          </div>
        </div>

        {/* Tile 2: Bar & Restaurants */}
        <div className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden group">
          <img
            src="/images/imageOrigine/Photo-Bar-et-Restaurants-1200.jpg"
            alt="Bar & Restaurants"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 font-normal tracking-wide">
              Bar & Restaurants
            </h3>
            <Link
              to="/restaurant"
              className="bg-[#FAF3EA] hover:bg-white text-charcoal text-[11px] uppercase tracking-widest font-medium px-8 py-3 rounded-full transition-all shadow-md transform group-hover:-translate-y-0.5"
            >
              DÉCOUVRIR
            </Link>
          </div>
        </div>

        {/* Tile 3: Bien-être */}
        <div className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden group">
          <img
            src="/images/imageOrigine/Photo-Bien-etre-1200.jpg"
            alt="Bien-être"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 font-normal tracking-wide">
              Bien-être
            </h3>
            <Link
              to="/piscine-bien-etre"
              className="bg-[#FAF3EA] hover:bg-white text-charcoal text-[11px] uppercase tracking-widest font-medium px-8 py-3 rounded-full transition-all shadow-md transform group-hover:-translate-y-0.5"
            >
              DÉCOUVRIR
            </Link>
          </div>
        </div>

        {/* Tile 4: Événements */}
        <div className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden group">
          <img
            src="/images/imageOrigine/Photo-Evenements-1200.jpg"
            alt="Événements"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 font-normal tracking-wide">
              Événements
            </h3>
            <Link
              to="/offre-sur-mesure"
              className="bg-[#FAF3EA] hover:bg-white text-charcoal text-[11px] uppercase tracking-widest font-medium px-8 py-3 rounded-full transition-all shadow-md transform group-hover:-translate-y-0.5"
            >
              DÉCOUVRIR
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Section: Carte interactive pleine largeur */}
      <section className="w-full bg-[#FAF3EA] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-md border border-charcoal/10 bg-gray-100">
            <iframe
              title="Carte Antsirabe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src="https://maps.google.com/maps?q=-19.8655,47.0335&z=15&output=embed"
            />
          </div>
        </div>
      </section>

      {/* 5. Section: Nos autres établissements */}
      <section className="py-20 md:py-28 px-6 max-w-6xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-14 font-normal">
          Nos autres établissements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FAF3EA]/40 border border-charcoal/10 rounded-2xl p-8 flex flex-col items-center justify-between text-center hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-serif text-xl sm:text-2xl text-charcoal mb-2 font-normal">
                Hôtel des Thermes
              </h4>
              <div className="text-gold-700 text-[11px] uppercase tracking-widest mb-4 font-medium">
                Antsirabe, Madagascar
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
                L’élégance historique et les bienfaits des sources thermales au cœur de la ville d’eaux.
              </p>
            </div>
            <Link
              to="/contact"
              className="bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal text-[11px] uppercase tracking-widest font-medium px-7 py-2.5 rounded-full transition-all border border-charcoal/5"
            >
              EN SAVOIR PLUS
            </Link>
          </div>

          <div className="bg-[#FAF3EA]/40 border border-charcoal/10 rounded-2xl p-8 flex flex-col items-center justify-between text-center hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-serif text-xl sm:text-2xl text-charcoal mb-2 font-normal">
                Le Relais de la Reine
              </h4>
              <div className="text-gold-700 text-[11px] uppercase tracking-widest mb-4 font-medium">
                Isalo, Madagascar
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
                Une oasis d’exception nichée au pied des majestueux massifs ruiniformes de l’Isalo.
              </p>
            </div>
            <Link
              to="/contact"
              className="bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal text-[11px] uppercase tracking-widest font-medium px-7 py-2.5 rounded-full transition-all border border-charcoal/5"
            >
              EN SAVOIR PLUS
            </Link>
          </div>

          <div className="bg-[#FAF3EA]/40 border border-charcoal/10 rounded-2xl p-8 flex flex-col items-center justify-between text-center hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-serif text-xl sm:text-2xl text-charcoal mb-2 font-normal">
                Le Jardin du Roy
              </h4>
              <div className="text-gold-700 text-[11px] uppercase tracking-widest mb-4 font-medium">
                Isalo, Madagascar
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
                Une architecture en pierres taillées et un parc luxuriant pour une immersion totale dans la nature.
              </p>
            </div>
            <Link
              to="/contact"
              className="bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal text-[11px] uppercase tracking-widest font-medium px-7 py-2.5 rounded-full transition-all border border-charcoal/5"
            >
              EN SAVOIR PLUS
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Section: Témoignage client avec photo Sophie d'origine */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <img
          src="/images/imageOrigine/Photo-Piscine_3.jpg"
          alt="Piscine Royal Palace"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center text-white">
          {/* Avatar original */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-xl mb-6">
            <img
              src="/images/imageOrigine/sophiz.jpg"
              alt="Sophie D."
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 text-gold-400 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-white/95 leading-relaxed mb-6 font-normal">
            « Un séjour inoubliable au Royal Palace. Le cadre est magnifique, la piscine et le spa sont une pure merveille de détente, et le personnel est aux petits soins. La meilleure adresse d’Antsirabe ! »
          </blockquote>

          <div className="text-xs uppercase tracking-widest text-white/70">
            Sophie & Marc D. — <span className="text-gold-400">Clients vérifiés</span>
          </div>
        </div>
      </section>

      {/* 7. Section: Galerie photo avec les 6 photos officielles */}
      <section className="py-20 md:py-28 px-6 max-w-6xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-14 font-normal">
          Galerie photo
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(img.src)}
              className="relative aspect-[4/3] rounded-sm overflow-hidden cursor-pointer group shadow-sm"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs uppercase tracking-widest font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Section: FAQ */}
      <section className="bg-[#FAF3EA] py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center text-charcoal tracking-wide mb-14 font-normal">
            FAQ
          </h2>

          <div className="divide-y divide-charcoal/10 border-t border-b border-charcoal/10">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className="transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="font-serif text-base sm:text-lg text-charcoal group-hover:text-gold-700 transition-colors font-normal">
                      {faq.question}
                    </span>
                    <div className="shrink-0 ml-4">
                      {isOpen ? (
                        <ChevronUp size={18} className="text-charcoal/70" />
                      ) : (
                        <ChevronDown size={18} className="text-charcoal/70" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pb-6 pt-1 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 9. Pre-footer CTA */}
      <CtaBanner />

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedPhoto}
              alt="Aperçu galerie"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
