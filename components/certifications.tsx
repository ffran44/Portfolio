"use client"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Award, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Certifications() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="certifications" title={t.certifications.title}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          {t.certifications.items.map((cert, index) => (
            <article
              key={index}
              className="card-forge flex items-start gap-4 p-6 rounded-lg bg-card border border-border transition-all"
            >
              <div className="p-2 rounded-md bg-accent/10">
                <Award className="h-8 w-8 text-accent" />
              </div>
              {/* </CHANGE> */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{cert.name}</h3>
                {cert.issuer && <p className="text-muted-foreground mt-1">{cert.issuer}</p>}
                {cert.year && <p className="text-sm text-muted-foreground mt-1">{cert.year}</p>}
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            variant="outline"
            asChild
            className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent transition-all bg-transparent"
          >
            <a href="https://www.credly.com/users/francisco-rissone/badges" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              {t.certifications.viewAll}
            </a>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  )
}
