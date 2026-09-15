import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"

const MODEL = "gpt-4o-mini"
const MAX_HISTORY = 10
const MAX_MESSAGE_LENGTH = 2000

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

function buildSystemPrompt(language: "en" | "es") {
  const t = translations[language]

  const skills = t.technicalSkills.categories.map((category) => `${category.name}: ${category.skills.join(", ")}`).join(" | ")
  const jobs = t.experience.jobs.map((job) => `${job.title} at ${job.company} (${job.period})`).join("; ")
  const projects = t.projects.items.map((project) => project.name).join(", ")
  const certifications = t.certifications.items.map((cert) => cert.name).join(", ")

  return [
    "You are the virtual assistant embedded in Francisco Rissone's personal portfolio website.",
    "Only answer questions about Francisco's professional background: skills, work experience, certifications, education, projects, and how to get in touch.",
    "Be concise (a few sentences), friendly, and professional. If asked about anything unrelated to Francisco or his portfolio, politely redirect back to his professional profile.",
    `Respond in ${language === "es" ? "Spanish" : "English"}.`,
    `Professional summary: ${t.professionalSummary.content}`,
    `Core skills: ${t.coreSkills.skills.join(", ")}`,
    `Technical skills: ${skills}`,
    `Experience: ${jobs}`,
    `Projects: ${projects}`,
    `Certifications: ${certifications}`,
    "Contact email: rissonefran@gmail.com",
  ].join("\n\n")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages: unknown = body?.messages
    const language = body?.language === "es" ? "es" : "en"

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("[assistant] Missing OPENAI_API_KEY")
      return NextResponse.json({ error: "Assistant is not configured yet." }, { status: 503 })
    }

    const sanitized: ChatMessage[] = messages
      .filter(
        (message): message is ChatMessage =>
          typeof message === "object" &&
          message !== null &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string",
      )
      .slice(-MAX_HISTORY)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, MAX_MESSAGE_LENGTH),
      }))

    if (sanitized.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: buildSystemPrompt(language) }, ...sanitized],
        temperature: 0.6,
        max_tokens: 400,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("[assistant] OpenAI error:", response.status, errorBody)
      return NextResponse.json({ error: "Failed to reach the assistant." }, { status: 502 })
    }

    const data = await response.json()
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return NextResponse.json({ error: "Empty response from assistant." }, { status: 502 })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[assistant] Unexpected error:", error)
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 })
  }
}
