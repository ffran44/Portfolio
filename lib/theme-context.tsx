"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { ThemeTransitionOverlay } from "@/components/theme-transition-overlay"

type Theme = "light" | "dark"

interface Transition {
  kind: "sand" | "water"
  x: number
  y: number
  radius: number
  active: boolean
}

interface ThemeContextType {
  theme: Theme
  toggleTheme: (originX: number, originY: number) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function applyTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark")
  try {
    localStorage.setItem("theme", next)
  } catch {
    // localStorage unavailable (private browsing, etc.) — theme just won't persist
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [transition, setTransition] = useState<Transition | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "light" || stored === "dark") setTheme(stored)
    } catch {
      // ignore
    }
  }, [])

  const toggleTheme = useCallback(
    (originX: number, originY: number) => {
      const next: Theme = theme === "dark" ? "light" : "dark"
      // Dark -> light reveals sand; light -> dark reveals water.
      const kind: "sand" | "water" = theme === "dark" ? "sand" : "water"

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheme(next)
        applyTheme(next)
        return
      }

      const dx = Math.max(originX, window.innerWidth - originX)
      const dy = Math.max(originY, window.innerHeight - originY)
      const radius = Math.hypot(dx, dy)

      setTransition({ kind, x: originX, y: originY, radius, active: true })

      window.setTimeout(() => {
        setTheme(next)
        applyTheme(next)
        window.setTimeout(() => {
          setTransition((t) => (t ? { ...t, active: false } : t))
          window.setTimeout(() => setTransition(null), 700)
        }, 150)
      }, 650)
    },
    [theme],
  )

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {transition && (
        <ThemeTransitionOverlay
          kind={transition.kind}
          x={transition.x}
          y={transition.y}
          radius={transition.radius}
          active={transition.active}
        />
      )}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
