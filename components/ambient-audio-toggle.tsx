"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { AmbientAudio } from "@/lib/ambient-audio"

export function AmbientAudioToggle() {
  const { language } = useLanguage()
  const audioRef = useRef<AmbientAudio | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    return () => {
      audioRef.current?.stop()
    }
  }, [])

  const toggle = async () => {
    if (!audioRef.current) {
      audioRef.current = new AmbientAudio()
    }

    if (playing) {
      await audioRef.current.stop()
      setPlaying(false)
    } else {
      await audioRef.current.start()
      setPlaying(true)
    }
  }

  const label = language === "en" ? "Toggle ambient sound" : "Activar sonido ambiente"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={label}
      aria-pressed={playing}
      className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
    >
      {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </Button>
  )
}
