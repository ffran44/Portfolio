"use client"

import type { MouseEvent } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { useLanguage } from "@/lib/language-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { language } = useLanguage()

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    toggleTheme(rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

  const label = language === "en" ? "Toggle light/dark theme" : "Cambiar tema claro/oscuro"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={label}
      className="fixed top-4 left-16 z-50 bg-background/80 backdrop-blur-sm"
    >
      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
