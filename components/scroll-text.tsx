"use client"

import type { CSSProperties } from "react"
import { useProgressVar } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface ScrollTextProps {
  text: string
  className?: string
}

/**
 * A paragraph that is read into focus: words sit dim until the scroll reaches them,
 * then light up one after another. The text stays real text for screen readers; only
 * one CSS variable updates per frame, every word derives its own opacity from it.
 */
export function ScrollText({ text, className }: ScrollTextProps) {
  const ref = useProgressVar<HTMLParagraphElement>({ start: 0.88, end: 0.42 })
  const words = text.split(/\s+/)

  return (
    <p ref={ref} className={cn("scroll-text", className)} style={{ "--n": words.length } as CSSProperties}>
      {words.map((word, i) => (
        <span key={i} className="scroll-word" style={{ "--i": i } as CSSProperties}>
          {word}{" "}
        </span>
      ))}
    </p>
  )
}
