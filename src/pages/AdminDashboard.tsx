import { FormEvent, Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BedDouble, CalendarCheck2, LogOut, Mail, Menu as MenuIcon, Utensils, UsersRound, X } from 'lucide-react'
import { adminApi } from '@/utils/api'

type AdminRow = Record<string, any>
type Section = 'rooms' | 'menu' | 'event-rooms' | 'bookings' | 'contact-messages'
type MenuView = 'sections' | 'items'
type Kind = 'rooms' | 'sections' | 'items' | 'event-rooms'
type Field = { key: string; label: string; multiline?: boolean; numeric?: boolean; boolean?: boolean }

// Adresse du backend (sans /api). Adaptez si votre variable d'environnement a un autre nom.
const API_ORIGIN: string =
  (((import.meta as any).env?.VITE_API_URL as string | undefined) || 'http://localhost:4000').replace(/\/api\/?$/, '')
const UPLOAD_URL = `${API_ORIGIN}/api/uploads`

// Les images envoyées ("/uploads/...") sont servies par le backend ; les autres chemins ("/images/...") par le frontend
function imageSrc(path: string) {
  if (/^(https?:|data:)/.test(path)) return path
  return path.startsWith('/uploads') ? `${API_ORIGIN}${path}` : path
}

const fields: Record<Kind, Field[]> = {
  rooms: [
    { key: 'slug', label: 'Slug' }, { key: 'translationKey', label: 'Clé de traduction' },
    { key: 'price', label: 'Prix', numeric: true }, { key: 'currency', label: 'Devise' },
    { key: 'size', label: 'Superficie (m²)', numeric: true },
    { key: 'maxGuests', label: 'Voyageurs maximum', numeric: true },
    { key: 'totalUnits', label: 'Nombre d’unités', numeric: true },
    { key: 'images', label: 'Images (un chemin ou URL par ligne)', multiline: true },
    { key: 'amenities', label: 'Équipements (un par ligne)', multiline: true },
    { key: 'isActive', label: 'Chambre active', boolean: true },
  ],
  sections: [
    { key: 'title', label: 'Nom de section (FR)' }, { key: 'titleEn', label: 'Section name (EN)' },
    { key: 'sortOrder', label: 'Ordre', numeric: true },
  ],
  items: [
    { key: 'name', label: 'Nom (FR)' }, { key: 'nameEn', label: 'Name (EN)' },
    { key: 'description', label: 'Description (FR)', multiline: true },
    { key: 'descriptionEn', label: 'Description (EN)', multiline: true },
    { key: 'price', label: 'Prix', numeric: true }, { key: 'sectionId', label: 'Section' },
    { key: 'sortOrder', label: 'Ordre', numeric: true },
  ],
  'event-rooms': [
    { key: 'key', label: 'Clé de traduction (facultatif)' }, { key: 'name', label: 'Nom (FR)' },
    { key: 'nameEn', label: 'Name (EN)' }, { key: 'description', label: 'Description / horaires (FR)', multiline: true },
    { key: 'descriptionEn', label: 'Description / schedule (EN)', multiline: true },
    { key: 'image', label: 'Image (chemin ou URL)' }, { key: 'capacity', label: 'Capacité', numeric: true },
    { key: 'schedule', label: 'Horaires / disponibilité' }, { key: 'price', label: 'Prix', numeric: true },
    { key: 'currency', label: 'Devise' }, { key: 'sortOrder', label: 'Ordre', numeric: true },
  ],
}

// Exemples affichés en gris dans les champs vides
const placeholders: Record<Kind, Record<string, string>> = {
  rooms: {
    slug: 'suite-royale',
    translationKey: 'suiteRoyale (facultatif)',
    price: '250',
    currency: 'EUR',
    size: '35',
    maxGuests: '2',
    totalUnits: '4',
    images: '/uploads/photo.jpg ou https://...\n(une image par ligne)',
    amenities: 'Wi-Fi\nClimatisation\nTélévision',
  },
  sections: { title: 'Entrées', titleEn: 'Starters', sortOrder: '1' },
  items: {
    name: 'Zébu grillé', nameEn: 'Grilled zebu',
    description: 'Filet de zébu, sauce au poivre vert', descriptionEn: 'Zebu fillet, green pepper sauce',
    price: '12000', sortOrder: '1',
  },
  'event-rooms': {
    key: 'salleConference (facultatif)', name: 'Salle de conférence', nameEn: 'Conference room',
    description: 'Salle équipée, vidéoprojecteur inclus', descriptionEn: 'Equipped room, projector included',
    image: '/uploads/salle.jpg', capacity: '50', schedule: '8h - 18h', price: '300', currency: 'EUR', sortOrder: '1',
  },
}

