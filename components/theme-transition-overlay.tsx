"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ThemeTransitionOverlayProps {
  kind: "sand" | "water"
  x: number
  y: number
  radius: number
  active: boolean
}

export function ThemeTransitionOverlay({ kind, x, y, radius, active }: ThemeTransitionOverlayProps) {
  const [clipRadius, setClipRadius] = useState(0)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setClipRadius(active ? radius : 0))
    return () => cancelAnimationFrame(raf)
  }, [active, radius])

  return (
    <div
      className={cn("theme-transition-overlay", kind === "sand" ? "theme-transition-sand" : "theme-transition-water")}
      style={{ clipPath: `circle(${clipRadius}px at ${x}px ${y}px)` }}
      aria-hidden="true"
    >
      {kind === "water" && (
        <svg className="theme-transition-waves" viewBox="0 0 2400 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,50 C200,90 400,10 600,50 C800,90 1000,10 1200,50 C1400,90 1600,10 1800,50 C2000,90 2200,10 2400,50 L2400,100 L0,100 Z" />
        </svg>
      )}
      {kind === "sand" && (
        <>
          <span className="theme-transition-grain" style={{ left: "12%", top: "18%" }} />
          <span className="theme-transition-grain" style={{ left: "78%", top: "24%" }} />
          <span className="theme-transition-grain" style={{ left: "34%", top: "62%" }} />
          <span className="theme-transition-grain" style={{ left: "58%", top: "76%" }} />
          <span className="theme-transition-grain" style={{ left: "88%", top: "58%" }} />
        </>
      )}
    </div>
  )
}
