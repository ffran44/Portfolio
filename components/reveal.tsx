"use client"

import { createElement, useRef, type CSSProperties, type ReactNode } from "react"
import { useInView } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Variant = "up" | "left" | "right" | "scale" | "mask"

interface RevealProps {
  children: ReactNode
  as?: "div" | "li" | "article" | "p" | "span" | "section" | "h3" | "ul"
  variant?: Variant
  /** Delay in ms, used to stagger siblings (60-90ms apart reads best). */
  delay?: number
  className?: string
  style?: CSSProperties
}

/** Fades, lifts and un-blurs its content once, the first time it scrolls into view. */
export function Reveal({ children, as = "div", variant = "up", delay = 0, className, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)

  return createElement(
    as,
    {
      ref,
      "data-reveal": variant,
      "data-in": inView ? "true" : "false",
      className: cn("reveal", className),
      style: { "--d": `${delay}ms`, ...style } as CSSProperties,
    },
    children,
  )
}
