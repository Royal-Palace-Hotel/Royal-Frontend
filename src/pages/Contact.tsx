import { useState } from 'react'
import { Calendar, Users, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'
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
            En cas d’annulation tardive ou de non-présentation, le montant de la première nuitée (ou la totalité du séjour pour les réservations non remboursables) sera facturé.
          </p>
        </div>
        <div>
          <p className="font-medium text-charcoal mb-1">Réservations d’événements et groupes :</p>
          <p>
            L’annulation est gratuite jusqu’à 30 jours avant l’événement.
            Un acompte de 30 % sera demandé à la confirmation, remboursable selon les conditions prévues au contrat en cas d’annulation justifiée.
            En cas d’annulation tardive, l’acompte sera retenu, sans possibilité de remboursement, à titre d’indemnité.
          </p>
        </div>
      </div>
    ),
  },
  {
    question: "Quelles sont les heures d'arrivée et de départ ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        L’enregistrement s’effectue à partir de 14h00 et les départs sont possibles jusqu’à 11h00. Un check-in anticipé ou un check-out tardif peut être accordé selon les disponibilités du jour.
      </p>
    ),
  },
  {
    question: "Est-il possible de partir plus tard que midi ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        Oui, un départ tardif peut être arrangé avec notre réception selon l’occupation de l’hôtel. N’hésitez pas à nous en informer à votre arrivée pour que nous puissions organiser votre départ dans les meilleures conditions.
      </p>
    ),
  },
  {
    question: "Est-ce que les animaux de compagnie sont acceptés ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        Pour des raisons d’hygiène et pour garantir le confort et la tranquillité de l’ensemble de nos clients, les animaux domestiques ne sont pas admis au sein de l’établissement.
      </p>
    ),
  },
  {
    question: "Y a-t-il une liaison entre la gare et l'hôtel ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        Oui, nous pouvons assurer votre transfert privé depuis ou vers la gare et les stations de taxi-brousse d’Antsirabe sur simple demande préalable auprès de notre conciergerie.
      </p>
    ),
  },
  {
    question: "Où puis-je me stationner ?",
    answer: (
      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
        Le Royal Palace dispose d’un parking privé, clos, surveillé et gardé 24h/24 par des agents de sécurité, entièrement gratuit pour tous nos résidents.
      </p>
    ),
  },
]

export default function Contact() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0) // First open by default as in screenshot
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: 'standard',
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx)
  }

  return (
    <div className="bg-white">
      {/* 1. Hero matching Mockup 2 (media_1793275926151_42ac7854.jpg) */}
      <HeroBanner
        image="/images/imageOrigine/page-contact-1920.jpg"
        stars={3}
        eyebrow="NOUS CONTACTER"
        title="Pour bien"
        titleItalic="planifier votre séjour"
        buttonText=""
      />

      {/* 2. Section Formulaire: Entrons en contact */}
      <section className="py-20 md:py-28 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-4">
            Entrons en contact
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            Pour réserver votre séjour, poser une question ou demander un devis pour un événement.
            Remplissez simplement le formulaire ci-dessous et notre équipe vous recontactera avec
            plaisir pour vous accompagner.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#FAF3EA] border border-charcoal/10 rounded-2xl p-8 md:p-12 text-center max-w-xl mx-auto animate-fade-in">
            <CheckCircle2 size={48} className="text-gold-600 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-charcoal mb-2">Message envoyé avec succès !</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Merci de nous avoir contactés. Notre équipe vous répondra par e-mail ou téléphone dans les plus brefs délais.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 bg-charcoal text-white text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-black transition-all"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
            {/* Informations du séjour */}
            <div>
              <h3 className="font-serif text-base sm:text-lg text-charcoal mb-4 font-normal">
                Informations du séjour
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                    Date d’arrivée *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                    Date de départ *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.checkOut}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                    Nombre de personnes *
                  </label>
                  <select
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  >
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3">3 personnes</option>
                    <option value="4">4 personnes</option>
                    <option value="5+">5 personnes ou plus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                    Type d’hébergement *
                  </label>
                  <select
                    value={form.roomType}
                    onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                    className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  >
                    <option value="standard">Chambres standard</option>
                    <option value="superieure">Chambres supérieures</option>
                    <option value="deluxe">Chambres Deluxe</option>
                    <option value="suite">Suites</option>
                    <option value="appartement">Appartements</option>
                    <option value="evenement">Événement / Privatisation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="pt-4">
              <h3 className="font-serif text-base sm:text-lg text-charcoal mb-4 font-normal">
                Informations personnelles
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                    Nom et prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom complet"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-charcoal transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                      Numéro de téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+261 34 00 000 00"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-charcoal transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/70 mb-2">
                    Votre message ou demande particulière
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Précisez vos souhaits, horaires ou exigences diététiques..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-transparent border-b border-charcoal/30 pb-2 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:border-charcoal transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button
                type="submit"
                className="bg-[#FAF3EA] hover:bg-[#F3E5D3] text-charcoal font-medium text-xs tracking-widest uppercase px-12 py-3.5 rounded-full transition-all shadow-sm border border-charcoal/5 transform hover:-translate-y-0.5"
              >
                ENVOYER
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 3. Section: Coordonnées & Carte (fond crème #FAF3EA) */}
      <section className="bg-[#FAF3EA] py-20 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 3 Colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            <div>
              <h4 className="font-serif text-xl sm:text-2xl text-charcoal mb-3 font-normal">
                Adresse
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Lot 512 C 61 Tsarasoatra Route<br />
                d’Ambositra, Rue D’ Ambositra, 110<br />
                110 Madagascar
              </p>
            </div>

            <div>
              <h4 className="font-serif text-xl sm:text-2xl text-charcoal mb-3 font-normal">
                Téléphone
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                <a href="tel:0204449040" className="hover:text-gold-700 transition-colors">
                  020 44 490 40
                </a>
                <br />
                <a href="tel:0344904040" className="hover:text-gold-700 transition-colors">
                  034 49 040 40
                </a>
              </p>
            </div>

            <div>
              <h4 className="font-serif text-xl sm:text-2xl text-charcoal mb-3 font-normal">
                Email
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                <a
                  href="mailto:royalpalace.resa@moov.mg"
                  className="hover:text-gold-700 transition-colors break-all"
                >
                  royalpalace.resa@moov.mg
                </a>
              </p>
            </div>
          </div>

          {/* Carte Google Maps / OpenStreetMap intégrée */}
          <div className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-charcoal/10 bg-gray-100">
            <iframe
              title="Localisation Royal Palace Antsirabe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src="https://maps.google.com/maps?q=-19.8655,47.0335&z=15&output=embed"
            />
          </div>
        </div>
      </section>

      {/* 4. Section FAQ (Fond Blanc) */}
      <section className="py-20 md:py-28 px-6 max-w-4xl mx-auto">
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
      </section>

      {/* 5. Pre-footer CTA */}
      <CtaBanner />
    </div>
  )
}