// Petites aides affichées sous certains champs
const hints: Partial<Record<Kind, Record<string, string>>> = {
  rooms: {
    slug: 'Minuscules, chiffres et tirets uniquement. Exemple : suite-royale',
    currency: 'Code à 3 lettres : EUR, USD ou MGA',
    price: 'Prix par nuit',
    totalUnits: 'Nombre de chambres de ce type',
  },
  'event-rooms': { currency: 'Code à 3 lettres : EUR, USD ou MGA' },
}

const sectionLabels: Record<Section, string> = {
  rooms: 'Chambres', menu: 'Restaurant', 'event-rooms': 'Salles de réunion',
  bookings: 'Réservations', 'contact-messages': 'Messages',
}

const sectionIcons = {
  rooms: BedDouble,
  menu: Utensils,
  'event-rooms': UsersRound,
  bookings: CalendarCheck2,
  'contact-messages': Mail,
}

// Valeurs de départ : les champs numériques restent vides (pour laisser voir l'exemple), sauf l'ordre
function emptyForm(kind: Kind): Record<string, string> {
  return Object.fromEntries(fields[kind].map((field) => [
    field.key,
    field.key === 'currency' && kind === 'rooms' ? 'EUR'
      : field.boolean ? 'true'
        : field.numeric && field.key === 'sortOrder' ? '0'
          : '',
  ]))
}

function rowToForm(row: AdminRow, kind: Kind) {
  const form = emptyForm(kind)
  for (const field of fields[kind]) {
    const value = row[field.key]
    form[field.key] = Array.isArray(value) ? value.join('\n') : value == null ? '' : String(value)
  }
  return form
}

// Retourne le type de formulaire pour une section donnée (ou null si la section n'est pas éditable)
function kindFor(section: Section, menuView: MenuView): Kind | null {
  if (section === 'menu') return menuView
  if (section === 'rooms' || section === 'event-rooms') return section
  return null
}

// Transforme un texte multi-lignes en tableau, sans jamais planter si la valeur est absente
function toLines(value?: string | null): string[] {
  return (value ?? '').split('\n').map((line) => line.trim()).filter(Boolean)
}

