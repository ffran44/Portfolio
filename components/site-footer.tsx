"use client"

import { ArrowUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { prefersReducedMotion } from "@/lib/motion"
import { Reveal } from "@/components/reveal"

/** The seabed: the last wave of the page, a way back up, and a one-line close. */
export function SiteFooter() {
  const { t } = useLanguage()

  const surface = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })

  return (
    <footer className="site-footer relative overflow-hidden pb-32 pt-24 text-center">
      <div className="site-footer-waves" aria-hidden="true">
        <svg className="site-footer-wave site-footer-wave-1" viewBox="0 0 2400 160" preserveAspectRatio="none">
          <path d="M0,70 C150,110 350,20 600,65 C850,110 1050,25 1200,65 C1350,105 1550,25 1800,65 C2050,105 2250,30 2400,70 L2400,160 L0,160 Z" />
        </svg>
        <svg className="site-footer-wave site-footer-wave-2" viewBox="0 0 2400 160" preserveAspectRatio="none">
          <path d="M0,80 C200,30 400,120 600,75 C800,30 1000,120 1200,75 C1400,30 1600,120 1800,75 C2000,30 2200,120 2400,80 L2400,160 L0,160 Z" />
        </svg>
      </div>

      <Reveal className="relative z-10 flex flex-col items-center gap-6" variant="scale">
        <button type="button" onClick={surface} className="surface-buoy" aria-label={t.footer.back}>
          <ArrowUp className="h-5 w-5" />
        </button>
        <p className="text-sm font-medium text-foreground/80">{t.footer.back}</p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Francisco Rissone · {t.footer.line}
        </p>
      </Reveal>
    </footer>
  )
}
