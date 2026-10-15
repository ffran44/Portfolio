"use client"

import { useEffect } from "react"
import { prefersReducedMotion } from "@/lib/motion"

/** Every click sends two rings across the surface, like a drop landing on water. */
export function ClickRipple() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const layer = document.createElement("div")
    layer.className = "ripple-layer"
    layer.setAttribute("aria-hidden", "true")
    document.body.appendChild(layer)

    const handleDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      for (let i = 0; i < 2; i++) {
        const ring = document.createElement("span")
        ring.className = "ripple-ring"
        ring.style.left = `${e.clientX}px`
        ring.style.top = `${e.clientY}px`
        ring.style.animationDelay = `${i * 140}ms`
        layer.appendChild(ring)
        ring.addEventListener("animationend", () => ring.remove(), { once: true })
      }
    }

    window.addEventListener("pointerdown", handleDown, { passive: true })
    return () => {
      window.removeEventListener("pointerdown", handleDown)
      layer.remove()
    }
  }, [])

  return null
}
