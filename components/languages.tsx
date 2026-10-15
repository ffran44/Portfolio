"use client"

import type { CSSProperties } from "react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"

// How full each meter fills, in the same order as the language list (native = full).
const LEVELS = [1, 0.62]

export function Languages() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="languages" title={t.languages.title}>
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-14">
        {t.languages.items.map((lang, index) => (
          <Reveal key={index} variant="up" delay={index * 120} className="lang">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{lang.name}</h3>
              <p className="text-base font-semibold text-accent">{lang.level}</p>
            </div>
            <div className="lang-meter" style={{ "--lvl": LEVELS[index % LEVELS.length] } as CSSProperties} aria-hidden="true">
              <span className="lang-fill" />
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
