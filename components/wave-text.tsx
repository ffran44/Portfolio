"use client"

import { createElement, useEffect, useRef, useState } from "react"

interface WaveTextProps {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "span"
  delayStep?: number
}

export function WaveText({ text, className, as = "span", delayStep = 0.035 }: WaveTextProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const chars = Array.from(text)

  return createElement(
    as,
    { ref, className, "aria-label": text },
    chars.map((ch, i) =>
      createElement(
        "span",
        {
          key: i,
          "aria-hidden": "true",
          className: `wave-char ${visible ? "wave-char-visible" : ""}`,
          style: { transitionDelay: `${i * delayStep}s` },
        },
        ch === " " ? " " : ch,
      ),
    ),
  )
}
