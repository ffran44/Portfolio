"use client"

import type { CSSProperties } from "react"
import { useEffect, useState } from "react"

// Deterministic pseudo-random particle configs (no hydration mismatch)
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53 + 11) % 100,
  size: 2 + ((i * 7) % 3),
  duration: 9 + ((i * 13) % 8),
  delay: (i * 1.7) % 9,
  drift: ((i % 5) - 2) * 14,
}))

export function AshParticles() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnabled(true)
    }
  }, [])

  if (!enabled) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="ash-particle"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
