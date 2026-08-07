"use client"

import { type CSSProperties, useEffect, useRef, useState } from "react"

// Deterministic pseudo-random bubble configs (no hydration mismatch)
const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 43 + 7) % 100,
  size: 3 + ((i * 11) % 5),
  duration: 14 + ((i * 17) % 12),
  delay: (i * 2.3) % 14,
  drift: ((i % 6) - 3) * 18,
}))

export function InteractiveBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const [bubblesEnabled, setBubblesEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBubblesEnabled(true)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(pointer: coarse)").matches) return

    let raf = 0
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`)
        el.style.setProperty("--my", `${e.clientY}px`)
      })
    }

    window.addEventListener("mousemove", handleMove)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-blob ambient-blob-3" />
      <div className="ambient-spotlight" />
      {bubblesEnabled && (
        <div className="absolute inset-0">
          {BUBBLES.map((b, i) => (
            <span
              key={i}
              className="ash-particle"
              style={
                {
                  left: `${b.left}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  animationDuration: `${b.duration}s`,
                  animationDelay: `${b.delay}s`,
                  "--drift": `${b.drift}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
