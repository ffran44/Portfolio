"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { ArrowDown, Download, Linkedin, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/magnetic"
import { WaveText } from "@/components/wave-text"
import { useLanguage } from "@/lib/language-context"
import { prefersReducedMotion } from "@/lib/motion"

// Deterministic layouts so server and client render the same markup.
const STARS = Array.from({ length: 46 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 54,
  size: 1 + ((i * 7) % 3),
  duration: 3 + ((i * 5) % 5),
  delay: (i * 0.7) % 6,
}))

const GLINTS = Array.from({ length: 9 }, (_, i) => ({
  top: i * 8.5,
  width: 150 - i * 11,
  delay: i * 0.45,
}))

const WAVE_PATH =
  "M0,90 C150,40 350,140 600,90 C850,40 1050,140 1200,90 C1350,40 1550,140 1800,90 C2050,40 2250,140 2400,90 L2400,200 L0,200 Z"

const DUNE_BACK =
  "M0,150 C180,90 340,170 560,125 C780,80 940,160 1160,120 C1300,95 1380,110 1440,130 L1440,220 L0,220 Z"
const DUNE_FRONT =
  "M0,180 C220,140 420,200 700,165 C960,135 1140,195 1440,160 L1440,220 L0,220 Z"

export function Hero() {
  const { t, language } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)
  const cvHref = language === "es" ? "/cv/Francisco-Rissone-CV-ES.pdf" : "/cv/Francisco-Rissone-CV-EN.pdf"

  // Pointer parallax: layers drift against the cursor, eased so they never snap.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let frame = 0
    let visible = true

    const loop = () => {
      currentX += (targetX - currentX) * 0.07
      currentY += (targetY - currentY) * 0.07
      hero.style.setProperty("--px", `${(currentX * 30).toFixed(2)}px`)
      hero.style.setProperty("--py", `${(currentY * 14).toFixed(2)}px`)
      const settled = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001
      frame = settled ? 0 : requestAnimationFrame(loop)
    }

    const handleMove = (e: PointerEvent) => {
      if (!visible) return
      targetX = e.clientX / window.innerWidth - 0.5
      targetY = e.clientY / window.innerHeight - 0.5
      if (!frame) frame = requestAnimationFrame(loop)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(hero)
    window.addEventListener("pointermove", handleMove, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("pointermove", handleMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header ref={heroRef} id="top" className="hero relative isolate flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 text-center">
      <div className="hero-scene" aria-hidden="true">
        <div className="hero-sky" />

        <div className="hero-stars">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="hero-star"
              style={
                {
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  animationDuration: `${s.duration}s`,
                  animationDelay: `${s.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="hero-layer" style={{ "--depth": 0.55 } as CSSProperties}>
          <div className="hero-orb" />
        </div>

        <div className="hero-sea" />

        <div className="hero-layer" style={{ "--depth": 0.35 } as CSSProperties}>
          <div className="hero-glints">
            {GLINTS.map((g, i) => (
              <span
                key={i}
                className="hero-glint"
                style={{ top: `${g.top}%`, width: g.width, animationDelay: `${g.delay}s` } as CSSProperties}
              />
            ))}
          </div>
        </div>

        {[1, 2, 3].map((n) => (
          <div key={n} className="hero-layer" style={{ "--depth": 0.14 + n * 0.2 } as CSSProperties}>
            <div className={`hero-wavegroup hero-wavegroup-${n}`}>
              <svg className="hero-wave-crest" viewBox="0 0 2400 200" preserveAspectRatio="none">
                <path d={WAVE_PATH} />
              </svg>
              <div className="hero-wave-fill" />
            </div>
          </div>
        ))}

        <div className="hero-layer" style={{ "--depth": 0.7 } as CSSProperties}>
          <svg className="hero-dune hero-dune-back" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path d={DUNE_BACK} />
          </svg>
          <svg className="hero-dune hero-dune-front" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path d={DUNE_FRONT} />
          </svg>
        </div>
      </div>

      <div className="hero-content relative z-10 mt-[17dvh] flex w-full max-w-5xl flex-col items-center gap-5 sm:mt-[19dvh]">
        <WaveText
          as="h1"
          text="Francisco Rissone"
          className="font-serif text-[clamp(2.75rem,10.5vw,6rem)] font-bold leading-[0.95] tracking-tight text-foreground"
          delayStep={0.045}
        />
        <div className="hero-in h-px w-28 bg-accent/70" style={{ "--i": 1 } as CSSProperties} />
        <p className="hero-in text-lg font-light text-foreground/85 sm:text-2xl md:text-3xl" style={{ "--i": 2 } as CSSProperties}>
          {t.hero.title}
        </p>
        <p className="hero-in flex items-center gap-2 text-sm text-foreground/70 sm:text-base" style={{ "--i": 3 } as CSSProperties}>
          <MapPin className="h-4 w-4 text-accent" />
          {t.hero.location}
        </p>

        <div className="hero-in mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4" style={{ "--i": 4 } as CSSProperties}>
          <Magnetic>
            <Button size="lg" className="gap-2" asChild>
              <a href={cvHref} download>
                <Download className="h-4 w-4" />
                {t.hero.downloadCV}
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="outline" className="gap-2 bg-background/50" asChild>
              <a href="https://linkedin.com/in/rissonefran" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="outline" className="gap-2 bg-background/50" asChild>
              <a href="mailto:rissonefran@gmail.com">
                <Mail className="h-4 w-4" />
                {t.hero.contact}
              </a>
            </Button>
          </Magnetic>
        </div>
      </div>

      <a
        href="#professional-summary"
        className="hero-in hero-cue absolute z-10 flex flex-col items-center gap-1 rounded-full bg-background/70 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:text-accent"
        style={{ "--i": 6 } as CSSProperties}
      >
        {t.hero.scroll}
        <ArrowDown className="hero-cue-arrow h-4 w-4" />
      </a>
    </header>
  )
}