// "Suite Royale" -> "suite-royale" (minuscules, chiffres et tirets uniquement)
function slugify(value: string) {
  return value
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')                       // espaces et symboles deviennent des tirets
    .replace(/^-+/, '')
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [authorized, setAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [active, setActive] = useState<Section>('rooms')
  const [showInactiveRooms, setShowInactiveRooms] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [menuView, setMenuView] = useState<MenuView>('sections')
  const [rows, setRows] = useState<AdminRow[]>([])
  const [sections, setSections] = useState<AdminRow[]>([])
  const [form, setForm] = useState<Record<string, string>>(() => emptyForm('rooms'))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const editableKind = kindFor(active, menuView)
  const editable = editableKind !== null
  const activeFields = editableKind ? fields[editableKind] : []

  useEffect(() => {
    if (!localStorage.getItem('royal-admin-token')) {
      navigate('/admin/login', { replace: true })
      return
    }
    adminApi.me().then((response) => {
      if (response.error) {
        localStorage.removeItem('royal-admin-token')
        navigate('/admin/login', { replace: true })
      } else {
        setAuthorized(true)
      }
      setCheckingAuth(false)
    })
  }, [navigate])

  async function loadRows() {
    if (!authorized) return
    setLoading(true)
    setError('')
    const endpoint = active === 'menu'
      ? `/menu/${menuView}`
      : active === 'rooms' && showInactiveRooms ? '/rooms?includeInactive=true' : `/${active}`
    const response = await adminApi.get<AdminRow[]>(endpoint)
    if (response.error) setError(response.error)
    else setRows(response.data || [])

    if (active === 'menu' && menuView === 'items') {
      const sectionResponse = await adminApi.get<AdminRow[]>('/menu/sections')
      if (sectionResponse.data) setSections(sectionResponse.data)
    } else if (active === 'menu') {
      setSections(response.data || [])
    }
    setLoading(false)
  }

  useEffect(() => { void loadRows() }, [authorized, active, menuView, showInactiveRooms])

  // Dès qu'on change de section ou d'onglet, on repart d'un formulaire complet
  useEffect(() => {
    if (editableKind) {
      setForm(emptyForm(editableKind))
      setEditingId(null)
    }
  }, [active, menuView])

  function beginCreate() {
    if (!editableKind) return
    setEditingId(null)
    const base = emptyForm(editableKind)
    if (editableKind === 'items' && sections[0]) base.sectionId = String(sections[0].id)
    setForm(base)
    setError('')
  }

  function beginEdit(row: AdminRow) {
    if (!editableKind) return
    setEditingId(row.id)
    const base = rowToForm(row, editableKind)
    if (editableKind === 'items') base.sectionId = String(row.sectionId)
    setForm(base)
    setError('')
  }

  function resetForm() {
    if (editableKind) setForm(emptyForm(editableKind))
    setEditingId(null)
  }

  // Met à jour un champ en nettoyant automatiquement le slug et la devise
  function setField(key: string, raw: string) {
    const value = key === 'slug' ? slugify(raw) : key === 'currency' ? raw.toUpperCase() : raw
    setForm((current) => ({ ...current, [key]: value }))
  }

  // Envoie les fichiers choisis sur l'ordinateur, puis ajoute leurs chemins au champ d'images
  async function uploadImages(files: FileList | null, target: 'images' | 'image') {
    if (!files || !files.length) return
    setUploading(true)
    setError('')
    try {
      const data = new FormData()
      Array.from(files).forEach((file) => data.append('images', file))
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        // Pas de Content-Type ici : le navigateur ajoute lui-même la bonne valeur pour un envoi de fichiers
        headers: { Authorization: `Bearer ${localStorage.getItem('royal-admin-token') ?? ''}` },
        body: data,
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error || body?.message || `Erreur ${res.status}`)
      const urls: string[] = body?.urls ?? []
      setForm((current) => ({
        ...current,
        [target]: target === 'images'
          ? [...toLines(current.images), ...urls].join('\n')
          : urls[0] ?? current.image,
      }))
    } catch (e) {
      setError(e instanceof Error ? `Envoi de l’image impossible : ${e.message}` : 'Envoi de l’image impossible')
    } finally {
      setUploading(false)
    }
  }

  function removeImage(target: 'images' | 'image', index: number) {
    setForm((current) => ({
      ...current,
      [target]: toLines(current[target]).filter((_, i) => i !== index).join('\n'),
    }))
  }

  function payload() {
    const result: Record<string, unknown> = { ...form }
    if (!editableKind) return result

    for (const field of fields[editableKind]) {
      if (field.numeric) result[field.key] = Number(form[field.key] || 0)
    }
    if (active === 'rooms') {
      result.slug = slugify(form.slug ?? '').replace(/-+$/, '')
      result.currency = (form.currency ?? '').trim().toUpperCase()
      result.images = toLines(form.images)
      result.amenities = toLines(form.amenities)
      if (!(form.translationKey ?? '').trim()) delete result.translationKey
      result.isActive = form.isActive === 'true'
    }
    if (active === 'event-rooms') {
      for (const key of ['capacity', 'price', 'schedule', 'currency']) {
        if (!form[key]) result[key] = null
      }
      if (form.currency) result.currency = form.currency.trim().toUpperCase()
      if (!(form.key ?? '').trim()) delete result.key
    }
    if (active === 'menu' && menuView === 'items') result.sectionId = form.sectionId
    return result
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const endpoint = active === 'menu' ? `/menu/${menuView}` : `/${active}`
    const response = editingId
      ? await adminApi.update(`${endpoint}/${editingId}`, payload())
      : await adminApi.create(endpoint, payload())
    setSaving(false)
    if (response.error) {
      const details = Array.isArray(response.details)
        ? response.details.map((item: { field?: string; message?: string }) =>
          `${item.field ? `${item.field}: ` : ''}${item.message || ''}`).filter(Boolean).join(' · ')
        : ''
      setError(details ? `${response.error}: ${details}` : response.error)
      return
    }
    resetForm()
    await loadRows()
  }

  async function remove(row: AdminRow) {
    if (!window.confirm('Supprimer cet élément ?')) return
    const endpoint = active === 'menu' ? `/menu/${menuView}` : `/${active}`
    const response = await adminApi.delete(`${endpoint}/${row.id}`)
    if (response.error) setError(response.error)
    else await loadRows()
  }

  async function setStatus(id: string, status: string) {
    const endpoint = active === 'bookings' ? `/bookings/${id}` : `/contact-messages/${id}`
    const response = await adminApi.patch(endpoint, { status })
    if (response.error) setError(response.error)
    else await loadRows()
  }

  function logout() {
    localStorage.removeItem('royal-admin-token')
    navigate('/admin/login', { replace: true })
  }

  function goToSection(section: Section) {
    const nextKind = kindFor(section, menuView)
    setActive(section)
    setForm(nextKind ? emptyForm(nextKind) : {})
    setEditingId(null)
    setMobileNavOpen(false)
  }

  const navigation = (Object.keys(sectionLabels) as Section[]).map((section) => {
    const Icon = sectionIcons[section]
    return (
      <button key={section} onClick={() => goToSection(section)}
        aria-current={active === section ? 'page' : undefined}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm border-l-4 transition-colors ${active === section ? 'bg-gold-500 border-gold-300 text-white' : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-charcoal'}`}>
        <Icon size={18} aria-hidden="true" />
        <span>{sectionLabels[section]}</span>
      </button>
    )
  })

  const sidebar = (
    <>
      <div className="px-6 py-6 border-b border-gray-200">
        <img src="/images/logo-dark.png" alt="Royal Palace Antsirabe" className="h-14 max-w-full object-contain object-left" />
        <h1 className="mt-3 font-serif text-xl text-charcoal">Administration</h1>
      </div>
      <nav className="flex-1 py-5" aria-label="Navigation d’administration">
        <div className="space-y-1">{navigation}</div>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-charcoal">
          <LogOut size={18} aria-hidden="true" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </>
  )

  if (checkingAuth || !authorized) {
    return <main className="min-h-screen grid place-items-center text-gray-600">Vérification de la session...</main>
  }

  return (
    <main className="min-h-screen bg-gray-50 text-charcoal">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        {sidebar}
      </aside>
      <header className="sticky top-0 z-20 flex items-center justify-between bg-charcoal px-4 py-3 text-white lg:hidden">
        <div><p className="text-xs uppercase tracking-widest2 text-gold-400">Royal Palace Antsirabe</p><h1 className="font-serif text-lg">Administration</h1></div>
        <button onClick={() => setMobileNavOpen(true)} aria-label="Ouvrir la navigation" aria-expanded={mobileNavOpen}
          className="p-2 hover:bg-white/10">
          <MenuIcon size={22} aria-hidden="true" />
        </button>
      </header>
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/50" aria-label="Fermer la navigation" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl">
            <div className="absolute right-3 top-5">
              <button onClick={() => setMobileNavOpen(false)} aria-label="Fermer la navigation" className="p-2 text-gray-700 hover:bg-gray-100">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="mx-auto max-w-screen-2xl px-4 py-5 md:px-8 md:py-7 lg:ml-64">

        {active === 'menu' && (
          <div className="flex gap-2 mb-5" role="tablist" aria-label="Gestion du restaurant">
            {(['sections', 'items'] as MenuView[]).map((view) => (
              <button key={view}
                onClick={() => { setMenuView(view); setEditingId(null); setForm(emptyForm(view)) }}
                className={`px-3 py-1.5 text-sm border ${menuView === view ? 'border-charcoal bg-charcoal text-white' : 'border-gray-300 bg-white'}`}>
                {view === 'sections' ? 'Sections' : 'Plats et boissons'}
              </button>
            ))}
          </div>
        )}

        {error && <p role="alert" className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {editable ? (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-6 items-start">
            <section className="bg-white border border-gray-200 overflow-x-auto">
              <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-lg">{sectionLabels[active]}</h2>
                <div className="flex items-center gap-4">
                  {active === 'rooms' && (
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" checked={showInactiveRooms}
                        onChange={(event) => setShowInactiveRooms(event.target.checked)} />
                      Afficher les désactivées
                    </label>
                  )}
                  <button onClick={beginCreate} className="bg-gold-500 text-white px-3 py-2 text-sm">Ajouter</button>
                </div>
              </div>
              {loading ? <p className="p-5 text-sm text-gray-500">Chargement...</p> : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500"><tr>
                    <th className="px-4 py-3">{active === 'rooms' ? 'Nom' : active === 'event-rooms' ? 'Salle' : menuView === 'sections' ? 'Section' : 'Élément'}</th>
                    <th className="px-4 py-3">Détail</th><th className="px-4 py-3">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row) => {
                      const title = active === 'rooms' ? row.translationKey || row.slug
                        : active === 'event-rooms' ? row.name : menuView === 'sections' ? row.title : row.name
                      const detail = active === 'rooms' ? `${row.price} ${row.currency} · ${row.totalUnits} unités · ${row.isActive ? 'Active' : 'Désactivée'}`
                        : active === 'event-rooms' ? `${row.capacity ?? 'Capacité non définie'} · ${row.schedule || ''}`
                          : menuView === 'sections' ? `Ordre ${row.sortOrder}` : `${row.price} · ${row.sectionId}`
                      return <tr key={row.id}>
                        <td className="px-4 py-3 font-medium">{title}</td><td className="px-4 py-3 text-gray-600">{detail}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button onClick={() => beginEdit(row)} className="text-gold-700 hover:underline mr-3">Modifier</button>
                          <button onClick={() => void remove(row)} className="text-red-700 hover:underline">Supprimer</button>
                        </td>
                      </tr>
                    })}
                    {!rows.length && <tr><td colSpan={3} className="px-4 py-8 text-gray-500">Aucun élément pour le moment.</td></tr>}
                  </tbody>
                </table>
              )}
            </section>

            <form onSubmit={save} className="bg-white border border-gray-200 p-5 space-y-4">
              <h2 className="font-serif text-lg">{editingId ? 'Modifier' : 'Nouvel élément'}</h2>
              {activeFields.map((field) => {
                const isImageField = (active === 'rooms' && field.key === 'images') || (active === 'event-rooms' && field.key === 'image')
                const imageTarget = field.key as 'images' | 'image'
                const previews = isImageField ? toLines(form[field.key]) : []
                const placeholder = editableKind ? placeholders[editableKind][field.key] : undefined
                const hint = editableKind ? hints[editableKind]?.[field.key] : undefined
                const isCurrency = field.key === 'currency'
                return (
                  <Fragment key={field.key}>
                    <label className="block text-sm text-gray-700">
                      {field.label}
                      {field.boolean ? (
                        <input type="checkbox" checked={form[field.key] === 'true'}
                          onChange={(event) => setForm({ ...form, [field.key]: String(event.target.checked) })}
                          className="ml-2 align-middle" />
                      ) : field.key === 'sectionId' && active === 'menu' ? (
                        <select value={form.sectionId || ''} required onChange={(event) => setForm({ ...form, sectionId: event.target.value })}
                          className="mt-1 w-full border border-gray-300 px-3 py-2">
                          <option value="">Choisir une section</option>
                          {sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
                        </select>
                      ) : field.multiline ? (
                        <textarea rows={3} placeholder={placeholder} value={form[field.key] || ''}
                          onChange={(event) => setField(field.key, event.target.value)}
                          className="mt-1 w-full border border-gray-300 px-3 py-2 placeholder:text-gray-400" />
                      ) : (
                        <input type={field.numeric ? 'number' : 'text'}
                          placeholder={placeholder}
                          maxLength={isCurrency ? 3 : undefined}
                          minLength={isCurrency && form.currency ? 3 : undefined}
                          min={field.numeric ? field.key === 'price' ? '0.01' : ['size', 'maxGuests', 'totalUnits'].includes(field.key) ? 1 : 0 : undefined}
                          step={field.numeric ? field.key === 'price' ? '0.01' : 1 : undefined}
                          required={field.key === 'price' ? active !== 'event-rooms'
                            : isCurrency ? active === 'rooms'
                              : !['translationKey', 'key', 'schedule', 'capacity', 'price', 'currency', 'image'].includes(field.key)}
                          value={form[field.key] || ''} onChange={(event) => setField(field.key, event.target.value)}
                          className="mt-1 w-full border border-gray-300 px-3 py-2 placeholder:text-gray-400" />
                      )}
                      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
                    </label>

                    {isImageField && (
                      <div className="-mt-2 space-y-3">
                        <label className={`inline-block border border-gray-300 px-3 py-2 text-sm ${uploading ? 'opacity-60' : 'cursor-pointer hover:bg-gray-50'}`}>
                          {uploading ? 'Envoi en cours...' : 'Choisir depuis mon ordinateur'}
                          <input type="file" accept="image/*" hidden disabled={uploading}
                            multiple={imageTarget === 'images'}
                            onChange={(event) => {
                              const input = event.target
                              void uploadImages(input.files, imageTarget).then(() => { input.value = '' })
                            }} />
                        </label>
                        <p className="text-xs text-gray-500">Vous pouvez aussi coller un chemin ou une URL dans le champ ci-dessus.</p>
                        {previews.length > 0 && (
                          <ul className="grid grid-cols-3 gap-2">
                            {previews.map((path, index) => (
                              <li key={`${path}-${index}`} className="relative border border-gray-200">
                                <img src={imageSrc(path)} alt="" className="h-20 w-full object-cover" />
                                <button type="button" onClick={() => removeImage(imageTarget, index)}
                                  aria-label="Retirer cette image"
                                  className="absolute right-1 top-1 bg-black/60 p-0.5 text-white hover:bg-black/80">
                                  <X size={14} aria-hidden="true" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </Fragment>
                )
              })}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving || uploading} className="bg-gold-500 text-white px-4 py-2 text-sm disabled:opacity-60">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button type="button" onClick={resetForm} className="border border-gray-300 px-4 py-2 text-sm">Effacer</button>
              </div>
            </form>
          </div>
        ) : active === 'bookings' ? (
          <section className="bg-white border border-gray-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-gray-200"><h2 className="font-serif text-lg">Réservations</h2></div>
            <table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500"><tr>
              {['Client', 'Dates', 'Chambre', 'Statut', 'Actions'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}
            </tr></thead><tbody className="divide-y divide-gray-100">
              {rows.map((row) => <tr key={row.id}>
                <td className="px-4 py-3">{row.guestName}<span className="block text-xs text-gray-500">{row.guestEmail}</span></td>
                <td className="px-4 py-3">{new Date(row.checkIn).toLocaleDateString()} – {new Date(row.checkOut).toLocaleDateString()}<span className="block text-xs text-gray-500">{row.rooms} chambre(s)</span></td>
                <td className="px-4 py-3">{row.roomName || row.roomId}</td><td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3 whitespace-nowrap"><button onClick={() => void setStatus(row.id, 'confirmed')} className="text-green-700 hover:underline mr-3">Confirmer</button>
                  <button onClick={() => void setStatus(row.id, 'cancelled')} className="text-red-700 hover:underline">Annuler</button></td>
              </tr>)}
              {!rows.length && <tr><td colSpan={5} className="px-4 py-8 text-gray-500">Aucune réservation.</td></tr>}
            </tbody></table>
          </section>
        ) : (
          <section className="bg-white border border-gray-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-gray-200"><h2 className="font-serif text-lg">Messages reçus</h2></div>
            <table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500"><tr>
              {['Nom', 'Type', 'Statut', 'Message', 'Actions'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}
            </tr></thead><tbody className="divide-y divide-gray-100">
              {rows.map((row) => <tr key={row.id}>
                <td className="px-4 py-3">{row.name}<span className="block text-xs text-gray-500">{row.email}</span></td>
                <td className="px-4 py-3">{row.type}</td><td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3 max-w-sm truncate" title={row.message}>{row.message}</td>
                <td className="px-4 py-3 whitespace-nowrap"><button onClick={() => void setStatus(row.id, 'read')} className="text-gold-700 hover:underline mr-3">Lu</button>
                  <button onClick={() => void setStatus(row.id, 'replied')} className="text-green-700 hover:underline">Répondu</button></td>
              </tr>)}
              {!rows.length && <tr><td colSpan={5} className="px-4 py-8 text-gray-500">Aucun message.</td></tr>}
            </tbody></table>
          </section>
        )}
      </div>
    </main>
  )
}