import { MoreVertical, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const QUESTIONS_DATA = [
  { id: "Q-001", type: "Penjumlahan", content: "18 + 14 = ?", answer: "32", points: 10, difficulty: "Mudah", used: 12 },
  { id: "Q-002", type: "Pengurangan", content: "63 - 28 = ?", answer: "35", points: 10, difficulty: "Sedang", used: 8 },
  { id: "Q-003", type: "Perkalian", content: "12 × 4 = ?", answer: "48", points: 15, difficulty: "Sedang", used: 5 },
  { id: "Q-004", type: "Pembagian", content: "72 ÷ 8 = ?", answer: "9", points: 15, difficulty: "Sedang", used: 7 },
  { id: "Q-005", type: "Campuran", content: "(15 + 5) × 2 = ?", answer: "40", points: 20, difficulty: "Sulit", used: 3 },
  { id: "Q-006", type: "Penjumlahan", content: "125 + 45 = ?", answer: "170", points: 10, difficulty: "Mudah", used: 15 },
  { id: "Q-007", type: "Pengurangan", content: "100 - 37 = ?", answer: "63", points: 10, difficulty: "Mudah", used: 10 },
  { id: "Q-008", type: "Perkalian", content: "15 × 6 = ?", answer: "90", points: 15, difficulty: "Sedang", used: 6 },
]

export function QuestionsList() {
  return (
    <div className="flex-1 w-full flex flex-col gap-3">

      {/* Main Table */}
      <div className="flex-1 rounded-xl bg-surface border border-border-subtle shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-raised">
                <th className="py-2 px-3 font-label-md text-[10px] text-text-muted font-semibold uppercase tracking-wider w-1/4">ID</th>
                <th className="py-2 px-3 font-label-md text-[10px] text-text-muted font-semibold uppercase tracking-wider w-1/4">Soal (Ekspresi)</th>
                <th className="py-2 px-3 font-label-md text-[10px] text-text-muted font-semibold uppercase tracking-wider w-1/4">Jawaban</th>
                <th className="py-2 px-3 font-label-md text-[10px] text-text-muted font-semibold uppercase tracking-wider text-right w-1/4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {QUESTIONS_DATA.map((q) => (
                <tr key={q.id} className="hover:bg-surface-raised/50 transition-colors group">
                  <td className="py-2 px-3">
                    <span className="font-label-mono-stat text-[11px] text-text-secondary">{q.id}</span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-md bg-surface-container border border-border-subtle font-black text-sm tracking-tight text-text-primary">
                        {q.content}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-black text-sm text-status-success">{q.answer}</span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-xs" className="text-text-secondary hover:text-text-primary hover:bg-surface-container" title="Edit Soal">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon-xs" className="text-text-secondary hover:text-status-error hover:bg-status-error/10" title="Hapus Soal">
                        <Trash2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon-xs" className="text-text-secondary hover:text-text-primary hover:bg-surface-container">
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border-subtle bg-surface-raised flex items-center justify-between">
          <span className="font-body-sm text-[11px] text-text-muted hidden sm:inline-block">Menampilkan 1-8 dari 142 soal</span>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" text="Sebelumnya" className="h-7 text-[11px] px-2.5 pointer-events-none opacity-50" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="h-7 text-[11px] px-2.5">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="h-7 text-[11px] px-2.5">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" text="Selanjutnya" className="h-7 text-[11px] px-2.5" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
