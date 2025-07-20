# DLSpins - Modern Online Casino 🎰

[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)](https://github.com) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)](https://tailwindcss.com/)

A modern, responsive online casino platform built with cutting-edge web technologies. DLSpins offers a complete gambling experience with user authentication, virtual currency system, and multiple exciting games including Bomb Sweeper, Dice, and Slot Machines.

## 🎯 **Free & Open Source for Everyone!**

**DLSpins is completely free and open source!** This project is available for:
- 🎓 **Students & Learners**: Study modern web development patterns
- 👩‍💻 **Developers**: Use as a starter template or reference
- 🏢 **Businesses**: Adapt for your own gaming platforms
- 🎮 **Enthusiasts**: Host your own casino site
- 📚 **Educators**: Teach React, Next.js, and TypeScript concepts

**No licensing fees, no restrictions - just clone, customize, and deploy!**

## 🌟 Features

- **🎮 Multiple Games**: 
  - **Bomb Sweeper**: Strategic grid-based gambling with risk/reward mechanics
  - **🎲 Dice Game**: Classic dice rolling with customizable odds
  - **🎰 Slot Machine**: Multi-payline slots with auto-spin and bonus features
  - **More games coming soon!**
- **👤 Complete User System**: Registration, login, and persistent user sessions
- **🪙 Virtual Currency**: Coin-based economy with 1000 free starting coins
- **� Payment Integration**: Mock payment gateway for coin purchases
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern Casino UI**: Dark theme with gold accents, animations, and visual effects
- **📊 Real-time Statistics**: Game history, win rates, and profit tracking
- **🔒 Type Safety**: Built with TypeScript for robust development
- **⚡ High Performance**: Server-side rendering and optimized bundle sizes
- **🎯 Extensible Architecture**: Easy to add new games and features

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dlspins-casino.git
   cd dlspins-casino
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Start playing!**
   - Register a new account (get 1000 free coins)
   - Or login with existing credentials
   - Try all the games: Bomb Sweeper, Dice, and Slot Machine

### 🎮 Demo Account
For quick testing, you can create any account - the authentication is mock-based for demo purposes.

## 🎯 How to Play

### Getting Started
1. **Register** a new account or **Login** with existing credentials
2. **Receive 1000 free coins** upon registration  
3. Navigate to the **Games** section
4. Choose from **Bomb Sweeper**, **Dice Game**, or **Slot Machine**

### 💣 Bomb Sweeper Rules
- Choose your bet amount (1 to your current balance)
- Select number of bombs (1-24) - more bombs = higher potential rewards
- Click on grid cells to reveal them
- Avoid bombs! Each safe cell increases your multiplier
- Cash out anytime or reveal all safe cells for maximum payout
- Hit a bomb = lose your bet

### 🎲 Dice Game Rules  
- Set your bet amount
- Choose target number (2-12)
- Select "Over" or "Under" the target
- Roll the dice and win based on your prediction
- Higher risk predictions = higher payouts

### 🎰 Slot Machine Rules
- Configure bet per line, paylines (1-25), and bet level (1-10x)
- Spin manually or use auto-spin (10-500 spins)
- Match symbols on active paylines to win
- 3 matching symbols = full payout, 2 matching = 30% payout
- Special symbols offer higher multipliers and rewards

## 🛠 Tech Stack

- **Framework**: [Next.js 15.4.2](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for rapid UI development
- **Icons**: [Heroicons React](https://heroicons.com/) for consistent iconography
- **State Management**: React Context API for global state
- **Storage**: LocalStorage for demo persistence (easily replaceable with databases)
- **Development**: ESLint, Prettier, VS Code integration
- **Build Tool**: Turbopack for fast development builds

## 📁 Project Structure

```
dlspins-casino/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Homepage with games showcase  
│   │   └── globals.css     # Global styles and casino theme
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Button.tsx  # Button with casino variants
│   │   │   └── Input.tsx   # Form input component
│   │   ├── AuthModal.tsx   # Authentication modal
│   │   ├── BombSweeper.tsx # Strategic grid gambling game
│   │   ├── DiceGame.tsx    # Classic dice gambling game
│   │   ├── SlotMachine.tsx # Multi-payline slot machine
│   │   ├── Navbar.tsx      # Navigation with user info
│   │   └── PaymentModal.tsx # Coin purchase interface
│   ├── contexts/
│   │   └── UserContext.tsx # User authentication & coin management
│   └── lib/
│       └── utils.ts        # Utility functions (cn, etc.)
├── .vscode/               # VS Code configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🎮 Available Scripts

- `npm run dev` - Start development server with hot reload at [http://localhost:3000](http://localhost:3000)
- `npm run build` - Build optimized production bundle
- `npm start` - Start production server 
- `npm run lint` - Run ESLint code analysis and fix issues
- `npm run type-check` - Run TypeScript compiler checks

## 🔧 Development Guide

### VS Code Integration
The project includes comprehensive VS Code configuration:

- **Tasks**: Pre-configured build/dev/start tasks (Ctrl+Shift+P → "Tasks: Run Task")
- **Debugging**: Launch configurations for client/server debugging
- **Extensions**: Recommended extensions for optimal Next.js development
- **Settings**: Workspace settings for consistent formatting

### Adding New Games
1. **Create game component** in `/src/components/NewGame.tsx`
2. **Follow existing patterns**: Use BombSweeper/DiceGame as reference
3. **Integrate with user system**: Use the `useUser` hook for coin transactions
4. **Add to homepage**: Update the games grid in `/src/app/page.tsx`
5. **Test thoroughly**: Ensure coin calculations are accurate

### Customizing the Design
1. **Colors**: Modify the casino color palette in `/src/app/globals.css`
2. **Components**: Update UI components in `/src/components/ui/`
3. **Animations**: Add custom animations using Tailwind CSS
4. **Layout**: Modify responsive breakpoints and grid layouts

## 🎨 Design System

### Color Palette
- **Primary**: Gold (#F59E0B) for buttons and accents
- **Background**: Dark grays (#111827, #1F2937) for casino ambiance  
- **Success**: Green (#10B981) for wins and positive actions
- **Danger**: Red (#EF4444) for losses and bombs
- **Text**: Light grays (#F3F4F6) for readability

### Components
- Custom Button component with casino-specific variants
- Responsive navigation with mobile hamburger menu
- Modal systems for authentication
- Grid-based game layouts

## 🚀 Deployment Options

### Vercel (Recommended)
1. Fork this repository to your GitHub account
2. Connect your GitHub account to [Vercel](https://vercel.com/)
3. Import the project and deploy automatically
4. Your site will be live with a custom URL

### Netlify
1. Build the project: `npm run build`
2. Upload the `out/` folder to [Netlify](https://www.netlify.com/)
3. Configure custom domain if desired

### Docker Deployment
```bash
# Build Docker image
docker build -t dlspins-casino .

# Run container
docker run -p 3000:3000 dlspins-casino
```

### Self-Hosted
```bash
# Build for production
npm run build
npm start

# Your site will be available at http://localhost:3000
```

## 🔮 Future Roadmap

### � More Games
- **♠️ Blackjack**: Classic card game with dealer AI
- **🃏 Poker**: Texas Hold'em with multiplayer support  
- **🎯 Roulette**: European and American variants
- **🎪 Baccarat**: High-stakes card game
- **🎳 Keno**: Number selection lottery-style game

### 🚀 Platform Features
- **🏆 Tournaments**: Competitive gaming events with leaderboards
- **💬 Live Chat**: Real-time player communication
- **👥 Social Features**: Friend lists, achievements, and sharing
- **� Advanced Analytics**: Detailed player statistics and game history
- **🎁 Bonus System**: Daily rewards, loyalty points, and special offers

### 🔐 Production Enhancements  
- **� Real Authentication**: JWT-based secure login with password hashing
- **💰 Cryptocurrency**: Bitcoin, Ethereum, and altcoin integration
- **� Fiat Payments**: Credit card and bank transfer processing
- **🛡️ Security**: Rate limiting, fraud detection, and secure transactions
- **🎯 Provably Fair**: Cryptographic verification of game fairness
- **📱 Mobile App**: Native iOS and Android applications

### 🏗️ Technical Improvements
- **🗄️ Database**: PostgreSQL/MongoDB integration
- **⚡ Real-time**: WebSocket support for live updates
- **📈 Monitoring**: Error tracking and performance analytics
- **🌍 Internationalization**: Multi-language support
- **♿ Accessibility**: WCAG compliance and screen reader support

## ⚖️ Responsible Gaming

This is a demo application for educational purposes. Real gambling can be addictive and should be approached responsibly. Always:

- Set limits on time and money spent
- Never gamble more than you can afford to lose
- Take regular breaks
- Seek help if gambling becomes a problem

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help:

### � Bug Reports
- Search existing issues first
- Provide clear reproduction steps
- Include screenshots if applicable  
- Specify browser and device information

### ✨ Feature Requests
- Check the roadmap to avoid duplicates
- Explain the use case and benefits
- Consider implementation complexity
- Provide mockups or examples if possible

### 💻 Code Contributions
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request with detailed description

### 📋 Development Guidelines
- Follow existing code style and patterns
- Write TypeScript with proper types
- Test your changes thoroughly  
- Update documentation when needed
- Keep commits focused and atomic

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Change and customize as needed  
- ✅ **Distribution** - Share with others freely
- ✅ **Private use** - Use for personal projects
- ❌ **Liability** - No warranty or liability from authors
- ❌ **Trademark use** - Don't use our trademarks

## 🙋‍♂️ Support & Community

- **📧 Email**: [your-email@domain.com](mailto:your-email@domain.com)
- **💬 Discussions**: GitHub Discussions for questions and ideas
- **🐛 Issues**: GitHub Issues for bugs and feature requests
- **📱 Discord**: [Join our community](https://discord.gg/yourinvite) (coming soon)
- **🐦 Twitter**: [@dlspins](https://twitter.com/dlspins) for updates

## 🎯 Goals & Philosophy

DLSpins was created to demonstrate:
- **Modern web development** practices and patterns
- **Responsible gambling** education through simulation
- **Open source collaboration** in the gaming industry  
- **Accessible technology** that anyone can learn from

We believe in making technology education free and accessible to everyone!

## ⚖️ Responsible Gaming Notice

**This is an educational demo application.** Real gambling can be addictive and should be approached responsibly.

### 🛡️ Gambling Safety Guidelines:
- **Set limits** on time and money spent
- **Never gamble** more than you can afford to lose  
- **Take regular breaks** from gaming activities
- **Seek help** if gambling becomes problematic
- **Remember**: The house always has an edge in real gambling

### 📞 Problem Gambling Resources:
- **National Problem Gambling Helpline**: 1-800-522-4700
- **Gamblers Anonymous**: [www.gamblersanonymous.org](https://www.gamblersanonymous.org)
- **National Council on Problem Gambling**: [ncpgambling.org](https://www.ncpgambling.org)

---

<div align="center">

**Built with ❤️ using modern web technologies**

**⭐ Star this repo if you found it helpful!**

**🚀 Deploy your own casino today - it's completely free!**

**Happy coding! 🎰✨**

</div>
