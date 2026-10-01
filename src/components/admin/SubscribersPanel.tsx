import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { adminApi, downloadCsv, PageMeta, queryString } from '@/utils/api'
import {
  Button, Card, EmptyState, ErrorBanner, Pagination, SearchInput, Spinner, Toolbar,
} from './ui'

const dateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'

export default function SubscribersPanel() {
  const [rows, setRows] = useState<any[]>([])
  const [meta, setMeta] = useState<PageMeta>()
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => { setDebounced(search); setPage(1) }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const response = await adminApi.get<any[]>(`/admin/subscribers${queryString({ q: debounced, page })}`)
    if (response.error) setError(response.error)
    else { setRows(response.data || []); setMeta(response.meta) }
    setLoading(false)
  }, [debounced, page])

  useEffect(() => { void load() }, [load])

  async function remove(row: any) {
    if (!window.confirm(`Désinscrire ${row.email} ?`)) return
    const response = await adminApi.delete(`/admin/subscribers/${row.id}`)
    if (response.error) { setError(response.error); return }
    await load()
  }

  async function exportCsv() {
    const message = await downloadCsv('/admin/subscribers/export', 'abonnes-newsletter.csv')
    if (message) setError(message)
  }

  return (
    <>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une adresse…" />
        <div className="ml-auto">
          <Button onClick={exportCsv}>
            <span className="inline-flex items-center gap-2"><Download size={15} aria-hidden="true" /> Exporter en CSV</span>
          </Button>
        </div>
      </Toolbar>

      <Card title={`Abonnés à la newsletter${meta ? ` (${meta.total})` : ''}`}>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState>Aucun abonné pour le moment.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Adresse e-mail</th>
                  <th className="px-4 py-3 font-medium">Inscrit le</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <a href={`mailto:${row.email}`} className="text-charcoal hover:text-gold-700 hover:underline">
                        {row.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{dateTime(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => void remove(row)} className="text-red-700 hover:underline">
                        Désinscrire
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination meta={meta} onPage={setPage} />
      </Card>
    </>
  )
}
