"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"

/** Four bars that fill up like a signal meter when the line scrolls in. */
function Signal() {
  return (
    <span className="impact-signal" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

export function OperationalImpact() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="operational-impact" title={t.operationalImpact.title}>
      <ul className="mx-auto flex max-w-5xl flex-col gap-12 md:gap-16">
        {t.operationalImpact.items.map((item, index) => {
          const flip = index % 2 === 1
          return (
            <Reveal
              key={index}
              as="li"
              variant={flip ? "right" : "left"}
              className={cn("impact-row flex items-center gap-5 md:w-[82%] md:gap-8", flip && "md:ml-auto md:flex-row-reverse md:text-right")}
            >
              <Signal />
              <p className="max-w-[40ch] text-balance text-xl font-medium leading-snug text-foreground md:text-2xl">{item}</p>
            </Reveal>
          )
        })}
      </ul>
    </SectionWrapper>
  )
}
