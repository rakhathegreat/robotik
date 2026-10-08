import { Search, Filter, RefreshCw, Play, Edit2, Trash2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
const mockData = [
  { id: "01", name: "RoboStar Alpha", school: "SD Bina Prestasi Jakarta", status: "Hadir", statusColor: "status-success", dim: false },
  { id: "02", name: "Techno Bot 9", school: "SDIT Nurul Fikri", status: "Hadir", statusColor: "status-success", dim: false },
  { id: "03", name: "Garuda Cyber Junior", school: "SD Taruna Bangsa", status: "Hadir", statusColor: "status-success", dim: false },
  { id: "04", name: "Al-Azhar Robo Squad", school: "SD Islam Al-Azhar 1", status: "Hadir", statusColor: "status-success", dim: false },
  { id: "05", name: "Cahaya Cendekia Tech", school: "SD Cendekia Harapan", status: "Terdaftar", statusColor: "status-warning", dim: false },
  { id: "06", name: "Santa Maria Micro-Minds", school: "SDK Santa Maria", status: "Hadir", statusColor: "status-success", dim: false },
  { id: "07", name: "Ksatria Bintang Robot", school: "SD Bintang Bangsa", status: "Mundur", statusColor: "text-muted", dim: true },
]

export function ParticipantsTable() {
  const [search, setSearch] = useState("")

  const filteredData = mockData.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.school.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-space-md h-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-low p-2 rounded-xl border border-border-subtle">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="w-full bg-surface-base text-text-primary text-xs pl-8 pr-3 py-1.5 rounded-md border border-border-subtle focus:outline-none transition-colors"
            placeholder="Cari nama tim atau asal sekolah..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-surface-container border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary">
            <Filter size={12} className="mr-1.5" />
            Filter Status
          </Button>
          <Button variant="outline" size="icon-sm" className="bg-surface-container border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary" title="Muat ulang data">
            <RefreshCw size={12} />
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
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-body-sm text-text-secondary">
              {filteredData.map((row, i) => (
                <tr key={row.id} className={`hover:bg-surface-container-high/60 transition-colors group ${i === 0 ? 'bg-surface-container-low/30' : ''} ${row.dim ? 'opacity-60' : ''}`}>
                  <td className={`py-2 px-3 font-label-mono-stat text-center text-xs ${i === 0 ? 'text-text-primary font-bold' : 'text-text-muted'}`}>{row.id}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded border border-border-subtle flex items-center justify-center ${i === 0 ? 'bg-surface-container-high text-text-primary' : row.dim ? 'bg-surface-container text-text-muted' : 'bg-surface-container text-text-secondary'}`}>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                          <circle cx="12" cy="5" r="2"></circle>
                          <path d="M12 7v4"></path>
                          <line x1="8" y1="16" x2="8.01" y2="16"></line>
                          <line x1="16" y1="16" x2="16.01" y2="16"></line>
                        </svg>
                      </div>
                      <span className={`text-xs font-semibold ${row.dim ? 'text-text-secondary' : 'text-text-primary group-hover:text-text-primary'} transition-colors`}>{row.name}</span>
                    </div>
                  </td>
                  <td className={`py-2 px-3 text-xs font-semibold ${row.dim ? 'text-text-muted' : 'text-text-secondary'}`}>{row.school}</td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={row.statusColor === 'status-success' ? 'default' : row.statusColor === 'status-warning' ? 'secondary' : 'outline'} className="font-label-mono-stat">
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {i === 0 ? (
                        <Button size="xs" className="h-6 bg-primary text-gray-900 font-label-mono-stat text-xs font-semibold hover:bg-neutral-200">
                          <Play size={11} fill="currentColor" className="mr-1" />
                          Start
                        </Button>
                      ) : !row.dim ? (
                        <Button variant="outline" size="xs" className="h-6 bg-surface-container border-border-subtle text-text-primary font-label-mono-stat text-xs hover:border-border-strong">
                          <Play size={11} fill="currentColor" className="mr-1" />
                          Start
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon-xs" className="text-text-muted hover:text-text-primary hover:bg-surface-container" title="Edit Peserta">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon-xs" className={row.dim ? 'text-error hover:text-on-surface hover:bg-surface-container' : 'text-text-muted hover:text-error hover:bg-surface-container'} title="Hapus Peserta">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-space-md py-3 bg-surface-container-lowest border-t border-border-subtle flex items-center justify-between">
          <span className="font-label-mono-stat text-text-muted text-[11px]">Halaman 1 dari 5 • 35 Peserta</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-6 font-label-mono-stat text-[11px] bg-surface-container border-border-subtle text-text-muted opacity-50 cursor-not-allowed" disabled>Sebelumnya</Button>
            <Button variant="outline" size="sm" className="h-6 font-label-mono-stat text-[11px] bg-surface-container border-border-subtle text-text-primary hover:border-border-strong">Berikutnya</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
