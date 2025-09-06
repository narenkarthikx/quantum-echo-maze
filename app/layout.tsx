import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Quantum Echo Maze - Interactive Quantum Physics Game",
  description:
    "Learn quantum physics through interactive maze navigation and quantum echo mechanics. Explore decoherence, fidelity, and quantum coherence in an engaging educational game.",
  generator: "Quantum Echo Maze",
  keywords: [
    "quantum physics",
    "educational game",
    "quantum mechanics",
    "fidelity",
    "decoherence",
    "interactive learning",
  ],
  authors: [{ name: "Quantum Echo Maze" }],
  openGraph: {
    title: "Quantum Echo Maze",
    description: "Interactive quantum physics learning through maze navigation",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} quantum-particles`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
