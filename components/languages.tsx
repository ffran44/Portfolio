"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"

export function Languages() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="languages" title={t.languages.title}>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        {t.languages.items.map((lang, index) => (
          <article key={index} className="p-6 rounded-lg bg-card border border-border text-center">
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{lang.name}</h3>
            <p className="text-muted-foreground">{lang.level}</p>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
