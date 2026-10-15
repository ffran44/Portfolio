"use client"

import { Award, Cloud, ExternalLink, Factory, Languages, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { IconBadge } from "@/components/icon-badge"
import { Magnetic } from "@/components/magnetic"
import { Reveal } from "@/components/reveal"
import { TiltCard } from "@/components/tilt-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ICONS = [Award, Languages, Languages, Cloud, Factory, ShieldCheck]

export function Certifications() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="certifications" title={t.certifications.title} tone="soft">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {t.certifications.items.map((cert, index) => {
            const Icon = ICONS[index % ICONS.length]
            const featured = index === 0
            return (
              <Reveal
                key={index}
                variant={featured ? "left" : "up"}
                delay={index * 70}
                className={cn(featured && "md:col-span-2 md:row-span-2")}
              >
                <TiltCard max={featured ? 3 : 6} className={cn("cert-card h-full", featured && "cert-featured")}>
                  <div className="w-fit">
                    <IconBadge icon={Icon} size={featured ? "lg" : "md"} />
                  </div>
                  <div className="mt-5 space-y-1.5">
                    <h3
                      className={cn(
                        "text-balance font-serif font-bold leading-tight text-foreground",
                        featured ? "text-xl sm:text-2xl md:text-3xl" : "text-lg md:text-xl",
                      )}
                    >
                      {cert.name}
                    </h3>
                    {cert.issuer && <p className="text-base text-foreground/75">{cert.issuer}</p>}
                    {cert.year && <p className="text-sm font-semibold text-accent">{cert.year}</p>}
                  </div>
                  {featured && <Icon className="cert-watermark" strokeWidth={1} aria-hidden="true" />}
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-hit"
                      aria-label={`${cert.name} · Credly`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </TiltCard>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="flex justify-center" variant="scale" delay={150}>
          <Magnetic>
            <Button size="lg" variant="outline" asChild className="gap-2 border-accent/50 bg-transparent text-accent hover:bg-accent/10">
              <a href="https://www.credly.com/users/francisco-rissone/badges" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                {t.certifications.viewAll}
              </a>
            </Button>
          </Magnetic>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
