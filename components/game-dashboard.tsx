"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GameBoard } from "@/components/game-board"
import { LabMode } from "@/components/lab-mode"
import { QuantumGlossary } from "@/components/quantum-glossary"
import type { User } from "@supabase/supabase-js"
import { Atom, Play, BookOpen, FlaskConical, LogOut, UserIcon, ArrowRight, Star, BrainCircuit } from "lucide-react"

interface GameDashboardProps {
  user: User
}

type GameMode = "menu" | "tutorial" | "game" | "lab"

export function GameDashboard({ user }: GameDashboardProps) {
  const [currentMode, setCurrentMode] = useState<GameMode>("menu")
  const [gameStats, setGameStats] = useState({
    score: 0,
    level: 1,
    fidelity: 100,
    attempts: 0,
  })
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showGlossary, setShowGlossary] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  const tutorialSteps = [
    {
      title: "Welcome to Quantum Echo Maze!",
      description: "This game teaches quantum physics concepts through fun gameplay. You'll learn about quantum particles, fidelity, decoherence, and more!",
      icon: <Atom className="w-8 h-8 text-primary" />,
    },
    {
      title: "Navigate the Maze",
      description: "Use arrow keys to move your quantum particle through the maze. The goal is to reach the target (🎯) in each level.",
      icon: <Play className="w-8 h-8 text-primary" />,
    },
    {
      title: "What is Quantum Echo?",
      description: "Quantum Echo is a core game mechanic that simulates quantum uncertainty. Press SPACE to activate it and watch your path replay with quantum perturbations!",
      icon: <Star className="w-8 h-8 text-primary" />,
    },
    {
      title: "Understanding Fidelity",
      description: "Fidelity measures how accurately a quantum state is reproduced. In our game, it shows how closely your echo path matches your original path (higher is better).",
      icon: <Star className="w-8 h-8 text-chart-3" />,
    },
    {
      title: "Quantum Decoherence",
      description: "Decoherence is the loss of quantum properties due to environmental interaction. In the game, it causes perturbations in your echo path.",
      icon: <Star className="w-8 h-8 text-accent" />,
    },
    {
      title: "Game Mechanics",
      description: "Complete levels by reaching the target. Your score increases with each level. Higher fidelity gives better quantum control.",
      icon: <Play className="w-8 h-8 text-accent" />,
    },
    {
      title: "Lab Mode",
      description: "After playing the game, try Lab Mode to experiment with quantum parameters like decoherence rate, temperature, and perturbation strength.",
      icon: <FlaskConical className="w-8 h-8 text-chart-3" />,
    },
    {
      title: "Getting Unstuck",
      description: "If you ever get trapped or reach an inaccessible area, the game will automatically teleport you back to the starting position.",
      icon: <Star className="w-8 h-8 text-amber-500" />,
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
              <p className="text-muted-foreground">Welcome back, {user.email?.split("@")[0]}!</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Your Progress
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between">
          <Button variant="outline" onClick={() => setCurrentMode("menu")}>
            ← Back to Menu
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowGlossary(!showGlossary)} 
            className="flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            {showGlossary ? "Hide Glossary" : "Show Quantum Glossary"}
          </Button>
        </div>
        
        {showGlossary ? (
          <QuantumGlossary />
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">{tutorialSteps[tutorialStep].icon}</div>
              <CardTitle>{tutorialSteps[tutorialStep].title}</CardTitle>
              <CardDescription className="text-base mt-2">{tutorialSteps[tutorialStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Tutorial-specific visuals */}
                <div className="bg-card p-4 rounded-lg border">
                  {tutorialStep === 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">What You'll Learn</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Navigate quantum mazes with arrow keys</li>
                        <li>Experience quantum uncertainty with Quantum Echo</li>
                        <li>Understand fidelity and quantum measurements</li>
                        <li>Explore quantum decoherence effects</li>
                      </ul>
                    </div>
                  )}
                  
                  {tutorialStep === 1 && (
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="border rounded p-2 mx-auto inline-block">
                          <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓←→</kbd>
                        </div>
                        <p>Move your quantum particle</p>
                      </div>
                      <div className="space-y-2">
                        <div className="border rounded p-2 mx-auto inline-block">
                          <span className="text-xl">🎯</span>
                        </div>
                        <p>Reach the target to complete level</p>
                      </div>
                    </div>
                  )}
                  
                  {tutorialStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">How Quantum Echo Works:</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Navigate through the maze to create a path</li>
                        <li>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">SPACE</kbd> to activate Quantum Echo</li>
                        <li>Watch as your path is replayed with quantum perturbations</li>
                        <li>Observe how quantum uncertainty affects the echo path</li>
                      </ol>
                    </div>
                  )}
                  
                  {tutorialStep === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-xs">
                          <div className="h-4 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-chart-3" style={{ width: "85%" }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs">Low Fidelity</span>
                            <span className="text-xs font-medium">85%</span>
                            <span className="text-xs">High Fidelity</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-center">Fidelity is displayed as a percentage. The higher the percentage, the more accurate your quantum operations.</p>
                    </div>
                  )}
                  
                  {tutorialStep === 4 && (
                    <div className="space-y-3">
                      <p className="text-sm">In quantum physics, decoherence happens when a quantum system interacts with its environment, causing it to lose its quantum properties.</p>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                            <Atom className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm mt-2">Coherent Quantum State</p>
                        </div>
                        <div>
                          <div className="p-2 bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                            <Atom className="w-6 h-6 text-accent animate-pulse" />
                          </div>
                          <p className="text-sm mt-2">Decoherence in Action</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {tutorialStep === 5 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xl font-bold text-primary">1-10</div>
                          <p className="text-xs">Game Levels</p>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-accent">5</div>
                          <p className="text-xs">Points per Level</p>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-chart-3">0-100%</div>
                          <p className="text-xs">Fidelity Range</p>
                        </div>
                      </div>
                      <p className="text-sm text-center">
                        The game gets progressively more challenging as you advance through levels.
                      </p>
                    </div>
                  )}
                  
                  {tutorialStep === 6 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold">Lab Mode Features:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><span className="font-medium">Decoherence Rate:</span> Control how quickly quantum states degrade</li>
                        <li><span className="font-medium">Temperature:</span> Higher temperature increases environmental noise</li>
                        <li><span className="font-medium">Perturbation Strength:</span> Adjust the magnitude of quantum fluctuations</li>
                        <li><span className="font-medium">Real-time Results:</span> See the effects of your parameter changes</li>
                      </ul>
                    </div>
                  )}
                  
                  {tutorialStep === 7 && (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="p-3 bg-amber-500/20 rounded-full">
                          <Star className="w-6 h-6 text-amber-500" />
                        </div>
                      </div>
                      <p className="text-sm text-center">
                        If you find yourself in an inaccessible area or surrounded by walls, the game will detect this and 
                        teleport you back to the start position with a clear notification.
                      </p>
                    </div>
                  )}
                </div>
                
                <Progress value={((tutorialStep + 1) / tutorialSteps.length) * 100} />

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
                
                <div className="text-center text-sm text-muted-foreground">
                  Step {tutorialStep + 1} of {tutorialSteps.length}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-xs flex items-center justify-center gap-1"
                  onClick={() => {
                    setCurrentMode("tutorial")
                    setShowGlossary(true)
                  }}
                >
                  <BrainCircuit className="w-3 h-3" />
                  View Quantum Glossary
                </Button>
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
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                setCurrentMode("tutorial")
                setShowGlossary(true)
              }}
            >
              <BrainCircuit className="w-4 h-4" />
              Quantum Glossary
            </Button>
            <Badge variant="outline">Lab Mode</Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-chart-3" />
              Quantum Physics Laboratory
            </CardTitle>
            <CardDescription>Experiment with quantum parameters and observe their effects</CardDescription>
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
