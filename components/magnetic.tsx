"use client"

import { useRef, type PointerEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MagneticProps {
  children: ReactNode
  className?: string
  /** How far the child follows the cursor, as a fraction of the offset. */
  strength?: number
}

/** Pulls its child a few pixels toward the cursor, then lets it settle back. Mouse only. */
export function Magnetic({ children, className, strength = 0.28 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const handleMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate3d(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px, 0)`
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)"
  }

  return (
    <span ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} className={cn("magnetic", className)}>
      {children}
    </span>
  )
}
