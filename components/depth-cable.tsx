"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { useLanguage } from "@/lib/language-context"
import { prefersReducedMotion, subscribeScroll } from "@/lib/motion"
import { cn } from "@/lib/utils"

const MAX_DEPTH = 200

/**
 * A submarine cable running down the left edge. A pulse of light travels along it as the
 * page scrolls, a depth gauge reads out how far down you are, and each node is a link to
 * a section, so it doubles as the navigation. The marker is mapped section by section
 * (not by raw scroll distance) so it always lands exactly on the node of the section in view.
 */
export function DepthCable() {
  const { t } = useLanguage()
  const items = t.nav.items
  const zones = t.depth.zones

  const trackRef = useRef<HTMLDivElement>(null)
  const packetRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const depthRef = useRef<HTMLSpanElement>(null)
  const zoneRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    const packet = packetRef.current
    const fill = fillRef.current
    const depth = depthRef.current
    const zone = zoneRef.current
    if (!track || !packet || !fill || !depth || !zone) return

    const lastIndex = items.length - 1

    return subscribeScroll((vh) => {
      const max = Math.max(1, document.documentElement.scrollHeight - vh)
      const scrollY = window.scrollY

      // The scroll offset at which each section becomes "current", kept strictly increasing.
      const anchors: number[] = []
      items.forEach((item, i) => {
        const el = document.getElementById(item.id)
        const raw = el ? el.getBoundingClientRect().top + scrollY - vh * 0.4 : 0
        const clamped = Math.min(max, Math.max(0, raw))
        anchors.push(i === 0 ? 0 : Math.max(clamped, anchors[i - 1] + 1))
      })

      let index = 0
      for (let i = 0; i <= lastIndex; i++) {
        if (scrollY >= anchors[i] - 1) index = i
      }
      const next = anchors[index + 1]
      const local = index >= lastIndex || next === undefined ? 0 : Math.min(1, (scrollY - anchors[index]) / (next - anchors[index]))
      const fraction = Math.min(1, Math.max(0, (index + local) / lastIndex))
      // Past the last anchor the cable stays at the seabed.
      const settled = scrollY >= anchors[lastIndex] ? 1 : fraction

      const height = track.clientHeight
      packet.style.transform = `translate3d(0, ${(settled * height).toFixed(1)}px, 0)`
      fill.style.transform = `scaleY(${settled.toFixed(4)})`
      depth.textContent = String(Math.round(settled * MAX_DEPTH))
      zone.textContent = zones[Math.min(zones.length - 1, Math.floor(settled * zones.length * 0.9999))]
      setActive((prev) => (prev === index ? prev : index))
    })
  }, [items, zones])

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
  }

  return (
    <nav aria-label={t.nav.label} className="depth-cable">
      <div ref={trackRef} className="depth-track">
        <div className="depth-line" />
        <div ref={fillRef} className="depth-fill" />

        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(item.id)}
            aria-label={item.label}
            aria-current={i === active ? "true" : undefined}
            className={cn("depth-node", i <= active && "is-passed", i === active && "is-active")}
            style={{ "--at": `${(i / (items.length - 1)) * 100}%` } as CSSProperties}
          >
            <span className="depth-node-dot" />
            <span className="depth-node-label">{item.label}</span>
          </button>
        ))}

        <div ref={packetRef} className="depth-packet" aria-hidden="true">
          <span className="depth-packet-core" />
          <span className="depth-readout">
            <span ref={depthRef}>0</span> m
          </span>
        </div>

        <span ref={zoneRef} className="depth-zone" aria-hidden="true">
          {zones[0]}
        </span>
      </div>
    </nav>
  )
}
