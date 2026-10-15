"use client"

import { Radio } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { ScrollText } from "@/components/scroll-text"
import { Reveal } from "@/components/reveal"
import { IconBadge } from "@/components/icon-badge"

export function ProfessionalSummary() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="professional-summary" title={t.professionalSummary.title}>
      <article className="mx-auto max-w-5xl">
        <ScrollText text={t.professionalSummary.content} className="text-foreground" />

        <Reveal delay={120} className="mt-12 flex max-w-2xl items-start gap-4">
          <IconBadge icon={Radio} size="md" />
          <p className="max-w-[60ch] pt-1 text-base leading-relaxed text-foreground/80">{t.professionalSummary.atsStatement}</p>
        </Reveal>
      </article>
    </SectionWrapper>
  )
}
