import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BedDouble, CalendarCheck2, LogOut, Mail, Menu as MenuIcon, Utensils, UsersRound, X } from 'lucide-react'
import { adminApi } from '@/utils/api'

type AdminRow = Record<string, any>
type Section = 'rooms' | 'menu' | 'event-rooms' | 'bookings' | 'contact-messages'
type MenuView = 'sections' | 'items'
type Field = { key: string; label: string; multiline?: boolean; numeric?: boolean }

const fields: Record<'rooms' | 'sections' | 'items' | 'event-rooms', Field[]> = {
  rooms: [
    { key: 'slug', label: 'Slug' }, { key: 'translationKey', label: 'Clé de traduction' },
    { key: 'name', label: 'Nom (FR)' }, { key: 'nameEn', label: 'Name (EN)' },
    { key: 'description', label: 'Description (FR)', multiline: true },
    { key: 'descriptionEn', label: 'Description (EN)', multiline: true },
    { key: 'price', label: 'Prix', numeric: true }, { key: 'currency', label: 'Devise' },
    { key: 'size', label: 'Superficie (m²)', numeric: true },
    { key: 'maxGuests', label: 'Voyageurs maximum', numeric: true },
    { key: 'totalUnits', label: 'Nombre d’unités', numeric: true },
    { key: 'images', label: 'Images (un chemin ou URL par ligne)', multiline: true },
    { key: 'amenities', label: 'Équipements (un par ligne)', multiline: true },
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

const englishFieldKeys = new Set(['nameEn', 'descriptionEn', 'titleEn'])

function fallbackEnglishValue(value: string, fallback: string) {
  const trimmedValue = value?.trim() || ''
  const trimmedFallback = fallback?.trim() || ''
  return trimmedValue || trimmedFallback
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

function emptyForm(kind: 'rooms' | 'sections' | 'items' | 'event-rooms'): Record<string, string> {
  return Object.fromEntries(fields[kind].map((field) => [
    field.key,
    field.numeric && !(kind === 'event-rooms' && ['capacity', 'price'].includes(field.key)) ? '0' : '',
  ]))
}

function rowToForm(row: AdminRow, kind: 'rooms' | 'sections' | 'items' | 'event-rooms') {
  const form = emptyForm(kind)
  for (const field of fields[kind]) {
    const value = row[field.key]
    form[field.key] = Array.isArray(value) ? value.join('\n') : value == null ? '' : String(value)
  }
  return form
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [authorized, setAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [active, setActive] = useState<Section>('rooms')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [menuView, setMenuView] = useState<MenuView>('sections')
  const [rows, setRows] = useState<AdminRow[]>([])
  const [sections, setSections] = useState<AdminRow[]>([])
  const [form, setForm] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showEnglish, setShowEnglish] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadError, setUploadError] = useState('')

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

  function sectionEndpoint() {
    if (active === 'rooms' || active === 'event-rooms') return `/admin/${active}`
    return active === 'menu' ? `/menu/${menuView}` : `/${active}`
  }

  async function loadRows() {
    if (!authorized) return
    setLoading(true)
    setError('')
    const endpoint = sectionEndpoint()
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

  useEffect(() => { void loadRows() }, [authorized, active, menuView])

  function beginCreate() {
    const kind = active === 'menu' ? menuView : active as 'rooms' | 'event-rooms'
    setEditingId(null)
    setForm(emptyForm(kind))
    setShowEnglish(false)
    setUploadError('')
    if (kind === 'items' && sections[0]) setForm((current) => ({ ...current, sectionId: sections[0].id }))
    setError('')
  }

  function beginEdit(row: AdminRow) {
    const kind = active === 'menu' ? menuView : active as 'rooms' | 'event-rooms'
    setEditingId(row.id)
    setForm(rowToForm(row, kind))
    setShowEnglish(Boolean(row.nameEn || row.descriptionEn || row.titleEn))
    setUploadError('')
    if (kind === 'items') setForm((current) => ({ ...current, sectionId: String(row.sectionId) }))
    setError('')
  }

  async function uploadImages(files: FileList | null, field: 'image' | 'images') {
    if (!files?.length) return
    setUploadingImages(true)
    setUploadError('')
    const uploadedPaths: string[] = []
    try {
      for (const file of Array.from(files)) {
        const response = await adminApi.uploadImage(file)
        if (response.error || !response.data?.path) {
          setUploadError(response.error || 'The image could not be uploaded.')
          break
        }
        uploadedPaths.push(response.data.path)
      }
      if (uploadedPaths.length) {
        setForm((current) => ({
          ...current,
          [field]: field === 'images'
            ? [...(current.images || '').split('\n').filter(Boolean), ...uploadedPaths].join('\n')
            : uploadedPaths[0],
        }))
      }
    } finally {
      setUploadingImages(false)
    }
  }

  function payload() {
    const result: Record<string, unknown> = { ...form }
    for (const field of fields[active === 'menu' ? menuView : active as 'rooms' | 'event-rooms']) {
      if (field.numeric) result[field.key] = Number(form[field.key] || 0)
    }
    if (active === 'rooms') {
      result.nameEn = fallbackEnglishValue(form.nameEn || '', form.name || '')
      result.descriptionEn = fallbackEnglishValue(form.descriptionEn || '', form.description || '')
      result.images = (form.images || '').split('\n').map((value) => value.trim()).filter(Boolean)
      result.amenities = (form.amenities || '').split('\n').map((value) => value.trim()).filter(Boolean)
      if (!form.translationKey.trim()) delete result.translationKey
    }
    if (active === 'event-rooms') {
      result.nameEn = fallbackEnglishValue(form.nameEn || '', form.name || '')
      result.descriptionEn = fallbackEnglishValue(form.descriptionEn || '', form.description || '')
      for (const key of ['capacity', 'price']) if (!form[key]) result[key] = null
      for (const key of ['schedule', 'currency']) if (!form[key]) result[key] = null
      if (!form.key?.trim()) delete result.key
    }
    if (active === 'menu') {
      if (menuView === 'sections') {
        result.titleEn = fallbackEnglishValue(form.titleEn || '', form.title || '')
      }
      if (menuView === 'items') {
        result.nameEn = fallbackEnglishValue(form.nameEn || '', form.name || '')
        result.descriptionEn = fallbackEnglishValue(form.descriptionEn || '', form.description || '')
        result.sectionId = form.sectionId
      }
    }
    return result
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    const endpoint = sectionEndpoint()
    const response = editingId
      ? await adminApi.update(`${endpoint}/${editingId}`, payload())
      : await adminApi.create(endpoint, payload())
    setSaving(false)
    if (response.error) {
      setError(response.error)
      return
    }
    setForm({})
    setEditingId(null)
    await loadRows()
  }

  async function remove(row: AdminRow) {
    if (!window.confirm('Supprimer cet élément ?')) return
    const endpoint = sectionEndpoint()
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

  const editable = active === 'rooms' || active === 'event-rooms' || active === 'menu'
  const editableKind = active === 'menu' ? menuView : active as 'rooms' | 'event-rooms'
  const activeFields = editable ? fields[editableKind].filter((field) => !(!showEnglish && englishFieldKeys.has(field.key))) : []
  const navigation = (Object.keys(sectionLabels) as Section[]).map((section) => {
    const Icon = sectionIcons[section]
    return (
      <button key={section} onClick={() => { setActive(section); setForm({}); setEditingId(null); setMobileNavOpen(false) }}
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
              <button key={view} onClick={() => { setMenuView(view); setEditingId(null); setForm({}) }}
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
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg">{sectionLabels[active]}</h2>
                <button onClick={beginCreate} className="bg-gold-500 text-white px-3 py-2 text-sm">Ajouter</button>
              </div>
              {loading ? <p className="p-5 text-sm text-gray-500">Chargement...</p> : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500"><tr>
                    <th className="px-4 py-3">{active === 'rooms' ? 'Nom' : active === 'event-rooms' ? 'Salle' : menuView === 'sections' ? 'Section' : 'Élément'}</th>
                    <th className="px-4 py-3">Détail</th><th className="px-4 py-3">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row) => {
                      const title = active === 'rooms' || active === 'event-rooms' ? row.name : menuView === 'sections' ? row.title : row.name
                      const detail = active === 'rooms' ? `${row.price} ${row.currency} · ${row.totalUnits} unités`
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-lg">{editingId ? 'Modifier' : 'Nouvel élément'}</h2>
                {activeFields.some((field) => englishFieldKeys.has(field.key)) && (
                  <button
                    type="button"
                    onClick={() => setShowEnglish((current) => !current)}
                    className="text-sm font-medium text-gold-700 hover:text-gold-800"
                  >
                    {showEnglish ? 'Masquer la version anglaise' : 'Ajouter une version anglaise'}
                  </button>
                )}
              </div>
              {activeFields.map((field) => {
                if (active === 'event-rooms' && field.key === 'image') {
                  return (
                    <div key={field.key} className="space-y-2 text-sm text-gray-700">
                      <label className="block">{field.label}
                        <input type="file" accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => { void uploadImages(event.currentTarget.files, 'image'); event.currentTarget.value = '' }}
                          className="admin-file-input" />
                      </label>
                      {uploadingImages && <p className="text-gray-500">Téléversement en cours...</p>}
                      {uploadError && <p role="alert" className="text-red-700">{uploadError}</p>}
                      {form.image && <img src={form.image} alt="Aperçu de la salle" className="h-24 w-36 border border-gray-200 object-cover" />}
                    </div>
                  )
                }
                if (active === 'rooms' && field.key === 'images') {
                  const imagePaths = (form.images || '').split('\n').map((image) => image.trim()).filter(Boolean)
                  return (
                    <div key={field.key} className="space-y-2 text-sm text-gray-700">
                      <label className="block">Images
                        <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                          onChange={(event) => { void uploadImages(event.currentTarget.files, 'images'); event.currentTarget.value = '' }}
                          className="admin-file-input" />
                      </label>
                      {uploadingImages && <p className="text-gray-500">Téléversement en cours...</p>}
                      {uploadError && <p role="alert" className="text-red-700">{uploadError}</p>}
                      {imagePaths.length > 0 && <div className="flex flex-wrap gap-3">
                        {imagePaths.map((image, index) => (
                          <div key={`${image}-${index}`} className="space-y-1">
                            <img src={image} alt={`Aperçu ${index + 1}`} className="h-20 w-28 border border-gray-200 object-cover" />
                            <button type="button" onClick={() => setForm((current) => ({
                              ...current,
                              images: (current.images || '').split('\n').filter((_, imageIndex) => imageIndex !== index).join('\n'),
                            }))} className="text-xs text-red-700 hover:underline">
                              Retirer
                            </button>
                          </div>
                        ))}
                      </div>}
                    </div>
                  )
                }
                return (
                  <label key={field.key} className="block text-sm text-gray-700">
                    {field.label}
                    {field.key === 'sectionId' && active === 'menu' ? (
                      <select value={form.sectionId || ''} required onChange={(event) => setForm({ ...form, sectionId: event.target.value })}
                        className="mt-1 w-full border border-gray-300 px-3 py-2">
                        <option value="">Choisir une section</option>
                        {sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
                      </select>
                    ) : field.multiline ? (
                      <textarea rows={3} value={form[field.key] || ''} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                        className="mt-1 w-full border border-gray-300 px-3 py-2" />
                    ) : (
                      <input type={field.numeric ? 'number' : 'text'} min={field.numeric ? 0 : undefined}
                        required={!['translationKey', 'key', 'schedule', 'capacity', 'price', 'currency'].includes(field.key)}
                        value={form[field.key] || ''} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                        className="mt-1 w-full border border-gray-300 px-3 py-2" />
                    )}
                  </label>
                )
              })}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving || uploadingImages} className="bg-gold-500 text-white px-4 py-2 text-sm disabled:opacity-60">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button type="button" onClick={() => { setForm({}); setEditingId(null); setShowEnglish(false) }} className="border border-gray-300 px-4 py-2 text-sm">Effacer</button>
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
