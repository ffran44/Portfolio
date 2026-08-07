"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"

export function TechnicalSkills() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="technical-skills" title={t.technicalSkills.title}>
      <div className="max-w-5xl mx-auto space-y-8">
        {t.technicalSkills.categories.map((category, index) => (
          <article key={index} className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-foreground border-l-2 border-accent pl-4">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm border border-border hover:border-accent transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
