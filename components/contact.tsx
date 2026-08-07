"use client"

import type React from "react"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"
import { IconBadge } from "@/components/icon-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Linkedin, MapPin } from "lucide-react"
import { useState } from "react"

export function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

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
      } else {
        alert(t.contact.errorMessage || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      alert(t.contact.errorMessage || "Failed to send message. Please try again.")
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
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <article className="space-y-4">
          <h3 className="text-2xl font-serif font-semibold text-foreground">{t.contact.getInTouch}</h3>
          <p className="text-muted-foreground leading-relaxed">{t.contact.description}</p>
        </article>

        <div className="space-y-4 flex flex-col items-center">
          <button
            onClick={handleEmailClick}
            className="group flex items-center gap-3 text-foreground hover:text-accent transition-colors cursor-pointer relative"
          >
            <IconBadge icon={Mail} size="sm" />
            <span className="font-medium">rissonefran@gmail.com</span>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-sm px-3 py-1 rounded-md whitespace-nowrap">
                {t.contact.copied}
              </span>
            )}
          </button>
          <a
            href="https://www.linkedin.com/in/rissonefran/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-foreground hover:text-accent transition-colors"
          >
            <IconBadge icon={Linkedin} size="sm" />
            <span className="font-medium">linkedin.com/in/rissonefran</span>
          </a>
          <div className="group flex items-center gap-3 text-muted-foreground">
            <IconBadge icon={MapPin} size="sm" />
            <span>{t.hero.location}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
          <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? t.contact.sending : t.contact.send}
          </Button>
        </form>
      </div>
    </SectionWrapper>
  )
}
