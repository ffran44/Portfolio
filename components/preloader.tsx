"use client"

import { useEffect, useState } from "react"

/**
 * A short entrance curtain: the monogram fills like a glass of water, then the whole
 * curtain lifts away. It runs once per session. The `preload` class is set by the inline
 * script in the document head before first paint (so returning visitors never see a flash),
 * and removed here, which also releases the hero entrance and the heading letters.
 */
export function Preloader() {
  const [phase, setPhase] = useState<"idle" | "fill" | "leave" | "done">("idle")

  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains("preload")) {
      setPhase("done")
      return
    }

    setPhase("fill")
    const lift = window.setTimeout(() => setPhase("leave"), 1300)
    const finish = window.setTimeout(() => {
      root.classList.remove("preload")
      try {
        sessionStorage.setItem("fr-seen", "1")
      } catch {
        // Storage can be blocked; the curtain just runs again next visit.
      }
      window.dispatchEvent(new Event("preload-done"))
      setPhase("done")
    }, 2250)

    return () => {
      window.clearTimeout(lift)
      window.clearTimeout(finish)
    }
  }, [])

  if (phase === "done") return null

  return (
    <div className="preloader" data-phase={phase} aria-hidden="true">
      <div className="preloader-mark font-serif">
        <span className="preloader-ghost">FR</span>
        <span className="preloader-fill">FR</span>
      </div>
    </div>
  )
}
