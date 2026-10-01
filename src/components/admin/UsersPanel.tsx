import { FormEvent, useCallback, useEffect, useState } from 'react'
import { adminApi, AdminUser } from '@/utils/api'
import { Button, Card, EmptyState, ErrorBanner, Notice, Spinner, StatusBadge } from './ui'

const ACCOUNT_STATUS = {
  active: { label: 'Actif', tone: 'good' as const },
  inactive: { label: 'Désactivé', tone: 'neutral' as const },
}

const dateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Jamais'

export default function UsersPanel({ currentUser }: { currentUser: AdminUser | null }) {
  const [rows, setRows] = useState<any[]>([])
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'staff' })
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const response = await adminApi.get<any[]>('/admin/users')
    if (response.error) setError(response.error)
    else setRows(response.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  async function create(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const response = await adminApi.create('/admin/users', form)
    setSaving(false)
    if (response.error) { setError(response.error); return }
    setNotice(`Compte créé pour ${form.email}.`)
    setForm({ email: '', name: '', password: '', role: 'staff' })
    setFormOpen(false)
    await load()
  }

  async function patch(row: any, changes: Record<string, unknown>, successMessage: string) {
    setError('')
    const response = await adminApi.update(`/admin/users/${row.id}`, changes)
    if (response.error) { setError(response.error); return }
    setNotice(successMessage)
    await load()
  }

  async function remove(row: any) {
    if (!window.confirm(`Supprimer définitivement le compte ${row.email} ?`)) return
    setError('')
    const response = await adminApi.delete(`/admin/users/${row.id}`)
    if (response.error) { setError(response.error); return }
    setNotice('Compte supprimé.')
    await load()
  }

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      {notice && !error && <Notice message={notice} />}

      <div className={formOpen
        ? 'grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]'
        : 'grid grid-cols-1 gap-6'}>

        <Card title="Comptes d’administration" action={
          <Button variant="gold" onClick={() => setFormOpen(true)}>Ajouter un compte</Button>
        }>
          {loading ? <Spinner /> : rows.length === 0 ? (
            <EmptyState>Aucun compte.</EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Compte</th>
                    <th className="px-4 py-3 font-medium">Rôle</th>
                    <th className="px-4 py-3 font-medium">Dernière connexion</th>
                    <th className="px-4 py-3 font-medium">État</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => {
                    const isSelf = row.id === currentUser?.userId
                    return (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-medium text-charcoal">{row.name || row.email}</span>
                          {isSelf && <span className="ml-2 text-xs text-gold-700">(vous)</span>}
                          {row.name && <span className="block text-xs text-gray-500">{row.email}</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.role === 'admin' ? 'Administrateur' : 'Personnel'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">{dateTime(row.lastLoginAt)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={row.isActive ? 'active' : 'inactive'} map={ACCOUNT_STATUS} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {isSelf ? (
                            <span className="text-xs text-gray-400">Gérez votre compte dans « Mon compte »</span>
                          ) : (
                            <>
                              <button
                                onClick={() => void patch(row,
                                  { role: row.role === 'admin' ? 'staff' : 'admin' },
                                  'Rôle mis à jour.')}
                                className="mr-3 text-gold-700 hover:underline">
                                {row.role === 'admin' ? 'Passer en personnel' : 'Passer en admin'}
                              </button>
                              <button
                                onClick={() => void patch(row, { isActive: !row.isActive },
                                  row.isActive ? 'Compte désactivé.' : 'Compte réactivé.')}
                                className="mr-3 text-gray-700 hover:underline">
                                {row.isActive ? 'Désactiver' : 'Réactiver'}
                              </button>
                              <button onClick={() => void remove(row)} className="text-red-700 hover:underline">
                                Supprimer
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="border-t border-gray-200 px-5 py-3 text-xs text-gray-500">
            Un compte désactivé est déconnecté dès sa requête suivante. Le dernier
            administrateur actif ne peut être ni rétrogradé ni supprimé.
          </p>
        </Card>

        {formOpen && (
          <form onSubmit={create} className="space-y-4 border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg">Nouveau compte</h2>
              <Button variant="ghost" onClick={() => setFormOpen(false)}>Fermer</Button>
            </div>

            <label className="block text-sm text-gray-700">
              Adresse e-mail
              <input type="email" required value={form.email} autoComplete="off"
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
            </label>

            <label className="block text-sm text-gray-700">
              Nom <span className="text-xs text-gray-400">(facultatif)</span>
              <input type="text" value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
            </label>

            <label className="block text-sm text-gray-700">
              Mot de passe
              <input type="password" required minLength={8} value={form.password} autoComplete="new-password"
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
              <span className="mt-1 block text-xs text-gray-500">8 caractères minimum.</span>
            </label>

            <label className="block text-sm text-gray-700">
              Rôle
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}
                className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500">
                <option value="staff">Personnel — gère le contenu et les réservations</option>
                <option value="admin">Administrateur — gère aussi les comptes</option>
              </select>
            </label>

            <Button type="submit" variant="gold" disabled={saving}>
              {saving ? 'Création…' : 'Créer le compte'}
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
