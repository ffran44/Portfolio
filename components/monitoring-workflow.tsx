"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"

export function MonitoringWorkflow() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="monitoring-workflow" title={t.monitoringWorkflow.title}>
      <div className="max-w-4xl mx-auto">
        <ol className="space-y-3 list-decimal list-inside">
          {t.monitoringWorkflow.steps.map((step, index) => (
            <li key={index} className="text-foreground/90 leading-relaxed pl-2">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  )
}
