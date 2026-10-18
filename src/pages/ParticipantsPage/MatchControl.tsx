import { Flag, Play, Shuffle, Lock } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useParticipants, type Participant } from "@/hooks/useParticipants"
import { useMatchState } from "@/hooks/useMatchState"

const EXCLUDED_STATUSES = ["locked", "done"]

/**
 * Queue rule: a team enters the arena queue while it has no points yet and has not been
 * played. The first correct answer awards +10, which removes it from the queue
 * automatically; a team that already ran (status `done`, e.g. after a timeout with zero
 * points) must not be offered again.
 */
function isQueued(participant: Participant) {
  return (participant.total_score ?? 0) === 0 && !EXCLUDED_STATUSES.includes(participant.status ?? "")
}

function openMatch(participantId: string) {
  return `/match-control?participant=${participantId}`
}

export function MatchControl() {
  const navigate = useNavigate()
  const { participants, error: fetchError } = useParticipants()
  const { setCurrentParticipant } = useMatchState()
  const [actionError, setActionError] = useState<string | null>(null)
  const [shuffleKey, setShuffleKey] = useState(0)

  const queue = useMemo(() => participants.filter(isQueued), [participants])

  const next: Participant | undefined = useMemo(() => {
    if (queue.length === 0) return undefined
    const index = shuffleKey % queue.length
    return queue[index]
  }, [queue, shuffleKey])

  const lockNext = async () => {
    if (!next) return
    setActionError(null)
    const { error } = await supabase
      .from('participants')
      .update({ status: 'locked' })
      .eq('id', next.id)

    if (error) setActionError(error.message)
  }

  return (
    <div className="bg-surface-raised rounded-xl border border-border-subtle p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-1.5">
          <Flag size={16} className="text-text-primary" />
          <span className="font-label-mono-stat text-[11px] text-text-muted uppercase tracking-wider font-semibold">Kontrol Pertandingan</span>
        </div>
        <span className="inline-flex items-center gap-1 font-label-mono-stat text-[11px] text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
          {queue.length} ANTREAN
        </span>
      </div>

      <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-text-muted text-[10px] uppercase tracking-wider">NEXT MATCH</span>
          {next && <span className="font-label-mono-stat text-[10px] text-text-muted">ANTREAN #{queue.indexOf(next) + 1}</span>}
        </div>
        <div>
          <div className="text-lg font-bold text-text-primary tracking-tight">{next?.name ?? "Antrean kosong"}</div>
          <div className="font-body-sm text-text-muted text-[12px] mt-0.5">{next?.school ?? "Tambahkan peserta untuk memulai match"}</div>
        </div>
        <Button
          className="w-full h-9 mt-1 bg-primary text-gray-900 font-semibold cursor-pointer shadow-sm text-[13px]"
          disabled={!next}
          onClick={async () => {
            if (!next) return
            await setCurrentParticipant(next.id)
            navigate(openMatch(next.id))
          }}
        >
          <Play size={16} fill="currentColor" className="mr-2" />
          Match Start
        </Button>
      </div>

      {(actionError || fetchError) && (
        <p className="font-body-sm text-[11px] text-status-warning break-words">
          {actionError ?? fetchError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => setShuffleKey((k) => k + 1)}
          disabled={queue.length === 0}
          className="h-8 bg-surface-container border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-[12px]"
        >
          <Shuffle size={14} className="mr-1.5" />
          Shuffle
        </Button>
        <Button
          variant="outline"
          onClick={lockNext}
          disabled={!next}
          className="h-8 bg-surface-container border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-[12px]"
        >
          <Lock size={14} className="mr-1.5" />
          Kunci
        </Button>
      </div>
    </div>
  )
}