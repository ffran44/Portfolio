"use client"

import { useEffect, useRef, useState, type TouchEvent } from "react"
import { ChevronLeft, ChevronRight, Clapperboard, Gamepad2, Music, PawPrint, Trophy, Users, X, type LucideIcon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { IconBadge } from "@/components/icon-badge"
import { prefersReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

const SLIDE_ICONS = [Users, PawPrint, Trophy, [Music, Gamepad2, Clapperboard]] as const

// Array.isArray does not narrow readonly tuples, so narrow by hand.
const isIconGroup = (value: LucideIcon | readonly LucideIcon[]): value is readonly LucideIcon[] => Array.isArray(value)

export function AboutMe() {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [uncorking, setUncorking] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const slides = t.aboutMe.slides
  const count = slides.length

  const next = () => setIndex((i) => (i + 1) % count)
  const prev = () => setIndex((i) => (i - 1 + count) % count)

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, count])

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  // The cork pops first, then the story opens.
  const openTab = () => {
    if (uncorking) return
    setIndex(0)
    if (prefersReducedMotion()) {
      setOpen(true)
      return
    }
    setUncorking(true)
    window.setTimeout(() => {
      setOpen(true)
      setUncorking(false)
    }, 380)
  }

  const icons = SLIDE_ICONS[index]

  return (
    <>
      <button
        type="button"
        onClick={openTab}
        aria-label={t.aboutMe.tabLabel}
        className={cn("bottle-trigger", uncorking && "is-uncorking")}
      >
        <span className="bottle-ripple" aria-hidden="true" />
        <span className="bottle-float" aria-hidden="true">
          <svg className="bottle-svg" viewBox="0 0 48 72">
            <path
              className="bottle-glass"
              d="M19 12h10v9c0 3 11 5 11 14v26a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V35c0-9 11-11 11-14z"
            />
            <g className="bottle-scroll-wrap">
              <g transform="rotate(-14 24 46)">
                <rect className="bottle-paper" x="13" y="38" width="22" height="15" rx="3" />
                <path className="bottle-ink" d="M16.5 43h9M16.5 47h7" />
                <rect className="bottle-ribbon" x="27" y="38" width="3" height="15" />
              </g>
            </g>
            <path className="bottle-shine" d="M13.5 37v19" />
            <path className="bottle-shine" d="M15.5 26l1.6-1.6" />
            <g className="bottle-cork">
              <rect x="18" y="2" width="12" height="11" rx="2.5" />
              <path d="M20.5 5.5h7M20.5 9h7" />
            </g>
          </svg>
        </span>
        <span className="bottle-label">{t.aboutMe.tabLabel}</span>
      </button>

      {open && (
        <div
          className="about-overlay fixed inset-0 z-[90] flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.aboutMe.tabLabel}
        >
          <div
            className="about-dialog relative flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label={t.aboutMe.close}
              className="absolute -top-2 right-2 z-10 text-muted-foreground transition-colors hover:text-accent"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="card-forge flex aspect-square w-[min(85vw,22rem)] flex-col items-center justify-center gap-4 rounded-full border border-accent/30 bg-card px-10 text-center"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div key={index} className="about-slide flex flex-col items-center gap-4">
                {isIconGroup(icons) ? (
                  <div className="flex gap-3">
                    {icons.map((Icon, i) => (
                      <IconBadge key={i} icon={Icon} size="md" />
                    ))}
                  </div>
                ) : (
                  <IconBadge icon={icons} size="lg" />
                )}

                <h3 className="font-serif text-2xl font-bold text-foreground">{slides[index].title}</h3>
                <p className="text-base leading-relaxed text-foreground/80">{slides[index].text}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prev}
                aria-label={language === "en" ? "Previous" : "Anterior"}
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}`}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      i === index ? "bg-accent" : "bg-border",
                    )}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label={language === "en" ? "Next" : "Siguiente"}
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
