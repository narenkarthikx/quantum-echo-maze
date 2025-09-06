# Quantum Echo Maze - Complete Game Documentation

## Overview
Quantum Echo Maze is an educational game that teaches quantum physics concepts through interactive gameplay. Players navigate quantum particles through mazes while learning about quantum mechanics, decoherence, and fidelity measurements.

## Game Components

### 1. Main Application (`app/page.tsx`)
- **Purpose**: Main game container and mode switcher
- **Features**: 
  - Toggle between Game Mode and Lab Mode
  - Centralized state management for game statistics
  - Responsive layout with sidebar for stats and charts

### 2. Game Board (`components/game-board.tsx`)
- **Purpose**: Core maze navigation gameplay
- **Features**:
  - 10x10 procedurally generated maze
  - Arrow key movement controls
  - Quantum Echo mechanic (SPACE key)
  - Path tracking and fidelity calculation
  - Visual feedback for player, goal, and paths

### 3. Lab Mode (`components/lab-mode.tsx`)
- **Purpose**: Educational quantum physics experiments
- **Features**:
  - Interactive parameter controls (decoherence, perturbation, temperature)
  - Quantum experiment simulation
  - Real-time results analysis
  - Educational explanations of quantum concepts

### 4. Game Statistics (`components/game-stats.tsx`)
- **Purpose**: Display current game metrics
- **Features**:
  - Score, level, fidelity tracking
  - Visual progress indicators
  - Real-time updates during gameplay

### 5. Fidelity Chart (`components/fidelity-chart.tsx`)
- **Purpose**: Visual representation of quantum fidelity over time
- **Features**:
  - Real-time line chart
  - Historical fidelity data
  - Interactive tooltips

## Game Modes Explained

### Game Mode
- **Objective**: Navigate through mazes to reach the goal
- **Controls**: 
  - Arrow keys: Move quantum particle
  - SPACE: Activate Quantum Echo (rewind with perturbations)
- **Scoring**: Based on fidelity, speed, and level completion
- **Progression**: Each completed level generates a new, more complex maze

### Lab Mode
- **Objective**: Experiment with quantum physics parameters
- **Controls**: 
  - Sliders to adjust decoherence rate, perturbation strength, and temperature
  - Run experiment button to simulate quantum effects
- **Learning**: Understand how environmental factors affect quantum systems
- **Results**: Real-time analysis of quantum fidelity, coherence time, and entanglement

## Quantum Echo Mechanic
The core innovation of the game - when activated:
1. Records the player's movement path
2. Simulates quantum perturbations (random deviations)
3. Calculates fidelity based on path similarity
4. Provides visual feedback of the "echo" path
5. Updates game statistics based on quantum coherence

## Key Quantum Physics Concepts

### Quantum Fidelity
- Measures how accurately a quantum state can be reproduced
- In the game: How closely the echo path matches the original
- Range: 0-100% (higher is better)

### Decoherence
- Loss of quantum properties due to environmental interaction
- In the game: Causes perturbations in the echo path
- Affected by temperature and external disturbances

### Coherence Time
- Duration a quantum system maintains its properties
- In the game: How long quantum effects persist
- Inversely related to decoherence rate

## Technical Implementation

### State Management
- React hooks for local component state
- Props drilling for cross-component communication
- Real-time updates using useEffect and callbacks

### Game Logic
- Maze generation using algorithmic patterns
- Collision detection for movement validation
- Path tracking with position arrays
- Fidelity calculation using mathematical similarity

### Visual Design
- Quantum-themed color palette (blues, purples, teals)
- Animated elements for quantum effects
- Responsive grid layout for maze display
- Chart visualizations for data representation

## Future Enhancements (Supabase Integration)

### Database Schema
\`\`\`sql
-- User profiles and authentication
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Game sessions and scores
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('game', 'lab')),
  score INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  fidelity DECIMAL(5,2) DEFAULT 100.00,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Lab experiment results
CREATE TABLE lab_experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  decoherence_rate DECIMAL(4,3) NOT NULL,
  perturbation_strength DECIMAL(4,3) NOT NULL,
  temperature INTEGER NOT NULL,
  resulting_fidelity DECIMAL(5,2) NOT NULL,
  coherence_time DECIMAL(6,3) NOT NULL,
  entanglement DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Leaderboards
CREATE TABLE leaderboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  high_score INTEGER NOT NULL,
  max_level INTEGER NOT NULL,
  best_fidelity DECIMAL(5,2) NOT NULL,
  total_games INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
\`\`\`

### Planned Features
- User authentication and profiles
- Persistent score tracking and leaderboards
- Historical experiment data analysis
- Multiplayer quantum challenges
- Advanced quantum mechanics simulations
- Educational progress tracking

## Setup Instructions

### Current Setup (No Database)
1. The game runs entirely in the browser
2. No external dependencies required
3. All data is stored in local component state
4. Refresh resets all progress

### Future Supabase Setup
1. Create Supabase project
2. Run the provided SQL schema
3. Configure authentication providers
4. Add environment variables to Vercel
5. Enable Row Level Security (RLS) policies
6. Deploy with persistent data storage

## Educational Value
This game teaches quantum physics through:
- Interactive visualization of quantum concepts
- Hands-on experimentation with parameters
- Real-time feedback on quantum behavior
- Progressive difficulty that builds understanding
- Gamification of complex scientific principles

The combination of gameplay and education makes quantum physics accessible to learners of all levels while maintaining scientific accuracy.
