"use client"

import type { ReactNode } from "react"
import { Reveal } from "@/components/reveal"
import { WaveText } from "@/components/wave-text"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  id: string
  title: string
  children: ReactNode
  /** "soft" lays a faint tone step behind the section so neighbouring sections read as different zones. */
  tone?: "plain" | "soft"
  className?: string
}

export function SectionWrapper({ id, title, children, tone = "plain", className }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-4 px-4 py-24 md:py-32", tone === "soft" && "section-soft", className)}
    >
      <div className="container mx-auto max-w-7xl">
        <header className="mb-14 flex flex-col items-center md:mb-20">
          <WaveText
            as="h2"
            text={title}
            className="text-balance text-center font-serif text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] text-foreground"
          />
          <Reveal className="section-wave mt-5" variant="scale" delay={250}>
            <svg width="132" height="14" viewBox="0 0 132 14" fill="none" aria-hidden="true">
              <path
                d="M2 7 C14 -1 24 15 36 7 C48 -1 58 15 70 7 C82 -1 92 15 104 7 C116 -1 124 13 130 7"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </Reveal>
        </header>

        {children}
      </div>
    </section>
  )
}
