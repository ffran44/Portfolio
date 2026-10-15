"use client"

import type { CSSProperties } from "react"
import { Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useProgressVar } from "@/lib/motion"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"
import { TiltCard } from "@/components/tilt-card"
import { cn } from "@/lib/utils"

/**
 * A rail that draws itself down the page as you scroll. Each job lights its node once the
 * rail reaches it, and the cards alternate sides so the column keeps changing direction.
 */
export function Experience() {
  const { t } = useLanguage()
  const jobs = t.experience.jobs
  const ref = useProgressVar<HTMLDivElement>({ start: 0.78, end: 0.4 })

  return (
    <SectionWrapper id="professional-experience" title={t.experience.title} tone="soft">
      <div ref={ref} className="timeline mx-auto max-w-5xl" style={{ "--n": jobs.length } as CSSProperties}>
        <div className="timeline-rail" aria-hidden="true">
          <span className="timeline-fill" />
        </div>

        <ol className="flex flex-col gap-10 md:gap-14">
          {jobs.map((job, index) => (
            <li key={index} className={cn("timeline-item", index % 2 === 1 && "is-right")} style={{ "--i": index } as CSSProperties}>
              <span className="timeline-dot" aria-hidden="true">
                <span className="timeline-dot-lit" />
              </span>

              <Reveal variant={index % 2 === 1 ? "right" : "left"} className="timeline-card-wrap">
                <TiltCard max={2.5} className="timeline-card">
                  <h3 className="text-balance font-serif text-xl font-bold leading-tight text-foreground md:text-2xl">{job.title}</h3>
                  {job.company && <p className="mt-1.5 text-base font-semibold text-accent">{job.company}</p>}
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <time>{job.period}</time>
                  </p>

                  <ul className="mt-4 space-y-2.5">
                    {job.responsibilities.map((responsibility, respIndex) => (
                      <li key={respIndex} className="flex gap-3 text-base leading-relaxed text-foreground/85">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  )
}
