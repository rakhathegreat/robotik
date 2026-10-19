import { useEffect, useMemo, useState } from "react"
import { Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/supabase"
import type { ParticipantMatchTime } from "@/hooks/useTeamMatchTimes"

const DEFAULT_PAGE_SIZE = 10

type Participant = Database['public']['Tables']['participants']['Row']

type StandingsTableProps = {
  data: Participant[]
  finishedId?: string | null
  matchTimes?: Map<string, ParticipantMatchTime>
  pageSize?: number
  autoPageIntervalMs?: number
  rankOffset?: number
}

export function StandingsTable({
  data,
  finishedId,
  matchTimes,
  pageSize = DEFAULT_PAGE_SIZE,
  autoPageIntervalMs,
  rankOffset = 4,
}: StandingsTableProps) {
  const [page, setPage] = useState(0)

  const pageCount = Math.max(1, Math.ceil(data.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const pageData = useMemo(
    () => data.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    [data, currentPage, pageSize]
  )

  // Auto jump to the page containing the finished participant
  useEffect(() => {
    if (!finishedId) return
    const idx = data.findIndex((item) => item.id === finishedId)
    if (idx >= 0) {
      setPage(Math.floor(idx / pageSize))
    }
  }, [finishedId, data, pageSize])

  // Auto cycle pages (e.g. for projector public view)
  useEffect(() => {
    if (!autoPageIntervalMs || pageCount <= 1) return

    const interval = setInterval(() => {
      setPage((p) => (p + 1) % pageCount)
    }, autoPageIntervalMs)

    return () => clearInterval(interval)
  }, [autoPageIntervalMs, pageCount])

  return (
    <section className="bg-surface-raised/40 border border-border-subtle rounded-xl overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left font-body-md border-collapse">
          <thead>
            <tr className="border-b border-border-subtle/80 text-text-muted font-label-mono-stat text-[10px] uppercase tracking-wider">
              <th className="py-3 px-4 w-16 text-center">RANK</th>
              <th className="py-3 px-4">TIM</th>
              <th className="py-3 px-4">SEKOLAH</th>
              <th className="py-3 px-4 text-center">WAKTU</th>
              <th className="py-3 px-4 text-center">STATUS</th>
              <th className="py-3 px-4 text-right w-32">TOTAL POIN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-text-secondary font-label-mono-stat">
            {pageData.map((row, index) => {
              const isFinished = row.id === finishedId
              const rowTime = matchTimes?.get(row.id)
              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    isFinished
                      ? "bg-status-success/[0.08] ring-1 ring-status-success/40"
                      : "hover:bg-surface-container-high/20"
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                        isFinished
                          ? "bg-status-success/20 text-status-success"
                          : "bg-surface-container-high text-text-primary"
                      }`}
                    >
                      {currentPage * pageSize + index + rankOffset}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">{row.name}</span>
                      {isFinished && (
                        <span className="px-1.5 py-0.5 rounded bg-status-success/20 text-status-success font-label-mono-stat text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          Selesai
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-text-muted">{row.school}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-text-secondary tabular-nums">
                      <Timer size={12} className="text-text-muted" />
                      {rowTime?.formattedDuration ?? "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-surface-container-high text-text-secondary text-xs font-medium">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-bold text-text-primary">{row.total_score ?? 0} Poin</span>
                  </td>
                </tr>
              )
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-xs text-text-muted">
                  Tidak ada data tambahan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="p-4 border-t border-border-subtle/80 flex items-center justify-between text-text-muted font-label-mono-stat">
          <span className="text-xs">
            Menampilkan {data.length} Tim · Halaman {currentPage + 1}/{pageCount}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="h-7 text-xs px-2.5"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={currentPage >= pageCount - 1}
              className="h-7 text-xs px-2.5"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
