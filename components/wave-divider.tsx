import { cn } from "@/lib/utils"

const WAVE =
  "M0,60 C150,100 350,10 600,55 C850,100 1050,15 1200,55 C1350,95 1550,15 1800,55 C2050,95 2250,20 2400,60 L2400,120 L0,120 Z"

/** Two layers of tide drifting at different speeds, used as the seam between sections. */
export function WaveDivider({ flip = false, className }: { flip?: boolean; className?: string }) {
  return (
    <div
      className={cn("wave-divider pointer-events-none relative h-16 overflow-hidden md:h-24", flip && "rotate-180", className)}
      aria-hidden="true"
    >
      <svg className="wave-divider-layer wave-divider-back" viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d={WAVE} />
      </svg>
      <svg className="wave-divider-layer wave-divider-front" viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d={WAVE} />
      </svg>
    </div>
  )
}
