"use client"

import { useEffect, useRef, useState, type TouchEvent } from "react"
import { ChevronLeft, ChevronRight, Clapperboard, Gamepad2, Music, PawPrint, Trophy, Users, X, type LucideIcon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { IconBadge } from "@/components/icon-badge"
import { cn } from "@/lib/utils"

const SLIDE_ICONS = [Users, PawPrint, Trophy, [Music, Gamepad2, Clapperboard]] as const

// Array.isArray does not narrow readonly tuples, so narrow by hand.
const isIconGroup = (value: LucideIcon | readonly LucideIcon[]): value is readonly LucideIcon[] => Array.isArray(value)

export function AboutMe() {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
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

  const openTab = () => {
    setIndex(0)
    setOpen(true)
  }

  const icons = SLIDE_ICONS[index]

  return (
    <>
      <button
        onClick={openTab}
        aria-label={t.aboutMe.tabLabel}
        className={cn(
          "fixed z-40 border border-accent/40 bg-card/90 text-accent backdrop-blur-sm",
          "shadow-[0_0_20px_-6px_oklch(0.74_0.13_200/0.5)]",
          // phones: a small pill in the corner, so it never sits on top of the text
          "bottom-6 right-4 flex items-center justify-center rounded-full px-4 py-2.5",
          // md and up: the half-circle tab on the edge
          "md:bottom-auto md:right-0 md:top-1/2 md:h-24 md:w-24 md:-translate-y-1/2 md:translate-x-1/2 md:px-0 md:py-0",
          "md:transition-transform md:duration-300 md:hover:translate-x-[calc(50%-0.5rem)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-x-1/2",
        )}
      >
        <span
          className="text-sm font-semibold tracking-wide text-accent md:-translate-x-6 md:[writing-mode:vertical-rl]"
        >
          {t.aboutMe.tabLabel}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.aboutMe.tabLabel}
        >
          <div
            className="relative flex flex-col items-center gap-6"
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
              <p className="text-sm leading-relaxed text-muted-foreground">{slides[index].text}</p>
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
