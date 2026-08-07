"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Calendar } from "lucide-react"

export function Experience() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="professional-experience" title={t.experience.title}>
      <div className="max-w-4xl mx-auto space-y-12">
        {t.experience.jobs.map((job, index) => (
          <article key={index} className="relative pl-8 border-l-2 border-accent/50">
            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent" />

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-serif font-semibold text-foreground">{job.title}</h3>
                <p className="text-lg text-accent mt-1">{job.company}</p>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Calendar className="h-4 w-4" />
                  <time>{job.period}</time>
                </div>
              </div>

              <ul className="space-y-2">
                {job.responsibilities.map((responsibility, respIndex) => (
                  <li key={respIndex} className="text-foreground/90 leading-relaxed flex">
                    <span className="mr-3 text-accent">•</span>
                    <span className="flex-1">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
