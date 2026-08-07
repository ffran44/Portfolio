"use client"

import { useEffect, useRef, useState } from "react"
import { Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    document.documentElement.classList.add("custom-cursor-active")

    let raf = 0
    const handleMove = (e: MouseEvent) => {
      setVisible(true)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        ref.current?.style.setProperty(
          "transform",
          `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`,
        )
      })
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setActive(!!target.closest("a, button, [role='button'], input, textarea"))
    }

    const handleLeave = () => setVisible(false)

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseover", handleOver)
    document.documentElement.addEventListener("mouseleave", handleLeave)

    return () => {
      document.documentElement.classList.remove("custom-cursor-active")
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseover", handleOver)
      document.documentElement.removeEventListener("mouseleave", handleLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[100]" aria-hidden="true">
      <Sun
        className={cn(
          "h-6 w-6 text-accent drop-shadow-[0_0_6px_oklch(0.74_0.13_200/0.8)]",
          "transition-[opacity,scale] duration-200 ease-out",
          visible ? "opacity-100" : "opacity-0",
          active ? "scale-125" : "scale-100",
        )}
        strokeWidth={1.5}
      />
    </div>
  )
}
