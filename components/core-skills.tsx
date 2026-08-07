"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Sword } from "lucide-react"

export function CoreSkills() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="core-skills" title={t.coreSkills.title}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {t.coreSkills.skills.map((skill, index) => (
          <article
            key={index}
            className="group p-6 rounded-lg bg-card border border-border hover:border-accent transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Sword className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{skill}</h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
