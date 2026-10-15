"use client"

import type { CSSProperties } from "react"
import { FileText, Radar, Search, Wrench } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"

const STEP_ICONS = [Radar, Search, Wrench, FileText]

/**
 * The incident path as a pipeline: a signal runs along the line and each stage lights up as
 * it passes. The loop only plays while the section is on screen (see .flow in experience.css).
 */
export function MonitoringWorkflow() {
  const { t } = useLanguage()
  const steps = t.monitoringWorkflow.steps

  return (
    <SectionWrapper id="monitoring-workflow" title={t.monitoringWorkflow.title}>
      <Reveal variant="up" className="flow mx-auto max-w-6xl">
        <div className="flow-steps" style={{ "--steps": steps.length } as CSSProperties}>
          <div className="flow-line" aria-hidden="true">
            <span className="flow-packet" />
          </div>

          <ol className="flow-list">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index % STEP_ICONS.length]
              return (
                <li key={index} className="flow-step" style={{ "--n": index } as CSSProperties}>
                  <span className="flow-node">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <p className="flow-text">{step}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </Reveal>
    </SectionWrapper>
  )
}
