import { Search, Plus, Filter, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuestionsHeader() {
  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
      <div>
        <h1 className="text-xl text-text-primary font-bold tracking-tight">Manajemen Soal</h1>
        <p className="text-text-secondary text-xs mt-0.5">Kelola bank soal matematika elementer untuk digunakan dalam match arena.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        {/* Search Bar */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
          <input 
            type="text" 
            placeholder="Cari soal..." 
            className="w-full h-9 pl-8 pr-3 bg-surface-raised border border-border-subtle rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon-sm" className="h-9 w-9 bg-surface-raised border-border-subtle text-text-secondary hover:text-text-primary">
            <Filter size={14} />
          </Button>
          <Button variant="outline" size="sm" className="h-9 bg-surface-raised border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-xs font-medium">
            <FileUp size={14} className="mr-1.5" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button size="sm" className="h-9 bg-primary text-on-primary text-xs font-semibold shadow-sm">
            <Plus size={16} className="mr-1.5" />
            Tambah Soal
          </Button>
        </div>
      </div>
    </section>
  )
}
