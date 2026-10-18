import { UserPlus, PlusCircle, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Participant } from "@/hooks/useParticipants"

type ParticipantFormProps = {
  /** Participant being edited, or null to add a new one. */
  editing: Participant | null
  onDone: () => void
}

export function ParticipantForm({ editing, onDone }: ParticipantFormProps) {
  const [name, setName] = useState("")
  const [school, setSchool] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(editing?.name ?? "")
    setSchool(editing?.school ?? "")
    setError(null)
  }, [editing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedSchool = school.trim()
    if (!trimmedName || !trimmedSchool) return

    setIsSubmitting(true)
    setError(null)

    const payload = { name: trimmedName, school: trimmedSchool }
    const { error: saveError } = editing
      ? await supabase.from('participants').update(payload).eq('id', editing.id)
      : await supabase.from('participants').insert([payload])

    setIsSubmitting(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    // Editing resets the fields through the `editing` effect; a fresh insert needs
    // to be cleared explicitly because `editing` stays null.
    if (!editing) {
      setName("")
      setSchool("")
    }
    onDone()
  }

  return (
    <div className="bg-surface-raised rounded-xl border border-border-subtle p-3 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-subtle">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <UserPlus size={14} className="text-text-primary" />
            <h2 className="text-[14px] font-bold text-text-primary tracking-tight">
              {editing ? "Ubah Data Peserta" : "Tambah Peserta Baru"}
            </h2>
          </div>
          <p className="font-body-sm text-text-muted text-[10px]">
            {editing ? "Perbarui data tim yang sudah terdaftar" : "Input data tim untuk antrean arena"}
          </p>
        </div>
        {editing && (
          <Button variant="ghost" size="icon-xs" type="button" onClick={onDone} title="Batal ubah">
            <X size={14} className="text-text-muted" />
          </Button>
        )}
      </div>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-mono-stat text-text-secondary text-xs font-semibold">Nama Tim</label>
          <input 
            className="w-full bg-surface-base text-text-primary text-xs px-2.5 py-1.5 rounded-md border border-border-subtle focus:outline-none transition-colors" 
            placeholder="Contoh: RoboStar Beta" 
            required 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-mono-stat text-text-secondary text-xs font-semibold">Asal Sekolah</label>
          <input 
            className="w-full bg-surface-base text-text-primary text-xs px-2.5 py-1.5 rounded-md border border-border-subtle focus:outline-none transition-colors" 
            placeholder="Contoh: SD Negeri Menteng 01" 
            required 
            type="text" 
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        {error && (
          <p className="font-body-sm text-[11px] text-status-warning break-words">
            Gagal menyimpan peserta: {error}
          </p>
        )}
        <div className="pt-0.5">
          <Button className="w-full h-8 bg-primary text-gray-900 text-xs font-semibold rounded-md hover:bg-neutral-200 cursor-pointer" type="submit" disabled={isSubmitting}>
            {editing ? <Save size={14} className="mr-1.5" /> : <PlusCircle size={14} className="mr-1.5" />}
            {isSubmitting ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan Peserta"}
          </Button>
        </div>
      </form>
    </div>
  )
}
