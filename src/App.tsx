import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Rooms from '@/pages/Rooms'
import Restaurant from '@/pages/Restaurant'
import Spa from '@/pages/Spa'
import Events from '@/pages/Events'
import Discover from '@/pages/Discover'
import Contact from '@/pages/Contact'

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
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
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
      <Footer />
    </div>
  )
}
