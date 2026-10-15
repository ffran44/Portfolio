"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Maximum tilt in degrees. */
  max?: number
}

/**
 * A surface that leans toward the cursor and catches a soft light where it points.
 * Mouse only: touch and pen skip it, so scrolling on a phone never fights the card.
 */
export function TiltCard({ children, className, style, max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`)
      el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`)
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`)
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`)
    })
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
  }

  return (
    <div ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} className={cn("tilt", className)} style={style}>
      {children}
    </div>
  )
}
