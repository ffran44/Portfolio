import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Geist_Mono, Original_Surfer } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeProvider } from "@/lib/theme-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { InteractiveBackground } from "@/components/interactive-background"
import { CustomCursor } from "@/components/custom-cursor"
import { AmbientAudioToggle } from "@/components/ambient-audio-toggle"
import { AboutMe } from "@/components/about-me"
import { Preloader } from "@/components/preloader"
import { ClickRipple } from "@/components/click-ripple"
import { DepthCable } from "@/components/depth-cable"
import { AiAssistant } from "@/components/ai-assistant"
import "./globals.css"
import "./experience.css"

const _montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const _originalSurfer = Original_Surfer({ subsets: ["latin"], weight: "400", variable: "--font-serif" })

const title = "Francisco Rissone | IT Technician | CCNA"
const description =
  "IT Technician portfolio with CCNA-level networking training, focused on Cisco networking, VLAN configuration, routing protocols, and infrastructure management."

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-rissonefran.vercel.app"),
  title,
  description,
  keywords:
    "Network Engineer, NOC Analyst, CCNA, Cisco, VLAN, Routing, Switching, OSPF, Network Security, Infrastructure",
  generator: "v0.app",
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Francisco Rissone Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Runs before first paint: sets the theme, and arms the entrance curtain on a visitor's first load of the session. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;if(localStorage.getItem('theme')!=='light'){d.classList.add('dark')}if(!sessionStorage.getItem('fr-seen')&&!navigator.webdriver&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('preload');setTimeout(function(){d.classList.remove('preload')},4500)}}catch(e){document.documentElement.classList.add('dark')}",
          }}
        />
        <noscript>
          <style>{`.reveal,.hero-in{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important;animation:none!important}.wave-char{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`font-sans antialiased ${_montserrat.variable} ${_originalSurfer.variable} ${_geistMono.variable}`}>
        <ThemeProvider>
          <Preloader />
          <InteractiveBackground />
          <CustomCursor />
          <ClickRipple />
          <LanguageProvider>
            <LanguageToggle />
            <AmbientAudioToggle />
            <ThemeToggle />
            <AboutMe />
            <DepthCable />
            <AiAssistant />
            <div className="relative z-10">{children}</div>
          </LanguageProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
