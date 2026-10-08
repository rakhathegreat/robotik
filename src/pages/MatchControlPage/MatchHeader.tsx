import { PauseCircle, BadgeCheck, RefreshCw, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MatchHeader() {
  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-border-subtle">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest border border-border-subtle flex items-center justify-center text-text-primary text-lg font-bold">
              <Bot size={24} className="text-text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg text-text-primary font-bold tracking-tight">RoboStar Alpha</h1>
              </div>
              <p className="font-medium text-xs text-text-secondary mt-0.5">SD Bina Prestasi Jakarta</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-surface-raised border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-xs">
              <RefreshCw size={13} className="mr-1.5" />
              Reset Match
            </Button>
            <Button variant="outline" size="sm" className="bg-surface-raised border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-xs">
              <PauseCircle size={14} className="text-status-warning mr-1.5" />
              Pause Match
            </Button>
            <Button size="sm" className="bg-primary text-on-primary text-xs font-semibold shadow-sm">
              <BadgeCheck size={14} className="mr-1.5" />
              Selesai
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
