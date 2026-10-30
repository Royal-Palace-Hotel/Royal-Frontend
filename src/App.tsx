import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Rooms from '@/pages/Rooms'
import Restaurant from '@/pages/Restaurant'
import Spa from '@/pages/Spa'
import Events from '@/pages/Events'
import Discover from '@/pages/Discover'
import Contact from '@/pages/Contact'

/**
 * Le back-office est chargé à la demande.
 *
 * Tableau de bord, formulaires et panneaux ne servent qu'aux quelques
 * personnes qui s'y connectent : les inclure dans le bundle principal ferait
 * payer leur poids à tous les visiteurs du site.
 */
const AdminLogin = lazy(() => import('@/pages/AdminLogin'))
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const adminArea = pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!adminArea && <Header />}
      {adminArea ? (
        <Suspense fallback={
          <main className="grid min-h-screen place-items-center text-gray-600">
            Chargement de l’administration…
          </main>
        }>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      ) : (
        <main className="flex-1">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chambres-suites" element={<Rooms />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/piscine-bien-etre" element={<Spa />} />
          <Route path="/reunions-evenements" element={<Events />} />
          <Route path="/decouvrir-antsirabe" element={<Discover />} />
          <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      )}
      {!adminArea && <Footer />}
    </div>
  )
}
