import { Search, Filter, RefreshCw, Play, Edit2, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useParticipants, type Participant } from "@/hooks/useParticipants"
import { useAuthSession } from "@/hooks/useAuthSession"
import { useMatchState } from "@/hooks/useMatchState"

const PAGE_SIZE = 8

type StatusFilter = "all" | NonNullable<Participant["status"]>

type ParticipantsTableProps = {
  onEdit: (participant: Participant) => void
}

export function ParticipantsTable({ onEdit }: ParticipantsTableProps) {
  const navigate = useNavigate()
  const { participants, loading, error: fetchError, refresh } = useParticipants()
  const { setCurrentParticipant } = useMatchState()
  const { isAdmin } = useAuthSession()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [page, setPage] = useState(0)
  const [actionError, setActionError] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()
    return participants.filter((row) => {
      const matchesSearch =
        !query ||
        row.name.toLowerCase().includes(query) ||
        (row.school && row.school.toLowerCase().includes(query))
      const matchesStatus = statusFilter === "all" || row.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [participants, search, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const pageData = filteredData.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  const deleteParticipant = async (id: string) => {
    if (!confirm("Yakin ingin menghapus peserta ini?")) return
    setActionError(null)
    const { error } = await supabase.from("participants").delete().eq("id", id)
    if (error) setActionError(error.message)
  }

  return (
    <div className="flex flex-col gap-space-md h-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-low p-2 rounded-xl border border-border-subtle">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="w-full bg-surface-base text-text-primary text-xs pl-8 pr-3 py-1.5 rounded-md border border-border-subtle focus:outline-none transition-colors"
            placeholder="Cari nama tim atau sekolah..."
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="relative inline-flex items-center">
            <Filter size={12} className="pointer-events-none absolute left-2.5 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter)
                setPage(0)
              }}
              title="Filter berdasarkan status"
              className="h-7 appearance-none bg-surface-container border border-border-subtle rounded-md pl-7 pr-6 text-xs text-text-secondary hover:text-text-primary hover:border-border-strong focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="active">active</option>
              <option value="locked">locked</option>
              <option value="done">done</option>
            </select>
          </div>
          <Button variant="outline" size="icon-sm" onClick={refresh} className="bg-surface-container border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary" title="Muat ulang data">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <div className="bg-surface-raised rounded-xl border border-border-subtle overflow-hidden shadow-sm flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-subtle font-label-mono-stat text-[10px] text-text-muted tracking-wider uppercase">
                <th className="py-2.5 px-3 w-16 text-center">#</th>
                <th className="py-2.5 px-3">Nama</th>
                <th className="py-2.5 px-3">Asal Sekolah</th>
                <th className="py-2.5 px-3 text-center">Skor</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-body-sm text-text-secondary">
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted text-xs">
                    {loading ? "Memuat peserta..." : "Tidak ada data peserta"}
                  </td>
                </tr>
              )}
              {pageData.map((row, i) => (
                <tr key={row.id} className="hover:bg-surface-container-high/60 transition-colors group">
                  <td className="py-2 px-3 font-label-mono-stat text-center text-xs text-text-muted">{currentPage * PAGE_SIZE + i + 1}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border border-border-subtle flex items-center justify-center bg-surface-container text-text-secondary">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                          <circle cx="12" cy="5" r="2"></circle>
                          <path d="M12 7v4"></path>
                          <line x1="8" y1="16" x2="8.01" y2="16"></line>
                          <line x1="16" y1="16" x2="16.01" y2="16"></line>
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-text-primary group-hover:text-text-primary transition-colors">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs font-semibold text-text-secondary">{row.school}</td>
                  <td className="py-2 px-3 text-center text-xs font-semibold text-text-secondary">{row.total_score}</td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className="font-label-mono-stat">
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={async () => {
                          await setCurrentParticipant(row.id)
                          navigate(`/match-control?participant=${row.id}`)
                        }}
                        className="h-6 bg-surface-container border-border-subtle text-text-primary font-label-mono-stat text-xs font-semibold hover:border-border-strong"
                      >
                        <Play size={11} fill="currentColor" className="mr-1" />
                        Start
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onEdit(row)}
                        className="text-text-muted hover:text-text-primary hover:bg-surface-container"
                        title="Edit Peserta"
                      >
                        <Edit2 size={14} />
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="icon-xs" onClick={() => deleteParticipant(row.id)} className="text-text-muted hover:text-error hover:bg-surface-container" title="Hapus Peserta">
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(actionError || fetchError) && (
          <p className="font-body-sm text-[11px] text-status-warning px-3 py-2 bg-surface-container-lowest border-t border-border-subtle break-words">
            {actionError ?? fetchError}
          </p>
        )}

        <div className="px-space-md py-3 bg-surface-container-lowest border-t border-border-subtle flex items-center justify-between">
          <span className="font-label-mono-stat text-text-muted text-[11px]">
            Total {participants.length} Peserta · Halaman {currentPage + 1}/{pageCount}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="h-6 font-label-mono-stat text-[11px] bg-surface-container border-border-subtle text-text-primary hover:border-border-strong"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={currentPage >= pageCount - 1}
              className="h-6 font-label-mono-stat text-[11px] bg-surface-container border-border-subtle text-text-primary hover:border-border-strong"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
