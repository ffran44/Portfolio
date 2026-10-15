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

    let observer: IntersectionObserver | undefined

    const start = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer?.disconnect()
          }
        },
        { threshold: 0.4 },
      )
      observer.observe(el)
    }

    // While the entrance curtain is up, hold the letters until it has lifted.
    if (document.documentElement.classList.contains("preload")) {
      window.addEventListener("preload-done", start, { once: true })
    } else {
      start()
    }

    return () => {
      window.removeEventListener("preload-done", start)
      observer?.disconnect()
    }
  }, [])

  const words = text.split(" ")
  let slot = 0

  return createElement(
    as,
    { ref, className, "aria-label": text },
    words.flatMap((word, wordIndex) => {
      const group = createElement(
        "span",
        { key: `word-${wordIndex}`, className: "wave-word", "aria-hidden": "true" },
        Array.from(word).map((ch) => {
          const i = slot++
          return createElement(
            "span",
            {
              key: i,
              className: `wave-char ${visible ? "wave-char-visible" : ""}`,
              style: { transitionDelay: `${i * delayStep}s` },
            },
            ch,
          )
        }),
      )
      slot++ // the gap between words keeps its own beat in the cascade
      return wordIndex < words.length - 1 ? [group, " "] : [group]
    }),
  )
}
