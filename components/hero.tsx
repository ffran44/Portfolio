"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { Mail, Linkedin } from "lucide-react"

export function Hero() {
  const { t } = useLanguage()

  return (
    <header className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <div
        className="absolute inset-0 z-0 hidden md:block"
        style={{
          backgroundImage: 'url("/images/image.png")',
          backgroundSize: "contain",
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
          filter: "blur(1px) grayscale(20%)",
          transform: "translateY(var(--scroll, 0))",
        }}
        aria-hidden="true"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 z-0" />

      {/* Soft aqua glow, like light filtering through shallow water */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.74 0.13 200 / 0.18), transparent 70%), radial-gradient(40% 40% at 85% 90%, oklch(0.72 0.16 35 / 0.1), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight">
              Francisco Rissone
            </h1>
            <div className="h-px w-32 mx-auto bg-accent opacity-60" />
            <p className="text-2xl md:text-3xl text-muted-foreground font-light">{t.hero.title}</p>
            <p className="text-lg text-muted-foreground/80">{t.hero.location}</p>
          </div>

          <p className="text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed text-balance">
            {t.hero.summary}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
              <a href="https://linkedin.com/in/rissonefran" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
              <a href="mailto:rissonefran@gmail.com">
                <Mail className="h-4 w-4" />
                {t.hero.contact}
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Animated tide line */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden z-[1] opacity-70" aria-hidden="true">
        <svg
          className="wave-drift absolute bottom-0 left-0 h-16 w-[200%]"
          viewBox="0 0 2400 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C200,90 400,10 600,50 C800,90 1000,10 1200,50 C1400,90 1600,10 1800,50 C2000,90 2200,10 2400,50 L2400,100 L0,100 Z"
            fill="oklch(0.74 0.13 200 / 0.12)"
          />
          <path
            d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 C1400,20 1600,100 1800,60 C2000,20 2200,100 2400,60 L2400,100 L0,100 Z"
            fill="oklch(0.8 0.1 190 / 0.1)"
          />
        </svg>
      </div>
    </header>
  )
}
