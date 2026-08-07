"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Card } from "@/components/ui/card"

export function Projects() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="projects" title={t.projects.title}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {t.projects.items.map((project, index) => (
          <Card key={index} className="p-6 hover:border-accent transition-all duration-300">
            <article className="space-y-4">
              <h3 className="text-xl font-serif font-semibold text-foreground">{project.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-accent uppercase tracking-wide">{t.projects.technologies}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="text-xs px-2 py-1 rounded bg-secondary/50 text-secondary-foreground border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
