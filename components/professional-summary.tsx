"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"

export function ProfessionalSummary() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="professional-summary" title={t.professionalSummary.title}>
      <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
        <p className="text-foreground/90 leading-relaxed text-balance">{t.professionalSummary.content}</p>
        <p className="text-foreground/80 leading-relaxed text-balance mt-4">{t.professionalSummary.atsStatement}</p>
      </article>
    </SectionWrapper>
  )
}
