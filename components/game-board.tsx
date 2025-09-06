"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Target } from "lucide-react"

interface Position {
  x: number
  y: number
}

interface GameBoardProps {
  onStatsUpdate: (stats: any) => void
  gameStats: any
}

export function GameBoard({ onStatsUpdate, gameStats }: GameBoardProps) {
  const [maze, setMaze] = useState<number[][]>([])
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 })
  const [goalPos, setGoalPos] = useState<Position>({ x: 8, y: 8 })
  const [path, setPath] = useState<Position[]>([])
  const [echoPath, setEchoPath] = useState<Position[]>([])
  const [isEchoMode, setIsEchoMode] = useState(false)
  const [echoStep, setEchoStep] = useState(0)
  const [fidelityLoss, setFidelityLoss] = useState(0) // Track fidelity loss from quantum noise cells
  // Additional game state types
  const [gameState, setGameState] = useState<"playing" | "echo" | "completed" | "teleporting">("playing")
  const [teleportMessage, setTeleportMessage] = useState<string>("")

  const initializeMaze = useCallback(() => {
    // Determine maze size based on level (gradually increase from 10x10 to 12x12)
    const baseSize = 10
    const mazeSize = Math.min(baseSize + Math.floor(gameStats.level / 4), 12)
    
    const newMaze = Array(mazeSize)
      .fill(null)
      .map(() => Array(mazeSize).fill(0))

    // Create paths - difficulty based on level
    for (let i = 1; i < mazeSize - 1; i++) {
      for (let j = 1; j < mazeSize - 1; j++) {
        // As level increases, reduce the number of available paths
        if (gameStats.level <= 2) {
          // Very easy levels: almost all cells are paths
          if (i % 2 === 0 || j % 2 === 0 || (i % 2 === 1 && j % 2 === 1)) {
            newMaze[i][j] = 1
          }
        } else if (gameStats.level <= 4) {
          // Easy levels: lots of paths
          if (i % 2 === 1 || j % 2 === 1) {
            newMaze[i][j] = 1
          }
        } else if (gameStats.level <= 6) {
          // Medium levels: fewer paths
          if ((i % 2 === 1 && j % 2 === 0) || (i % 2 === 0 && j % 2 === 1)) {
            newMaze[i][j] = 1
          }
        } else if (gameStats.level <= 8) {
          // Hard levels: minimal paths
          if (i % 2 === 1 && j % 2 === 1) {
            newMaze[i][j] = 1
          }
        } else {
          // Very hard levels: extremely sparse paths
          if (i % 3 === 1 && j % 3 === 1) {
            newMaze[i][j] = 1
          }
        }
      }
    }

    // Random goal position (gets further away as level increases)
    const minDistance = 4 + Math.min(mazeSize - 6, Math.floor(gameStats.level / 2));
    let newGoalPos = { x: 0, y: 0 };
    do {
      newGoalPos = {
        x: Math.floor(Math.random() * (mazeSize - 4)) + 2,
        y: Math.floor(Math.random() * (mazeSize - 4)) + 2
      };
    } while (
      Math.abs(newGoalPos.x - 1) + Math.abs(newGoalPos.y - 1) < minDistance
    );
    
    setGoalPos(newGoalPos);

    // Add complexity based on level (more walls)
    const complexityFactor = Math.min(mazeSize * 2, Math.floor(gameStats.level * 1.8))
    for (let i = 0; i < complexityFactor; i++) {
      const x = Math.floor(Math.random() * (mazeSize - 4)) + 2
      const y = Math.floor(Math.random() * (mazeSize - 4)) + 2
      if (!(x === 1 && y === 1) && !(x === newGoalPos.x && y === newGoalPos.y)) {
        newMaze[x][y] = 0 // Add walls
      }
    }
    
    // Add special cells based on level
    if (gameStats.level > 2) {
      // Add quantum noise cells (3) that reduce fidelity when walked over
      const noiseCount = Math.min(gameStats.level, 7); // Up to 7 noise cells at high levels
      for (let i = 0; i < noiseCount; i++) {
        const x = Math.floor(Math.random() * (mazeSize - 4)) + 2
        const y = Math.floor(Math.random() * (mazeSize - 4)) + 2
        if (!(x === 1 && y === 1) && !(x === newGoalPos.x && y === newGoalPos.y) && newMaze[x][y] === 1) {
          newMaze[x][y] = 3 // Quantum noise cell
        }
      }
    }
    
    if (gameStats.level > 4) { // Reduced from level 5 to level 4
      // Add teleport cells (4) that randomly move the player
      const teleportCount = Math.min(Math.floor(gameStats.level / 2), 5); // Increased from 3 to 5 max
      for (let i = 0; i < teleportCount; i++) {
        const x = Math.floor(Math.random() * (mazeSize - 4)) + 2
        const y = Math.floor(Math.random() * (mazeSize - 4)) + 2
        if (!(x === 1 && y === 1) && !(x === newGoalPos.x && y === newGoalPos.y) && 
            newMaze[x][y] === 1 && newMaze[x][y] !== 3) {
          newMaze[x][y] = 4 // Teleport cell
        }
      }
    }

    // Ensure the goal position is valid (not a wall) and the player can reach it
    if (newMaze[newGoalPos.x] && newMaze[newGoalPos.x][newGoalPos.y] === 0) {
      // If goal is on a wall, place it on a valid path nearby
      newMaze[newGoalPos.x][newGoalPos.y] = 1
    }
    
    // Ensure there's a valid path to the goal
    ensurePathToGoal(newMaze, { x: 1, y: 1 }, newGoalPos)
    
    // Mark the goal position
    newMaze[newGoalPos.x][newGoalPos.y] = 2
    setMaze(newMaze)
  }, [gameStats.level])
  
  // Helper function to ensure there's a valid path to the goal
  const ensurePathToGoal = (maze: number[][], start: Position, goal: Position) => {
    // Simple algorithm to create a path from start to goal
    let currentX = start.x
    let currentY = start.y
    
    // Create a path along X axis first
    while (currentX !== goal.x) {
      currentX += currentX < goal.x ? 1 : -1
      if (maze[currentX] && maze[currentX][currentY] === 0) {
        maze[currentX][currentY] = 1 // Make it a valid path
      }
    }
    
    // Then create a path along Y axis
    while (currentY !== goal.y) {
      currentY += currentY < goal.y ? 1 : -1
      if (maze[currentX] && maze[currentX][currentY] === 0) {
        maze[currentX][currentY] = 1 // Make it a valid path
      }
    }
  }

  useEffect(() => {
    initializeMaze()
  }, [initializeMaze])

  const movePlayer = useCallback(
    (direction: string) => {
      if (gameState !== "playing") return

      setPlayerPos((prev) => {
        let newX = prev.x
        let newY = prev.y

        switch (direction) {
          case "ArrowUp":
            newX = Math.max(0, prev.x - 1)
            break
          case "ArrowDown":
            newX = Math.min(maze.length - 1, prev.x + 1)
            break
          case "ArrowLeft":
            newY = Math.max(0, prev.y - 1)
            break
          case "ArrowRight":
            newY = Math.min(maze.length - 1, prev.y + 1)
            break
        }

          // Check if move is valid
        if (maze[newX] && maze[newX][newY] !== 0) {
          const newPos = { x: newX, y: newY }
          setPath((prevPath) => [...prevPath, newPos])

          // Check for quantum noise cell
          if (maze[newX][newY] === 3) {
            // Stepped on a quantum noise cell, increase fidelity loss
            setFidelityLoss(prev => Math.min(prev + 5, 50)) // Max 50% fidelity loss
            
            // Visual feedback for quantum noise
            setTimeout(() => {
              setTeleportMessage("Quantum noise detected! Fidelity decreased.")
              setGameState("teleporting")
              
              setTimeout(() => {
                setGameState("playing")
                setTeleportMessage("")
              }, 1000)
            }, 100)
          }
          
          // Check for teleport cell
          if (maze[newX][newY] === 4) {
            // Find valid teleport destination
            let validCells: Position[] = []
            for (let tx = 0; tx < maze.length; tx++) {
              for (let ty = 0; ty < maze[tx].length; ty++) {
                // Only teleport to valid non-wall cells that aren't the current location
                if (maze[tx][ty] !== 0 && !(tx === newX && ty === newY)) {
                  validCells.push({ x: tx, y: ty })
                }
              }
            }
            
            if (validCells.length > 0) {
              // Select random destination
              const destination = validCells[Math.floor(Math.random() * validCells.length)]
              
              // Visual feedback for teleportation
              setTeleportMessage("Quantum teleportation in progress...")
              setGameState("teleporting")
              
              setTimeout(() => {
                setGameState("playing")
                setTeleportMessage("")
                return destination
              }, 1500)
            }
          }

          // Check goal
          if (newX === goalPos.x && newY === goalPos.y) {
            setTimeout(() => {
              const newStats = {
                ...gameStats,
                score: gameStats.score + 5, // Reduced from 100 to 5 points per level
                level: gameStats.level + 1,
              }
              onStatsUpdate(newStats)
              setGameState("completed")

              // Auto-reset for next level after 2 seconds
              setTimeout(() => {
                resetGame()
                setFidelityLoss(0) // Reset fidelity loss for new level
              }, 2000)
            }, 100)
          }          return newPos
        }

        // Check if player is stuck (completely surrounded by walls)
        const isStuck = checkIfPlayerIsStuck(prev)
        if (isStuck) {
          // If player is stuck, show a message and provide a way out
          setTeleportMessage("You've reached an inaccessible area! Teleporting back to start...")
          setGameState("teleporting")
          
          // Reset player to starting position after a short delay
          setTimeout(() => {
            setGameState("playing")
            setTeleportMessage("")
            return { x: 1, y: 1 }
          }, 1500)
        }

        return prev
      })
    },
    [gameState, maze, goalPos, gameStats, onStatsUpdate],
  )
  
  // Check if player is surrounded by walls on all sides
  const checkIfPlayerIsStuck = (position: Position): boolean => {
    const { x, y } = position
    const directions = [
      { x: x - 1, y }, // up
      { x: x + 1, y }, // down
      { x, y: y - 1 }, // left
      { x, y: y + 1 }  // right
    ]
    
    // Check if all surrounding cells are walls
    return directions.every(dir => 
      dir.x < 0 || 
      dir.x >= maze.length || 
      dir.y < 0 || 
      dir.y >= (maze[0] ? maze[0].length : 0) || 
      (maze[dir.x] && maze[dir.x][dir.y] === 0)
    )
  }

  const startQuantumEcho = useCallback(() => {
    if (path.length === 0 || gameState !== "playing") return

    setIsEchoMode(true)
    setGameState("echo")
    setEchoStep(0)

    // Create perturbed path
    const perturbedPath = path.map((pos) => {
      // Perturbation chance increases with level
      const perturbationChance = 0.1 + (gameStats.level * 0.05) // 10% + 5% per level
      if (Math.random() < perturbationChance) {
        // Level-based perturbation
        const directions = [
          { x: pos.x - 1, y: pos.y },
          { x: pos.x + 1, y: pos.y },
          { x: pos.x, y: pos.y - 1 },
          { x: pos.x, y: pos.y + 1 },
        ]

        const validDirections = directions.filter(
          (dir) => dir.x >= 0 && dir.x < 10 && dir.y >= 0 && dir.y < 10 && maze[dir.x] && maze[dir.x][dir.y] !== 0,
        )

        if (validDirections.length > 0) {
          return validDirections[Math.floor(Math.random() * validDirections.length)]
        }
      }
      return pos
    })

    setEchoPath(perturbedPath)

    // Animate echo
    let currentStep = 0
    const animationInterval = setInterval(() => {
      setEchoStep(currentStep)
      currentStep++

      if (currentStep >= perturbedPath.length) {
        clearInterval(animationInterval)

        // Calculate fidelity
        const fidelity = calculateFidelity(path, perturbedPath)

        setTimeout(() => {
          onStatsUpdate({
            ...gameStats,
            fidelity: Math.round(fidelity),
            attempts: gameStats.attempts + 1,
          })

          // Reset after delay
          setTimeout(() => {
            setIsEchoMode(false)
            setGameState("playing")
            setEchoPath([])
            setEchoStep(0)
          }, 1500)
        }, 500)
      }
    }, 150)
  }, [path, gameState, maze, gameStats, onStatsUpdate])

  const calculateFidelity = (originalPath: Position[], echoPath: Position[]) => {
    if (originalPath.length === 0) return 100

    let matches = 0
    const minLength = Math.min(originalPath.length, echoPath.length)

    for (let i = 0; i < minLength; i++) {
      if (originalPath[i].x === echoPath[i].x && originalPath[i].y === echoPath[i].y) {
        matches++
      }
    }

    // Calculate raw fidelity
    let rawFidelity = (matches / originalPath.length) * 100
    
    // Apply more aggressive level-based difficulty factor
    const levelFactor = Math.max(0, 100 - (gameStats.level * 3)) / 100 // Decrease max possible fidelity by 3% per level
    
    // Length penalty - longer paths are harder to maintain fidelity
    const lengthPenalty = Math.min(15, Math.floor(originalPath.length / 3)) // Up to 15% penalty for long paths
    
    // Teleportation penalty - based on how many teleport cells are in the maze
    let teleportCount = 0
    for (let x = 0; x < maze.length; x++) {
      for (let y = 0; y < maze[x].length; y++) {
        if (maze[x][y] === 4) teleportCount++;
      }
    }
    const teleportPenalty = teleportCount * 1.5 // 1.5% per teleport cell in the maze
    
    // Apply quantum noise fidelity loss and all penalties
    rawFidelity = (rawFidelity * levelFactor) - fidelityLoss - lengthPenalty - teleportPenalty
    
    // Ensure fidelity is between 0 and 100
    return Math.max(0, Math.min(100, rawFidelity))
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default only for game keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          movePlayer(e.key)
        } else if (e.key === " ") {
          startQuantumEcho()
        }
      }
    }

    // Only add listener when component is focused
    const gameElement = document.getElementById("game-board")
    if (gameElement) {
      gameElement.addEventListener("keydown", handleKeyPress)
      gameElement.focus()

      return () => gameElement.removeEventListener("keydown", handleKeyPress)
    }
  }, [movePlayer, startQuantumEcho])

  const resetGame = () => {
    setPlayerPos({ x: 1, y: 1 })
    setPath([])
    setEchoPath([])
    setIsEchoMode(false)
    setEchoStep(0)
    setGameState("playing")
    
    // Generate valid goal coordinates that are within walkable paths
    let newGoalX, newGoalY
    
    // As levels increase, make the goal position more challenging
    if (gameStats.level <= 3) {
      // Easy levels: goal is in the bottom-right corner
      do {
        newGoalX = Math.floor(Math.random() * 3) + 7 // 7-9
        newGoalY = Math.floor(Math.random() * 3) + 7 // 7-9
      } while (maze[newGoalX] && maze[newGoalX][newGoalY] === 0)
    } else if (gameStats.level <= 6) {
      // Medium levels: goal can be anywhere on the right side
      do {
        newGoalX = Math.floor(Math.random() * 8) + 2 // 2-9
        newGoalY = Math.floor(Math.random() * 3) + 7 // 7-9
      } while (maze[newGoalX] && maze[newGoalX][newGoalY] === 0)
    } else {
      // Hard levels: goal can be anywhere in the maze
      do {
        newGoalX = Math.floor(Math.random() * 8) + 2 // 2-9
        newGoalY = Math.floor(Math.random() * 8) + 2 // 2-9
      } while (maze[newGoalX] && maze[newGoalX][newGoalY] === 0)
    }
    
    setGoalPos({ x: newGoalX, y: newGoalY })
    initializeMaze()
  }

  const getCellClass = (x: number, y: number) => {
    const baseClass =
      "w-8 h-8 border border-border flex items-center justify-center text-xs font-bold transition-all duration-200"

    if (maze[x] && maze[x][y] === 0) return `${baseClass} bg-gray-800 text-gray-400`
    if (maze[x] && maze[x][y] === 2) return `${baseClass} bg-accent text-accent-foreground`
    if (maze[x] && maze[x][y] === 3) return `${baseClass} bg-amber-500/30 text-amber-700 animate-pulse` // Quantum noise cell
    if (maze[x] && maze[x][y] === 4) return `${baseClass} bg-purple-500/30 text-purple-700 animate-ping` // Teleport cell
    if (playerPos.x === x && playerPos.y === y) return `${baseClass} bg-primary text-primary-foreground quantum-pulse`

    const isInPath = path.some((pos) => pos.x === x && pos.y === y)
    const echoIndex = echoPath.findIndex((pos) => pos.x === x && pos.y === y)
    const isInEchoPath = echoIndex !== -1
    const isCurrentEchoStep = echoIndex <= echoStep

    if (isEchoMode && isInEchoPath && isCurrentEchoStep) {
      return `${baseClass} bg-chart-3 text-white animate-pulse`
    }
    if (isEchoMode && isInEchoPath) {
      return `${baseClass} bg-chart-3/30 text-chart-3`
    }
    if (isInPath) return `${baseClass} bg-primary/20 text-primary`

    return `${baseClass} bg-card hover:bg-muted text-foreground`
  }

  return (
    <div className="space-y-4" id="game-board" tabIndex={0}>
      {/* Game Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            Level {gameStats.level}
          </Badge>
          <Badge variant={gameState === "playing" ? "default" : gameState === "echo" ? "secondary" : "outline"}>
            {gameState === "playing" ? "Playing" : gameState === "echo" ? "Quantum Echo Active" : "Completed"}
          </Badge>
          <Badge variant={
            gameStats.level <= 3 ? "default" : 
            gameStats.level <= 6 ? "secondary" : 
            gameStats.level <= 9 ? "destructive" :
            "outline"
          }>
            {gameStats.level <= 3 ? "Easy" : 
             gameStats.level <= 6 ? "Medium" : 
             gameStats.level <= 9 ? "Hard" : 
             "Extreme"}
          </Badge>
          
          {/* Detailed difficulty explanation */}
          <div className="ml-2 text-xs text-muted-foreground">
            {gameStats.level <= 2 && "Larger paths, fewer obstacles"}
            {gameStats.level > 2 && gameStats.level <= 4 && "Quantum noise cells appear"}
            {gameStats.level > 4 && gameStats.level <= 6 && "Teleport cells and increased complexity"}
            {gameStats.level > 6 && "Advanced maze patterns and quantum effects"}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={startQuantumEcho}
            disabled={gameState !== "playing" || path.length === 0}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Quantum Echo
          </Button>
          {/* Removed Reset button */}
        </div>
      </div>

      {/* Level progression and difficulty explanation (shown at higher levels) */}
      {gameStats.level > 2 && (
        <div className="mb-2 p-2 bg-card rounded-md border text-xs">
          <div className="font-medium mb-1">Difficulty Progression:</div>
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <div 
                key={level} 
                className={`h-2 w-full rounded-sm ${
                  level === gameStats.level ? 'bg-primary animate-pulse' :
                  level < gameStats.level ? 'bg-muted-foreground' : 'bg-muted'
                }`} 
                title={`Level ${level}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>• Level 1-2: Basic maze navigation</div>
            <div>• Level 3-4: Quantum noise appears</div>
            <div>• Level 5-6: Teleportation cells</div>
            <div>• Level 7+: Complex maze patterns</div>
          </div>
        </div>
      )}

      {/* Maze Grid */}
      <div className="inline-block p-4 bg-card rounded-lg border">
        {/* Dynamic grid based on maze size */}
        <div 
          className={`grid gap-0 border-2 border-border`} 
          style={{ 
            gridTemplateColumns: `repeat(${maze.length}, 1fr)`,
            fontSize: maze.length > 10 ? '0.8rem' : '1rem'
          }}
        >
          {maze.map((row, x) =>
            row.map((cell, y) => (
              <div key={`${x}-${y}`} className={getCellClass(x, y)}>
                {playerPos.x === x && playerPos.y === y && <span>●</span>}
                {maze[x] && maze[x][y] === 2 && <span>🎯</span>}
                {maze[x] && maze[x][y] === 3 && <span>⚡</span>}
                {maze[x] && maze[x][y] === 4 && <span>↯</span>}
              </div>
            )),
          )}
        </div>
        {/* Cell Legend - show after level 3 */}
        {gameStats.level > 3 && (
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-primary text-primary-foreground flex items-center justify-center rounded-sm">●</div>
              <span>You</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-accent text-accent-foreground flex items-center justify-center rounded-sm">🎯</div>
              <span>Goal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-amber-500/30 text-amber-700 flex items-center justify-center rounded-sm animate-pulse">⚡</div>
              <span>Quantum Noise (-5% Fidelity)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-500/30 text-purple-700 flex items-center justify-center rounded-sm animate-pulse">↯</div>
              <span>Teleport (Random Warp)</span>
            </div>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Click here first, then use arrow keys to move • Press SPACE for Quantum Echo</p>
        <p>
          Path length: {path.length} steps • Fidelity: {gameStats.fidelity}% • Attempts: {gameStats.attempts}
          {fidelityLoss > 0 && <span className="text-amber-500"> • Fidelity loss: {fidelityLoss}%</span>}
        </p>
        {gameState === "completed" && (
          <div>
            <p className="text-green-600 font-medium">🎉 Level Complete! +5 points! Auto-advancing to level {gameStats.level + 1}...</p>
            {/* Use next level (gameStats.level + 1) for level-specific messages */}
            {gameStats.level >= 2 && (
              <p className="text-xs text-muted-foreground mt-1">
                {gameStats.level + 1 === 3 && "Quantum noise cells will appear in the next level!"}
                {gameStats.level + 1 === 5 && "You've unlocked teleport cells! Watch for the purple portals."}
                {gameStats.level + 1 === 7 && "Nice progress! The quantum complexity increases from here."}
                {gameStats.level + 1 === 9 && "Impressive quantum control! Maze patterns are getting more complex."}
                {gameStats.level + 1 === 10 && "You've reached quantum master level! Your fidelity control is remarkable."}
                {gameStats.level + 1 > 10 && (gameStats.level + 1) % 5 === 0 && "Extraordinary quantum mastery! Can you maintain control at these extreme levels?"}
              </p>
            )}
          </div>
        )}
        {gameState === "teleporting" && (
          <p className="text-amber-500 font-medium">✨ {teleportMessage}</p>
        )}
        {isEchoMode && (
          <p className="text-chart-3 font-medium">🌊 Quantum Echo: Retracing path with quantum perturbations...</p>
        )}
      </div>
    </div>
  )
}
