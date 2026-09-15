"use client"

import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Bot, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export function AiAssistant() {
  const { language, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, language }),
      })

      if (!response.ok) throw new Error("Assistant request failed")

      const data = await response.json()
      setMessages([...nextMessages, { role: "assistant", content: data.reply }])
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: t.assistant.error }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-card/95 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">{t.assistant.label}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setOpen(false)}
              aria-label={t.assistant.closeLabel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-3">
            <div ref={viewportRef} className="flex flex-col gap-3">
              <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">{t.assistant.greeting}</div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "self-end bg-accent text-accent-foreground"
                      : "self-start bg-muted text-foreground",
                  )}
                >
                  {message.content}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  <Spinner className="h-3 w-3" />
                  {t.assistant.thinking}
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.assistant.placeholder}
              disabled={loading}
              aria-label={t.assistant.placeholder}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label={t.assistant.send}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      <Button
        size="icon"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? t.assistant.closeLabel : t.assistant.openLabel}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>
    </div>
  )
}
