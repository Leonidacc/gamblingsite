# DLSpins - Gambling Website

## Project Overview
DLSpins is a modern online casino built with Next.js, TypeScript, and Tailwind CSS. It features user authentication, a coin-based currency system, and gambling games starting with Bomb Sweeper.

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.4.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Heroicons
- **State Management**: React Context API
- **Authentication**: Local storage (mock implementation for demo)

### File Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with UserProvider
│   ├── page.tsx            # Main homepage
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx      # Button with casino variants
│   │   └── Input.tsx       # Form input component
│   ├── AuthModal.tsx       # Login/Register modal
│   ├── BombSweeper.tsx     # Main game component
│   └── Navbar.tsx          # Navigation with user info
├── contexts/
│   └── UserContext.tsx     # User authentication and coin management
└── lib/
    └── utils.ts            # Utility functions (cn for class merging)
```

### Key Features
1. **User System**: Registration, login, coin balance management
2. **Bomb Sweeper Game**: Grid-based gambling game with adjustable risk
3. **Responsive Design**: Mobile-first approach with modern casino aesthetics
4. **Real-time Updates**: Instant balance updates and game state management

## Development Guidelines

### Component Standards
- Use TypeScript for all components
- Implement proper error handling and loading states
- Follow the existing design system (gray/yellow/red color scheme)
- Use Heroicons for consistent iconography
- Implement responsive design patterns

### Game Development
When adding new games:
1. Create a new component in `/components/`
2. Follow the Bomb Sweeper pattern for bet management
3. Use the `useUser` hook for coin transactions
4. Implement proper win/loss calculations
5. Add the game to the main games section

### Styling Conventions
- Use Tailwind utility classes
- Leverage the custom Button variants: `gold`, `casino`, `secondary`
- Follow the casino color palette: gold (#f59e0b), red (#dc2626), gray scales
- Use backdrop-blur effects for modern glass morphism
- Implement hover animations and transitions

### State Management
- User authentication and coins managed via UserContext
- Local storage for persistence (would be replaced with API in production)
- Game state managed locally within game components
- No external state management libraries needed for current scope

## Future Enhancements
- Add more gambling games (Dice, Slots, etc.)
- Implement real backend authentication
- Add cryptocurrency payment integration
- Create tournament and leaderboard systems
- Add live chat functionality
- Implement provably fair algorithms
