"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { AuthForm } from "@/components/auth-form"
import { GameDashboard } from "@/components/game-dashboard"
import { DemoGameDashboard } from "@/components/demo-game-dashboard"
import type { User } from "@supabase/supabase-js"

export default function QuantumEchoMaze() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    if (!supabase) {
      // No Supabase configuration, run in demo mode
      setIsDemoMode(true)
      setLoading(false)
      return
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Demo mode - no authentication required
  if (isDemoMode) {
    return <DemoGameDashboard />
  }

  // Normal mode with authentication
  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />
  }

  return <GameDashboard user={user} />
}
