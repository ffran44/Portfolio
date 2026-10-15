"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"

/** Education as a ladder: the years are the loudest thing, the degree sits beside them. */
export function Education() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="education" title={t.education.title}>
      <ol className="mx-auto flex max-w-5xl flex-col gap-10 md:gap-14">
        {t.education.items.map((edu, index) => (
          <Reveal
            key={index}
            as="li"
            variant={index % 2 === 0 ? "left" : "right"}
            delay={index * 60}
            className={cn("ladder-row grid items-baseline gap-2 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12", index % 2 === 1 && "md:ml-16")}
          >
            <p className="ladder-years font-serif text-4xl font-bold leading-none text-accent md:text-6xl">{edu.period}</p>
            <div>
              <h3 className="text-balance text-xl font-semibold text-foreground md:text-2xl">{edu.degree}</h3>
              <p className="mt-1 text-base text-foreground/75">{edu.institution}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </SectionWrapper>
  )
}
