import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const standingsData = [
  { rank: "04", name: "Al-Azhar Robo Squad", school: "SD Islam Al-Azhar 1", solved: "4 / 5 Soal", time: "03:15.40", points: "37 Poin" },
  { rank: "05", name: "Cahaya Cendekia Tech", school: "SD Cendekia Harapan", solved: "3 / 5 Soal", time: "03:30.15", points: "30 Poin" },
  { rank: "06", name: "Santa Maria Micro-Minds", school: "SDK Santa Maria", solved: "3 / 5 Soal", time: "03:52.00", points: "28 Poin" },
  { rank: "07", name: "Ksatria Bintang Robot", school: "SD Bintang Bangsa", solved: "2 / 5 Soal", time: "04:10.50", points: "20 Poin" },
  { rank: "08", name: "Cyber Rangers", school: "SMP Global Mandiri", solved: "2 / 5 Soal", time: "04:15.20", points: "18 Poin" },
  { rank: "09", name: "Tech Geniuses", school: "SD Pelita Harapan", solved: "1 / 5 Soal", time: "04:30.00", points: "15 Poin" },
  { rank: "10", name: "Future Innovators", school: "SD IT Al-Hikmah", solved: "1 / 5 Soal", time: "04:45.10", points: "10 Poin" },
]

export function StandingsTable() {
  return (
    <section className="bg-surface-raised/40 border border-border-subtle rounded-xl overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left font-body-md border-collapse">
          <thead>
            <tr className="border-b border-border-subtle/80 text-text-muted font-label-mono-stat text-[10px] uppercase tracking-wider">
              <th className="py-3 px-4 w-16 text-center">RANK</th>
              <th className="py-3 px-4">TIM</th>
              <th className="py-3 px-4">ASAL SEKOLAH</th>
              <th className="py-3 px-4 text-center">SOAL</th>
              <th className="py-3 px-4 text-right font-mono">WAKTU</th>
              <th className="py-3 px-4 text-right w-32">TOTAL POIN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-text-secondary font-label-mono-stat">
            {standingsData.map((row) => (
              <tr key={row.rank} className="hover:bg-surface-container-high/20 transition-colors">
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container-high text-text-primary text-xs font-bold">{row.rank}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs font-semibold text-text-primary">{row.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs font-medium text-text-muted">{row.school}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-surface-container-high text-text-secondary text-xs font-medium">{row.solved}</span>
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-text-secondary">{row.time}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-xs font-bold text-text-primary">{row.points}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shadcn Pagination */}
      <div className="p-4 border-t border-border-subtle/80 flex items-center justify-between text-text-muted font-label-mono-stat">
        <span className="text-xs">4 - 10 dari 35 Tim</span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                text="Sebelumnya" 
                className="h-7 text-xs px-2 cursor-not-allowed opacity-50"
                aria-disabled
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="h-7 w-7 text-xs">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="h-7 w-7" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                href="#" 
                text="Berikutnya" 
                className="h-7 text-xs px-2"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  )
}
