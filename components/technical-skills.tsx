"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"

export function TechnicalSkills() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="technical-skills" title={t.technicalSkills.title} tone="soft">
      <div className="mx-auto flex max-w-5xl flex-col gap-14 md:gap-16">
        {t.technicalSkills.categories.map((category, index) => (
          <article key={index} className="grid gap-5 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10">
            <Reveal variant="left" delay={40}>
              <h3 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{category.name}</h3>
              <svg className="mt-3" width="64" height="10" viewBox="0 0 64 10" fill="none" aria-hidden="true">
                <path
                  d="M2 5 C9 -1 15 11 22 5 C29 -1 35 11 42 5 C49 -1 55 11 62 5"
                  stroke="var(--coral)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </Reveal>

            <ul className="flex flex-wrap content-start gap-2.5">
              {category.skills.map((skill, skillIndex) => (
                <Reveal key={skillIndex} as="li" variant="up" delay={Math.min(skillIndex, 12) * 45}>
                  <span className="skill-chip">{skill}</span>
                </Reveal>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionWrapper>
  )
}
