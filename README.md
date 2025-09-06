# Quantum Echo Maze 🌀

An interactive educational game that teaches quantum physics concepts through engaging gameplay. Navigate quantum particles through mazes while learning about quantum mechanics, decoherence, and fidelity measurements.

## 🎮 Game Features

- **Interactive Maze Navigation**: Control quantum particles through procedurally generated mazes
- **Quantum Echo Mechanic**: Experience quantum perturbations and fidelity calculations
- **Lab Mode**: Experiment with quantum physics parameters in real-time
- **Educational Content**: Learn quantum concepts through hands-on gameplay
- **Real-time Visualizations**: Interactive charts showing quantum fidelity over time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/narenkarthikx/quantum-echo-maze.git
   cd quantum-echo-maze
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

The game will run in **demo mode** by default (no database required).

## 🎯 How to Play

### Game Mode
- **Movement**: Use arrow keys to navigate the quantum particle
- **Quantum Echo**: Press `SPACE` to activate quantum echo effects
- **Objective**: Reach the goal while maintaining high quantum fidelity
- **Progression**: Complete levels to unlock more complex mazes

### Lab Mode
- Adjust quantum parameters using interactive sliders:
  - **Decoherence Rate**: Environmental interference level
  - **Perturbation Strength**: Quantum fluctuation intensity  
  - **Temperature**: Thermal noise affecting the system
- Run experiments to see how parameters affect quantum behavior
- Analyze results through real-time visualizations

## 🔧 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization
- **Database**: Supabase (optional)
- **Authentication**: Supabase Auth (optional)

## ⚙️ Database Setup (Optional)

For persistent user data and leaderboards, you can set up Supabase:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**
   ```sql
   -- Execute the SQL in scripts/setup-database.sql
   ```

3. **Add environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Restart the development server**
   ```bash
   npm dev
   ```

## 🧪 Quantum Concepts Explained

### Quantum Fidelity
Measures how accurately a quantum state can be reproduced. In the game, this represents how closely the quantum echo matches your original path.

### Decoherence
The loss of quantum properties due to environmental interaction. Higher decoherence causes more perturbations in your quantum echo.

### Coherence Time
How long a quantum system maintains its quantum properties. Affected by temperature and environmental noise.


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `pnpm build`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request


## 🎓 Educational Use

This game is designed for:
- Physics students learning quantum mechanics
- Educators teaching quantum concepts
- Anyone curious about quantum physics
- Game developers interested in educational games

## 🌟 Acknowledgments

- Built with modern web technologies for optimal performance
- Quantum physics concepts simplified for educational purposes
- Interactive visualizations inspired by real quantum experiments

---

**Start your quantum journey today!** 🚀

For questions or support, please open an issue or reach out to [@narenkarthikx](https://github.com/narenkarthikx).
