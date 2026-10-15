"use client"

import type React from "react"
import { useState } from "react"
import { Linkedin, Mail, MapPin, Send } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { IconBadge } from "@/components/icon-badge"
import { Magnetic } from "@/components/magnetic"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.mailtoLink) {
        // Open email client with pre-filled content
        window.location.href = data.mailtoLink

        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
        })
        setStatus("sent")
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText("rissonefran@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SectionWrapper id="contact" title={t.contact.title}>
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
        <Reveal variant="left" className="flex flex-col gap-7">
          <h3 className="text-balance font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl">{t.contact.getInTouch}</h3>
          <p className="max-w-[40ch] text-lg leading-relaxed text-foreground/80">{t.contact.description}</p>

          <div className="flex flex-col items-start gap-4">
            <button
              onClick={handleEmailClick}
              className="group relative flex cursor-pointer items-center gap-3 text-foreground transition-colors hover:text-accent"
            >
              <IconBadge icon={Mail} size="sm" />
              <span className="font-medium">rissonefran@gmail.com</span>
              {copied && (
                <span className="absolute -top-9 left-0 whitespace-nowrap rounded-md bg-accent px-3 py-1 text-sm text-accent-foreground">
                  {t.contact.copied}
                </span>
              )}
            </button>
            <a
              href="https://www.linkedin.com/in/rissonefran/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-foreground transition-colors hover:text-accent"
            >
              <IconBadge icon={Linkedin} size="sm" />
              <span className="font-medium">linkedin.com/in/rissonefran</span>
            </a>
            <div className="group flex items-center gap-3 text-foreground/80">
              <IconBadge icon={MapPin} size="sm" />
              <span>{t.hero.location}</span>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={120}>
          <form onSubmit={handleSubmit} className="contact-panel space-y-5">
            <div className="space-y-2">
              <Label htmlFor="contact-name">{t.contact.namePlaceholder}</Label>
              <Input
                id="contact-name"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t.contact.namePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">{t.contact.emailPlaceholder}</Label>
              <Input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={t.contact.emailPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">{t.contact.messagePlaceholder}</Label>
              <Textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder={t.contact.messagePlaceholder}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <Button type="submit" size="lg" className="gap-2" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? t.contact.sending : t.contact.send}
                </Button>
              </Magnetic>
              <p role="status" className="text-sm font-medium" data-status={status}>
                {status === "sent" && <span className="text-accent">{t.contact.successMessage}</span>}
                {status === "error" && <span className="text-destructive">{t.contact.errorMessage}</span>}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
