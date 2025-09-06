"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Beaker, Zap, Waves, Thermometer, Activity } from "lucide-react"

export function LabMode() {
  const [decoherence, setDecoherence] = useState([0.1])
  const [perturbation, setPerturbation] = useState([0.2])
  const [temperature, setTemperature] = useState([300])
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runExperiment = () => {
    setIsRunning(true)

    // Simulate quantum experiment with more realistic physics
    setTimeout(() => {
      const baseTemp = 273 // Kelvin
      const tempFactor = Math.max(0, (temperature[0] - baseTemp) / 100)

      // Fidelity decreases with decoherence, perturbation, and temperature
      const decoherenceEffect = decoherence[0] * 80
      const perturbationEffect = perturbation[0] * 40
      const thermalEffect = tempFactor * 15

      const fidelity = Math.max(5, 100 - decoherenceEffect - perturbationEffect - thermalEffect)

      // Coherence time inversely related to decoherence and temperature
      const coherenceTime = Math.max(0.1, 10 / (1 + decoherence[0] * 5 + tempFactor))

      // Entanglement affected by perturbations and thermal noise
      const entanglement = Math.max(0, 95 - perturbation[0] * 60 - thermalEffect)

      setResults({
        fidelity: Math.round(fidelity * 100) / 100,
        coherenceTime: Math.round(coherenceTime * 100) / 100,
        entanglement: Math.round(entanglement * 100) / 100,
        temperature: temperature[0],
        decoherenceRate: decoherence[0],
        perturbationStrength: perturbation[0],
      })
      setIsRunning(false)
    }, 2500) // Slightly longer for more realistic feel
  }

  const getParameterQuality = (value: number, type: "decoherence" | "perturbation" | "temperature") => {
    switch (type) {
      case "decoherence":
        if (value < 0.2) return { color: "text-green-600", label: "Low Noise" }
        if (value < 0.5) return { color: "text-yellow-600", label: "Moderate" }
        return { color: "text-red-600", label: "High Noise" }
      case "perturbation":
        if (value < 0.3) return { color: "text-green-600", label: "Stable" }
        if (value < 0.6) return { color: "text-yellow-600", label: "Unstable" }
        return { color: "text-red-600", label: "Chaotic" }
      case "temperature":
        if (value < 100) return { color: "text-blue-600", label: "Cryogenic" }
        if (value < 300) return { color: "text-green-600", label: "Cold" }
        if (value < 400) return { color: "text-yellow-600", label: "Room Temp" }
        return { color: "text-red-600", label: "Hot" }
    }
  }

  return (
    <div className="space-y-6">
      {/* Lab Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="quantum-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-chart-1" />
                Decoherence Rate
              </div>
              <Badge variant="outline" className={getParameterQuality(decoherence[0], "decoherence").color}>
                {getParameterQuality(decoherence[0], "decoherence").label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider value={decoherence} onValueChange={setDecoherence} max={1} min={0} step={0.01} className="w-full" />
            <div className="text-xs text-muted-foreground">{decoherence[0].toFixed(3)} Hz</div>
          </CardContent>
        </Card>

        <Card className="quantum-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-chart-2" />
                Perturbation Strength
              </div>
              <Badge variant="outline" className={getParameterQuality(perturbation[0], "perturbation").color}>
                {getParameterQuality(perturbation[0], "perturbation").label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider
              value={perturbation}
              onValueChange={setPerturbation}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">{perturbation[0].toFixed(3)} units</div>
          </CardContent>
        </Card>

        <Card className="quantum-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-chart-3" />
                Temperature
              </div>
              <Badge variant="outline" className={getParameterQuality(temperature[0], "temperature").color}>
                {getParameterQuality(temperature[0], "temperature").label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Slider value={temperature} onValueChange={setTemperature} max={500} min={0} step={1} className="w-full" />
            <div className="text-xs text-muted-foreground">
              {temperature[0]} K ({(temperature[0] - 273.15).toFixed(1)}°C)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Run Experiment */}
      <div className="text-center">
        <Button
          onClick={runExperiment}
          disabled={isRunning}
          size="lg"
          className="w-full md:w-auto quantum-hover quantum-glow"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Running Quantum Simulation...
            </>
          ) : (
            <>
              <Beaker className="w-4 h-4 mr-2" />
              Run Quantum Experiment
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {results && (
        <Card className="quantum-glow-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
              Experimental Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg coherence-wave">
                <div className="text-2xl font-bold text-chart-1">{results.fidelity}%</div>
                <div className="text-xs text-muted-foreground">Quantum Fidelity</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg coherence-wave">
                <div className="text-2xl font-bold text-chart-2">{results.coherenceTime}s</div>
                <div className="text-xs text-muted-foreground">Coherence Time</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg coherence-wave">
                <div className="text-2xl font-bold text-chart-3">{results.entanglement}%</div>
                <div className="text-xs text-muted-foreground">Entanglement</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg coherence-wave">
                <div className="text-2xl font-bold text-chart-4">{results.temperature}K</div>
                <div className="text-xs text-muted-foreground">Temperature</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold flex items-center gap-2">
                <Beaker className="w-4 h-4" />
                Quantum Analysis:
              </h4>
              <p className="text-muted-foreground">
                {results.fidelity > 80
                  ? "🌟 Excellent quantum coherence maintained! The system shows minimal decoherence effects, making it ideal for quantum computing applications."
                  : results.fidelity > 60
                    ? "⚡ Good quantum fidelity achieved. Some environmental effects are present but the system remains largely coherent."
                    : results.fidelity > 40
                      ? "⚠️ Moderate quantum fidelity. Significant decoherence detected - consider reducing temperature or environmental perturbations."
                      : "🔥 Poor quantum coherence. High decoherence rate detected. System requires better isolation from environmental noise."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-xs">
                <div className="p-2 bg-muted/30 rounded">
                  <strong>Decoherence:</strong> {(results.decoherenceRate * 100).toFixed(1)}% rate
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <strong>Perturbation:</strong> {(results.perturbationStrength * 100).toFixed(1)}% strength
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <strong>Thermal Effect:</strong> {results.temperature > 273 ? "Significant" : "Minimal"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Info */}
      <Card className="quantum-interference">
        <CardHeader>
          <CardTitle className="text-lg">Quantum Physics Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-chart-1 mb-1 flex items-center gap-2">
              <Waves className="w-4 h-4" />
              Decoherence
            </h4>
            <p className="text-muted-foreground">
              The process by which quantum systems lose their quantum behavior and become classical due to interaction
              with the environment. Lower values preserve quantum properties longer.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-chart-2 mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Quantum Fidelity
            </h4>
            <p className="text-muted-foreground">
              A measure of how close a quantum state is to a target state, ranging from 0% (completely different) to
              100% (identical). Critical for quantum error correction.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-chart-3 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Coherence Time
            </h4>
            <p className="text-muted-foreground">
              The time during which a quantum system maintains its quantum properties before decoherence sets in. Longer
              coherence times enable more complex quantum operations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
