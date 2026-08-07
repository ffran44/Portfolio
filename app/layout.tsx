import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { InteractiveBackground } from "@/components/interactive-background"
import { CustomCursor } from "@/components/custom-cursor"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Francisco Rissone | Network Engineer | CCNA Certified",
  description:
    "Network Engineer & NOC Analyst portfolio. CCNA-certified with expertise in Cisco networking, VLAN configuration, routing protocols, and infrastructure management.",
  keywords:
    "Network Engineer, NOC Analyst, CCNA, Cisco, VLAN, Routing, Switching, OSPF, Network Security, Infrastructure",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`font-sans antialiased ${_fraunces.variable}`}>
        <InteractiveBackground />
        <CustomCursor />
        <LanguageProvider>
          <LanguageToggle />
          <div className="relative z-10">{children}</div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
