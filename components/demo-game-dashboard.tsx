"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GameBoard } from "@/components/game-board"
import { LabMode } from "@/components/lab-mode"
import { Atom, Play, BookOpen, FlaskConical, ArrowRight, Star, AlertCircle } from "lucide-react"

type GameMode = "menu" | "tutorial" | "game" | "lab"

export function DemoGameDashboard() {
  const [currentMode, setCurrentMode] = useState<GameMode>("menu")
  const [gameStats, setGameStats] = useState({
    score: 0,
    level: 1,
    fidelity: 100,
    attempts: 0,
  })
  const [tutorialStep, setTutorialStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Welcome to Quantum Physics!",
      description:
        "Learn how quantum particles behave in mysterious ways. Quantum mechanics is the science of the very small - atoms and particles that make up everything around us!",
      icon: <Atom className="w-8 h-8 text-primary" />,
    },
    {
      title: "Navigate the Maze",
      description:
        "Use arrow keys (↑↓←→) to move your quantum particle through the maze. Your particle leaves a trail showing where it has been.",
      icon: <Play className="w-8 h-8 text-primary" />,
    },
    {
      title: "Quantum Echo Magic",
      description:
        "Press SPACE to activate Quantum Echo! This simulates quantum uncertainty - when we try to retrace the particle's path, quantum effects cause small random changes.",
      icon: <Star className="w-8 h-8 text-primary" />,
    },
    {
      title: "Understanding Fidelity",
      description:
        "Fidelity measures how well the echo matches your original path. Higher fidelity means better quantum coherence - a key concept in quantum computing!",
      icon: <FlaskConical className="w-8 h-8 text-primary" />,
    },
  ]

  const renderMenu = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Atom className="w-8 h-8 text-primary quantum-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Quantum Echo Maze</h1>
              <p className="text-muted-foreground">Learn quantum physics through interactive gameplay!</p>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <Card className="mb-8 border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertCircle className="w-5 h-5" />
              Demo Mode
            </CardTitle>
            <CardDescription>
              You're playing in demo mode. To save progress and access leaderboards, add your Supabase environment
              variables in Project Settings.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Your Progress (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{gameStats.level}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{gameStats.score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">{gameStats.fidelity}%</div>
                <div className="text-sm text-muted-foreground">Best Fidelity</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="game-card cursor-pointer" onClick={() => setCurrentMode("tutorial")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Learn Mode
              </CardTitle>
              <CardDescription>Start with the basics of quantum physics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Beginner Friendly</Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="game-card cursor-pointer" onClick={() => setCurrentMode("game")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-accent" />
                Game Mode
              </CardTitle>
              <CardDescription>Navigate mazes and master quantum mechanics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="default">Interactive</Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="game-card cursor-pointer" onClick={() => setCurrentMode("lab")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-chart-3" />
                Lab Mode
              </CardTitle>
              <CardDescription>Experiment with quantum parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Advanced</Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderTutorial = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentMode("menu")}>
            ← Back to Menu
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">{tutorialSteps[tutorialStep].icon}</div>
            <CardTitle>{tutorialSteps[tutorialStep].title}</CardTitle>
            <CardDescription className="text-left mt-4">{tutorialSteps[tutorialStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {tutorialStep + 1} of {tutorialSteps.length}
                  </span>
                </div>
                <Progress value={((tutorialStep + 1) / tutorialSteps.length) * 100} />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                  disabled={tutorialStep === 0}
                >
                  Previous
                </Button>

                {tutorialStep < tutorialSteps.length - 1 ? (
                  <Button onClick={() => setTutorialStep(tutorialStep + 1)}>Next</Button>
                ) : (
                  <Button onClick={() => setCurrentMode("game")}>Start Playing!</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderGame = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" onClick={() => setCurrentMode("menu")}>
            ← Back to Menu
          </Button>
          <Badge variant="default">Game Mode</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="w-5 h-5 text-primary" />
                  Quantum Maze Navigation
                </CardTitle>
                <CardDescription>
                  Click on the maze first, then use arrow keys to move. Press SPACE for Quantum Echo!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameBoard onStatsUpdate={setGameStats} gameStats={gameStats} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <Badge variant="outline">{gameStats.level}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Score:</span>
                  <Badge variant="default">{gameStats.score}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Fidelity:</span>
                  <Badge variant="secondary">{gameStats.fidelity}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓←→</kbd>
                  <span>Move particle</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">SPACE</kbd>
                  <span>Quantum Echo</span>
                </div>
                <p className="text-muted-foreground text-xs mt-2">
                  💡 Click on the maze area first to focus it, then use keyboard controls
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Happening?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Blue trail:</strong> Your particle's path
                </p>
                <p>
                  <strong>Purple echo:</strong> Quantum uncertainty effects
                </p>
                <p>
                  <strong>Fidelity:</strong> How well quantum states are preserved
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLab = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" onClick={() => setCurrentMode("menu")}>
            ← Back to Menu
          </Button>
          <Badge variant="outline">Lab Mode</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-chart-3" />
              Quantum Physics Laboratory
            </CardTitle>
            <CardDescription>
              Experiment with quantum parameters and observe their effects on quantum systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LabMode />
          </CardContent>
        </Card>
      </div>
    </div>
  )

  switch (currentMode) {
    case "tutorial":
      return renderTutorial()
    case "game":
      return renderGame()
    case "lab":
      return renderLab()
    default:
      return renderMenu()
  }
}
