"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap, BarChart3 } from "lucide-react"

interface GameStatsProps {
  stats: {
    score: number
    level: number
    fidelity: number
    attempts: number
  }
}

export function GameStats({ stats }: GameStatsProps) {
  const getFidelityColor = (fidelity: number) => {
    if (fidelity >= 80) return "text-green-700 dark:text-green-400"
    if (fidelity >= 60) return "text-blue-700 dark:text-blue-400"
    if (fidelity >= 40) return "text-yellow-700 dark:text-yellow-400"
    return "text-red-700 dark:text-red-400"
  }

  const getFidelityBadge = (fidelity: number) => {
    if (fidelity >= 90) return { variant: "default" as const, text: "Excellent" }
    if (fidelity >= 70) return { variant: "secondary" as const, text: "Good" }
    if (fidelity >= 50) return { variant: "outline" as const, text: "Fair" }
    return { variant: "destructive" as const, text: "Poor" }
  }

  const fidelityBadge = getFidelityBadge(stats.fidelity)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-primary" />
          Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.score}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />
              Score
            </div>
          </div>

          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.level}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Target className="w-3 h-3" />
              Level
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Quantum Fidelity
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getFidelityColor(stats.fidelity)}`}>{stats.fidelity}%</span>
              <Badge variant={fidelityBadge.variant} className="text-xs">
                {fidelityBadge.text}
              </Badge>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                stats.fidelity >= 80
                  ? "bg-green-600"
                  : stats.fidelity >= 60
                    ? "bg-blue-600"
                    : stats.fidelity >= 40
                      ? "bg-yellow-600"
                      : "bg-red-600"
              }`}
              style={{ width: `${stats.fidelity}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Echo Attempts
          </span>
          <span className="text-sm font-medium">{stats.attempts}</span>
        </div>
      </CardContent>
    </Card>
  )
}
