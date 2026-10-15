"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { Reveal } from "@/components/reveal"
import { prefersReducedMotion } from "@/lib/motion"

// Size multipliers and float timing per bubble (deterministic, so no hydration mismatch).
const SIZES = [1.05, 0.88, 1, 0.92, 1.1, 0.96]
const FLOAT = [
  { dur: 7.2, delay: 0 },
  { dur: 8.4, delay: -2.1 },
  { dur: 6.6, delay: -4.3 },
  { dur: 9, delay: -1.2 },
  { dur: 7.8, delay: -3.4 },
  { dur: 8.1, delay: -5 },
]

const RADIUS = 230
const PUSH = 46

/**
 * Skills as bubbles that drift on their own and slip away from the cursor like they
 * would from a hand in water. The float is a CSS animation on the wrapper; the cursor
 * push is a spring written straight to the inner element, so the two never fight.
 */
export function CoreSkills() {
  const { t } = useLanguage()
  const fieldRef = useRef<HTMLDivElement>(null)
  const bubbles = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const field = fieldRef.current
    if (!field || prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return

    const offsets = bubbles.current.map(() => ({ x: 0, y: 0 }))
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const loop = () => {
      let moving = false
      bubbles.current.forEach((bubble, i) => {
        if (!bubble) return
        const rect = bubble.getBoundingClientRect()
        // Centre of the bubble without its own push, so the target doesn't chase itself.
        const cx = rect.left + rect.width / 2 - offsets[i].x
        const cy = rect.top + rect.height / 2 - offsets[i].y

        let targetX = 0
        let targetY = 0
        if (pointer) {
          const dx = cx - pointer.x
          const dy = cy - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance < RADIUS && distance > 0.5) {
            const force = (1 - distance / RADIUS) ** 2 * PUSH
            targetX = (dx / distance) * force
            targetY = (dy / distance) * force
          }
        }

        offsets[i].x += (targetX - offsets[i].x) * 0.14
        offsets[i].y += (targetY - offsets[i].y) * 0.14
        bubble.style.transform = `translate3d(${offsets[i].x.toFixed(2)}px, ${offsets[i].y.toFixed(2)}px, 0)`
        if (Math.abs(targetX - offsets[i].x) > 0.05 || Math.abs(targetY - offsets[i].y) > 0.05) moving = true
      })
      frame = moving || pointer ? requestAnimationFrame(loop) : 0
    }

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(loop)
    }

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      pointer = { x: e.clientX, y: e.clientY }
      wake()
    }
    const handleLeave = () => {
      pointer = null
      wake()
    }

    field.addEventListener("pointermove", handleMove)
    field.addEventListener("pointerleave", handleLeave)
    return () => {
      field.removeEventListener("pointermove", handleMove)
      field.removeEventListener("pointerleave", handleLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <SectionWrapper id="core-skills" title={t.coreSkills.title}>
      <div ref={fieldRef} className="bubble-field mx-auto max-w-5xl">
        {t.coreSkills.skills.map((skill, index) => (
          <Reveal
            key={index}
            variant="scale"
            delay={index * 80}
            className="bubble-wrap"
            style={
              {
                "--k": SIZES[index % SIZES.length],
                "--float-dur": `${FLOAT[index % FLOAT.length].dur}s`,
                "--float-delay": `${FLOAT[index % FLOAT.length].delay}s`,
              } as CSSProperties
            }
          >
            <div className="bubble-float">
              <div
                ref={(el) => {
                  bubbles.current[index] = el
                }}
                className="bubble"
              >
                <span className="bubble-label">{skill}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
