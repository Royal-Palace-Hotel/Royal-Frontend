import { FormEvent, useEffect, useState } from 'react'
import { adminApi, AdminUser, queryString } from '@/utils/api'
import { Button, Card, EmptyState, ErrorBanner, Field, Notice, Spinner } from './ui'

const dateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Jamais'

const ACTION_LABELS: Record<string, string> = {
  create: 'Création', update: 'Modification', delete: 'Suppression',
  status: 'Changement de statut', login: 'Connexion',
}

const ENTITY_LABELS: Record<string, string> = {
  room: 'chambre', menuSection: 'section de carte', menuItem: 'plat',
  eventRoom: 'salle de réunion', spaTreatment: 'soin du spa',
  galleryImage: 'image de galerie', discoverItem: 'élément « Découvrir »',
  booking: 'réservation', contactMessage: 'message', subscriber: 'abonné',
  adminUser: 'compte', account: 'compte', export: 'export',
}

export function AccountPanel({ currentUser }: { currentUser: AdminUser | null }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (form.newPassword !== form.confirm) {
      setError('Les deux nouveaux mots de passe ne correspondent pas.')
      return
    }

    setSaving(true)
    const response = await adminApi.update<{ id: string; token?: string }>(
      '/admin/account/password',
      { currentPassword: form.currentPassword, newPassword: form.newPassword },
    )
    setSaving(false)

    if (response.error) { setError(response.error); return }

    // Le changement révoque les jetons antérieurs : on adopte celui que l'API
    // vient d'émettre, sinon la session courante serait déconnectée aussi.
    if (response.data?.token) {
      localStorage.setItem('royal-admin-token', response.data.token)
    }
    setNotice('Mot de passe modifié. Vos autres sessions ont été déconnectées.')
    setForm({ currentPassword: '', newPassword: '', confirm: '' })
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card title="Mon compte">
        <dl className="divide-y divide-gray-100 px-5 py-2">
          <Field label="Nom">{currentUser?.name}</Field>
          <Field label="Adresse e-mail">{currentUser?.email}</Field>
          <Field label="Rôle">
            {currentUser?.role === 'admin' ? 'Administrateur' : 'Personnel'}
          </Field>
          <Field label="Dernière connexion">{dateTime(currentUser?.lastLoginAt)}</Field>
        </dl>
      </Card>

      <Card title="Changer de mot de passe">
        <form onSubmit={submit} className="space-y-4 p-5">
          {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
          {notice && !error && <Notice message={notice} />}

          <label className="block text-sm text-gray-700">
            Mot de passe actuel
            <input type="password" required autoComplete="current-password" value={form.currentPassword}
              onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
              className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
          </label>

          <label className="block text-sm text-gray-700">
            Nouveau mot de passe
            <input type="password" required minLength={8} autoComplete="new-password" value={form.newPassword}
              onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
              className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
            <span className="mt-1 block text-xs text-gray-500">8 caractères minimum.</span>
          </label>

          <label className="block text-sm text-gray-700">
            Confirmer le nouveau mot de passe
            <input type="password" required minLength={8} autoComplete="new-password" value={form.confirm}
              onChange={(event) => setForm({ ...form, confirm: event.target.value })}
              className="mt-1 w-full border border-gray-300 px-3 py-2 outline-none focus:border-gold-500" />
          </label>

          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Modifier le mot de passe'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export function AuditPanel() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    adminApi.get<any[]>(`/admin/audit-log${queryString({ limit: 200 })}`).then((response) => {
      if (cancelled) return
      if (response.error) setError(response.error)
      else setRows(response.data || [])
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      <Card title="Journal des actions">
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState>Aucune action enregistrée.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Utilisateur</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Détail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600">
                      {dateTime(row.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-charcoal">{row.userEmail}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {ACTION_LABELS[row.action] ?? row.action}
                      <span className="text-gray-500"> · {ENTITY_LABELS[row.entity] ?? row.entity}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{row.summary || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="border-t border-gray-200 px-5 py-3 text-xs text-gray-500">
          Les 200 dernières actions. Le journal conserve l’adresse e-mail même
          après la suppression d’un compte.
        </p>
      </Card>
    </>
  )
}
