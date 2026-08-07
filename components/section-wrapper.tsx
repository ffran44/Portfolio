"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"

interface SectionWrapperProps {
  id: string
  title: string
  children: ReactNode
}

export function SectionWrapper({ id, title, children }: SectionWrapperProps) {
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
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id={id}
      className={`py-20 px-4 relative section-reveal ${visible ? "section-reveal-visible" : ""}`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

      <div className="container max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{title}</h2>
          <div className="flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-accent/70" />
            <span className="w-2 h-2 rotate-45 border border-accent/80 bg-accent/20" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-accent/70" />
          </div>
        </header>

        {children}
      </div>
    </section>
  )
}
