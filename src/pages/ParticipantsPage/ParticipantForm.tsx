import { UserPlus, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ParticipantForm() {
  return (
    <div className="bg-surface-raised rounded-xl border border-border-subtle p-3 flex flex-col gap-3 shadow-sm">
      <div className="flex flex-col gap-0.5 pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-1.5">
          <UserPlus size={14} className="text-text-primary" />
          <h2 className="text-[14px] font-bold text-text-primary tracking-tight">Tambah Peserta Baru</h2>
        </div>
        <p className="font-body-sm text-text-muted text-[10px]">Input data tim untuk antrean arena</p>
      </div>
      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-mono-stat text-text-secondary text-xs font-semibold">Nama Tim</label>
          <input className="w-full bg-surface-base text-text-primary text-xs px-2.5 py-1.5 rounded-md border border-border-subtle focus:outline-none transition-colors" placeholder="Contoh: RoboStar Beta" required type="text" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-mono-stat text-text-secondary text-xs font-semibold">Asal Sekolah</label>
          <input className="w-full bg-surface-base text-text-primary text-xs px-2.5 py-1.5 rounded-md border border-border-subtle focus:outline-none transition-colors" placeholder="Contoh: SD Negeri Menteng 01" required type="text" />
        </div>
        <div className="pt-0.5">
          <Button className="w-full h-8 bg-primary text-gray-900 text-xs font-semibold rounded-md hover:bg-neutral-200 cursor-pointer" type="submit">
            <PlusCircle size={14} className="mr-1.5" />
            Simpan Peserta
          </Button>
        </div>
      </form>
    </div>
  )
}
