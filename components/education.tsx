"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { IconBadge } from "@/components/icon-badge"
import { GraduationCap } from "lucide-react"

export function Education() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="education" title={t.education.title}>
      <div className="max-w-4xl mx-auto space-y-4">
        {t.education.items.map((edu, index) => (
          <article
            key={index}
            className="group flex items-start gap-4 p-6 rounded-lg bg-card border border-border"
          >
            <IconBadge icon={GraduationCap} size="lg" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
              <p className="text-muted-foreground mt-1">{edu.institution}</p>
              {edu.period && <p className="text-sm text-muted-foreground mt-1">{edu.period}</p>}
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
