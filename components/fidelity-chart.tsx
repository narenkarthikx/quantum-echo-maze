"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Activity } from "lucide-react"

interface FidelityChartProps {
  gameStats?: {
    fidelity: number
    attempts: number
  }
}

export function FidelityChart({ gameStats }: FidelityChartProps) {
  const [data, setData] = useState<Array<{ time: number; fidelity: number; coherence: number; attempts: number }>>([])
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newTime = prevData.length

        // Use actual game fidelity if available, otherwise simulate
        const baseFidelity = gameStats?.fidelity || 80

        // Add quantum fluctuations and environmental noise
        const quantumNoise = Math.sin(newTime * 0.1) * 10 + (Math.random() - 0.5) * 15
        const environmentalDrift = Math.cos(newTime * 0.05) * 5

        const newFidelity = Math.max(10, Math.min(100, baseFidelity + quantumNoise + environmentalDrift))

        // Coherence correlates with fidelity but has its own dynamics
        const coherenceBase = newFidelity * 0.8
        const coherenceFluctuation = Math.sin(newTime * 0.15) * 12 + (Math.random() - 0.5) * 8
        const newCoherence = Math.max(5, Math.min(100, coherenceBase + coherenceFluctuation))

        const newData = [
          ...prevData,
          {
            time: newTime,
            fidelity: Math.round(newFidelity * 10) / 10, // One decimal precision
            coherence: Math.round(newCoherence * 10) / 10,
            attempts: gameStats?.attempts || 0,
          },
        ]

        // Keep only last 30 data points for better visualization
        return newData.slice(-30)
      })
    }, 800) // Slightly slower update for smoother visualization

    return () => clearInterval(interval)
  }, [gameStats])

  const toggleChart = () => {
    setIsActive(!isActive)
  }

  const currentFidelity = data.length > 0 ? data[data.length - 1].fidelity : 0
  const currentCoherence = data.length > 0 ? data[data.length - 1].coherence : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-chart-1" />
            Quantum Metrics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${isActive ? "text-green-500 animate-pulse" : "text-gray-400"}`} />
            <span className="text-xs text-muted-foreground">{isActive ? "Live" : "Paused"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-chart-1">{currentFidelity.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Current Fidelity</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-chart-2">{currentCoherence.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Coherence</div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin", "dataMax"]}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === "fidelity" ? "Quantum Fidelity" : "Coherence Time",
                ]}
                labelFormatter={(time) => `Time: ${time}s`}
              />
              <Line
                type="monotone"
                dataKey="fidelity"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2.5}
                dot={false}
                name="fidelity"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="coherence"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                name="coherence"
                strokeDasharray="5 5"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-1 rounded-full" />
              <span>Quantum Fidelity</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 bg-chart-2 rounded-full border-2 border-chart-2"
                style={{ backgroundColor: "transparent" }}
              />
              <span>Coherence Time</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {gameStats?.attempts ? `${gameStats.attempts} Echo${gameStats.attempts !== 1 ? "s" : ""}` : "No data"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
