"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { CheckCircle2 } from "lucide-react"

export function OperationalImpact() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="operational-impact" title={t.operationalImpact.title}>
      <div className="max-w-4xl mx-auto">
        <ul className="space-y-3">
          {t.operationalImpact.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="text-foreground/90 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  )
}
