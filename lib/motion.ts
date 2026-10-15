"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/* ---------------------------------------------------------------------------
   Scroll bus: one passive listener + one rAF per frame for the whole page.
   Subscribers read layout first and write styles second, so a dozen scroll-linked
   effects cost one layout pass instead of a dozen.
--------------------------------------------------------------------------- */

type ScrollListener = (viewportHeight: number) => void

const listeners = new Set<ScrollListener>()
let frame = 0

function flush() {
  frame = 0
  const vh = window.innerHeight
  listeners.forEach((listener) => listener(vh))
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush)
}

export function subscribeScroll(listener: ScrollListener) {
  if (listeners.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
  }
  listeners.add(listener)
  listener(window.innerHeight)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

interface ProgressOptions {
  /** Viewport fraction where the element's top means progress 0 (default 0.9). */
  start?: number
  /** Viewport fraction where the element's bottom means progress 1 (default 0.5). */
  end?: number
  /** CSS custom property written on the element (default --p). */
  name?: string
}

/**
 * Writes the element's scroll progress (0 to 1) to a CSS custom property, so
 * styles can react without re-rendering React. With reduced motion it jumps to 1.
 */
export function useProgressVar<T extends HTMLElement>({ start = 0.9, end = 0.5, name = "--p" }: ProgressOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      el.style.setProperty(name, "1")
      return
    }

    return subscribeScroll((vh) => {
      const rect = el.getBoundingClientRect()
      const startLine = vh * start
      const travel = startLine - vh * end + rect.height
      const progress = Math.min(1, Math.max(0, (startLine - rect.top) / travel))
      el.style.setProperty(name, progress.toFixed(4))
    })
  }, [start, end, name])

  return ref
}

/** True once the element has entered the viewport (and stays true when `once`). */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { once = true, margin = "0px 0px -12% 0px", threshold = 0.05 } = {},
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin: margin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, once, margin, threshold])

  return inView
}
