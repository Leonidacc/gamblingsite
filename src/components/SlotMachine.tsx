'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    PlayIcon,
    PauseIcon,
    FireIcon,
    StarIcon,
    BoltIcon,
    TrophyIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline'

// Slot symbols with their values and rarities
const SYMBOLS = {
    '🍒': { name: 'Cherry', value: 2, rarity: 25, color: 'text-red-500' },
    '🍋': { name: 'Lemon', value: 3, rarity: 20, color: 'text-yellow-500' },
    '🍊': { name: 'Orange', value: 4, rarity: 18, color: 'text-orange-500' },
    '🍇': { name: 'Grape', value: 5, rarity: 15, color: 'text-purple-500' },
    '🔔': { name: 'Bell', value: 8, rarity: 10, color: 'text-yellow-400' },
    '⭐': { name: 'Star', value: 12, rarity: 7, color: 'text-blue-400' },
    '💎': { name: 'Diamond', value: 20, rarity: 4, color: 'text-cyan-400' },
    '🎰': { name: 'Jackpot', value: 100, rarity: 1, color: 'text-yellow-300' }
}

// Payline configurations - [row positions for reel 1, reel 2, reel 3]
const PAYLINES = {
    1: [[1, 1, 1]], // Middle row only
    3: [
        [0, 0, 0], // Top row
        [1, 1, 1], // Middle row
        [2, 2, 2]  // Bottom row
    ],
    5: [
        [0, 0, 0], // Top row
        [1, 1, 1], // Middle row
        [2, 2, 2], // Bottom row
        [0, 1, 2], // Diagonal down
        [2, 1, 0]  // Diagonal up
    ],
    9: [
        [0, 0, 0], [1, 1, 1], [2, 2, 2], // Straight lines
        [0, 1, 2], [2, 1, 0], // Diagonals
        [1, 0, 1], [1, 2, 1], // V shapes
        [0, 1, 0], [2, 1, 2]  // Inverted V shapes
    ],
    15: [
        [0, 0, 0], [1, 1, 1], [2, 2, 2], // Straight lines
        [0, 1, 2], [2, 1, 0], // Diagonals
        [1, 0, 1], [1, 2, 1], // V shapes
        [0, 1, 0], [2, 1, 2], // Inverted V shapes
        [0, 0, 1], [0, 0, 2], [1, 1, 0], [1, 1, 2], // More complex patterns
        [2, 2, 0], [2, 2, 1], [0, 2, 0] // Additional patterns
    ],
    25: [
        [0, 0, 0], [1, 1, 1], [2, 2, 2], // Straight lines
        [0, 1, 2], [2, 1, 0], // Diagonals
        [1, 0, 1], [1, 2, 1], // V shapes
        [0, 1, 0], [2, 1, 2], // Inverted V shapes
        [0, 0, 1], [0, 0, 2], [1, 1, 0], [1, 1, 2], // More patterns
        [2, 2, 0], [2, 2, 1], [0, 2, 0], [0, 2, 1], // Additional patterns
        [1, 0, 0], [1, 0, 2], [1, 2, 0], [1, 2, 2], // Extra patterns
        [0, 1, 1], [2, 1, 1], [0, 2, 2], [2, 0, 0], // Final patterns
        [2, 0, 1] // 25th pattern
    ]
}

interface SlotMachineProps {
    onBack?: () => void
}

interface WinResult {
    amount: number
    winningLines: number[][]
    multiplier: number
}

interface SpinRecord {
    bet: number
    win: number
    multiplier: number
    timestamp: number
}

export function SlotMachine({ onBack }: SlotMachineProps) {
    const { user, updateCoins } = useUser()

    // Game state
    const [reels, setReels] = useState<string[][]>([
        ['🍒', '🍋', '🍊'],
        ['🍋', '🍊', '🍇'],
        ['🍊', '🍇', '🔔']
    ])
    const [spinning, setSpinning] = useState(false)

    // Betting options
    const [betAmount, setBetAmount] = useState(1)
    const [selectedPaylines, setSelectedPaylines] = useState(1)
    const [totalBet, setTotalBet] = useState(1)
    const [betLevel, setBetLevel] = useState(1) // 1-10 bet level multiplier

    // Auto-spin
    const [autoSpin, setAutoSpin] = useState(false)
    const [autoSpinCount, setAutoSpinCount] = useState(10)
    const [currentAutoSpins, setCurrentAutoSpins] = useState(0)

    // Game results
    const [lastWin, setLastWin] = useState<WinResult | null>(null)
    const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
    const [totalProfit, setTotalProfit] = useState(0)

    // UI state
    const [showPaytable, setShowPaytable] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [celebrateWin, setCelebrateWin] = useState(false)

    // Quick bet amounts
    const quickBets = [1, 5, 10, 25, 50, 100]
    const quickPaylines = [1, 3, 5, 9, 15, 25]

    // Calculate total bet (bet per line × number of paylines × bet level)
    useEffect(() => {
        setTotalBet(betAmount * selectedPaylines * betLevel)
    }, [betAmount, selectedPaylines, betLevel])

    // Update total profit when spin history changes
    useEffect(() => {
        const profit = spinHistory.reduce((sum, spin) => sum + spin.win - spin.bet, 0)
        setTotalProfit(profit)
    }, [spinHistory])

    // Generate weighted random symbol
    const getRandomSymbol = (): string => {
        const symbols = Object.keys(SYMBOLS)
        const weights = symbols.map(symbol => SYMBOLS[symbol as keyof typeof SYMBOLS].rarity)
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

        let random = Math.random() * totalWeight
        for (let i = 0; i < symbols.length; i++) {
            if (random < weights[i]) {
                return symbols[i]
            }
            random -= weights[i]
        }
        return symbols[0]
    }

    // Check for winning combinations
    const checkWins = (newReels: string[][]): WinResult => {
        const wins: WinResult = {
            amount: 0,
            winningLines: [],
            multiplier: 0
        }

        const paylines = PAYLINES[selectedPaylines as keyof typeof PAYLINES]

        paylines.forEach(payline => {
            const symbols = payline.map((rowIndex, reelIndex) => newReels[reelIndex][rowIndex])

            // Check for three of a kind (full match)
            if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
                const symbol = symbols[0] as keyof typeof SYMBOLS
                const symbolValue = SYMBOLS[symbol].value
                const lineWin = betAmount * symbolValue * betLevel
                wins.amount += lineWin
                wins.winningLines.push(payline)
                wins.multiplier = Math.max(wins.multiplier, symbolValue)
            }
            // Check for two matching symbols (partial match)
            else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
                const matchingSymbol = symbols.find((s) =>
                    symbols.filter(sym => sym === s).length >= 2
                ) as keyof typeof SYMBOLS

                if (matchingSymbol && SYMBOLS[matchingSymbol]) {
                    const symbolValue = SYMBOLS[matchingSymbol].value
                    const lineWin = Math.floor(betAmount * symbolValue * betLevel * 0.3) // 30% payout for pairs
                    if (lineWin > 0) {
                        wins.amount += lineWin
                        wins.winningLines.push(payline)
                        wins.multiplier = Math.max(wins.multiplier, Math.floor(symbolValue * 0.3))
                    }
                }
            }
        })

        return wins
    }

    // Spin the reels
    const spin = async () => {
        if (!user || spinning || totalBet > user.coins) {
            if (user && totalBet > user.coins) {
                alert('Insufficient coins!')
            }
            return
        }

        // Deduct bet
        updateCoins(-totalBet)
        setSpinning(true)
        setLastWin(null)
        setCelebrateWin(false)

        // Spin animation
        const spinDuration = 2000 + Math.random() * 1000
        const spinInterval = setInterval(() => {
            setReels(prev => prev.map(reel =>
                reel.map(() => getRandomSymbol())
            ))
        }, 100)

        setTimeout(() => {
            clearInterval(spinInterval)

            // Generate final result
            const finalReels = Array(3).fill(null).map(() =>
                Array(3).fill(null).map(() => getRandomSymbol())
            )
            setReels(finalReels)

            // Check for wins
            const wins = checkWins(finalReels)
            if (wins.amount > 0) {
                updateCoins(wins.amount)
                setLastWin(wins)

                // Celebrate big wins
                if (wins.multiplier >= 10) {
                    setCelebrateWin(true)
                    setTimeout(() => setCelebrateWin(false), 3000)
                }
            }

            // Add to history
            setSpinHistory(prev => [...prev.slice(-49), {
                bet: totalBet,
                win: wins.amount,
                multiplier: wins.multiplier,
                timestamp: Date.now()
            }])

            setSpinning(false)
        }, spinDuration)
    }

    // Manual spin handler
    const handleManualSpin = () => {
        if (!autoSpin) {
            spin()
        }
    }

    // Auto spin functions
    const startAutoSpin = () => {
        if (!user || totalBet > user.coins || spinning) return
        setAutoSpin(true)
        setCurrentAutoSpins(0)
        performAutoSpin()
    }

    const stopAutoSpin = () => {
        setAutoSpin(false)
        setCurrentAutoSpins(0)
    }

    const performAutoSpin = async () => {
        if (!autoSpin || currentAutoSpins >= autoSpinCount) {
            setAutoSpin(false)
            setCurrentAutoSpins(0)
            return
        }

        if (!user || totalBet > user.coins || spinning) {
            setAutoSpin(false)
            setCurrentAutoSpins(0)
            return
        }

        // Perform the spin
        await spin()

        // Increment counter and continue if still in auto-spin mode
        setCurrentAutoSpins(prev => {
            const newCount = prev + 1
            if (autoSpin && newCount < autoSpinCount) {
                // Continue auto-spin after delay
                setTimeout(() => {
                    if (autoSpin) {
                        performAutoSpin()
                    }
                }, 1500)
            } else {
                // Auto-spin sequence completed
                setAutoSpin(false)
                setCurrentAutoSpins(0)
            }
            return newCount
        })
    }

    // Max bet function
    const maxBet = () => {
        if (!user) return
        const maxPossible = Math.floor(user.coins / selectedPaylines)
        setBetAmount(Math.min(maxPossible, 100))
        setBetLevel(10)
    }

    // Statistics calculations
    const totalSpins = spinHistory.length
    const totalBetAmount = spinHistory.reduce((sum, spin) => sum + spin.bet, 0)
    const totalWinAmount = spinHistory.reduce((sum, spin) => sum + spin.win, 0)
    const winRate = totalSpins > 0 ? (spinHistory.filter(spin => spin.win > 0).length / totalSpins * 100) : 0
    const bigWins = spinHistory.filter(spin => spin.multiplier >= 10).length
    const bestWin = spinHistory.length > 0 ? Math.max(...spinHistory.map(spin => spin.win)) : 0

    return (
        <div className={`max-w-7xl mx-auto p-6 space-y-6 ${celebrateWin ? 'jackpot-animation' : ''}`}>
            {celebrateWin && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <div className="text-6xl font-bold text-yellow-400 animate-bounce">
                        🎉 BIG WIN! 🎉
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Game Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Game Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                            🎰 Premium Slots
                        </h1>
                        <p className="text-gray-300">Multiple paylines • Auto-spin • Big jackpots</p>
                        {lastWin && (
                            <div className="bg-green-900/50 border border-green-500/50 rounded-lg p-3">
                                <div className="text-green-400 font-bold">
                                    🎊 Win: +{lastWin.amount} coins ({lastWin.multiplier}x multiplier)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Slot Reels */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-yellow-500/30">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {reels.map((reel, reelIndex) => (
                                <div key={reelIndex} className="space-y-2">
                                    {reel.map((symbol, symbolIndex) => {
                                        const isWinning = lastWin?.winningLines.some(line =>
                                            line[reelIndex] === symbolIndex
                                        )
                                        return (
                                            <div
                                                key={`${reelIndex}-${symbolIndex}`}
                                                className={`
                                                    h-20 flex items-center justify-center text-4xl font-bold
                                                    bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600
                                                    rounded-xl transition-all duration-300
                                                    ${spinning ? 'slot-spinning reel-blur' : ''}
                                                    ${isWinning ? 'slot-win-highlight border-yellow-400 bg-yellow-500/20' : ''}
                                                `}
                                            >
                                                {symbol}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Paylines Indicator */}
                        <div className="text-center mb-4">
                            <span className="text-yellow-400 font-semibold">
                                Active Paylines: {selectedPaylines} | Bet Level: {betLevel}x
                            </span>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="bg-gray-800/50 rounded-xl p-6 space-y-6">
                        {/* Basic Controls */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Bet Per Line
                                </label>
                                <Input
                                    type="number"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                    min="1"
                                    max="100"
                                    className="text-center"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Bet Level
                                </label>
                                <Input
                                    type="number"
                                    value={betLevel}
                                    onChange={(e) => setBetLevel(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                                    min="1"
                                    max="10"
                                    className="text-center"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Paylines
                                </label>
                                <select
                                    value={selectedPaylines}
                                    onChange={(e) => setSelectedPaylines(parseInt(e.target.value))}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                >
                                    <option value={1}>1 Line</option>
                                    <option value={3}>3 Lines</option>
                                    <option value={5}>5 Lines</option>
                                    <option value={9}>9 Lines</option>
                                    <option value={15}>15 Lines</option>
                                    <option value={25}>25 Lines</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Total Bet
                                </label>
                                <div className="p-2 bg-gray-700 rounded-lg text-center font-bold text-yellow-400">
                                    {totalBet}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Coins
                                </label>
                                <div className="p-2 bg-gray-700 rounded-lg text-center font-bold text-green-400">
                                    {user?.coins || 0}
                                </div>
                            </div>
                        </div>

                        {/* Quick Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Quick Bets
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {quickBets.map(amount => (
                                        <Button
                                            key={amount}
                                            onClick={() => setBetAmount(amount)}
                                            variant={betAmount === amount ? "gold" : "secondary"}
                                            size="sm"
                                        >
                                            {amount}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Quick Paylines
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {quickPaylines.map(lines => (
                                        <Button
                                            key={lines}
                                            onClick={() => setSelectedPaylines(lines)}
                                            variant={selectedPaylines === lines ? "gold" : "secondary"}
                                            size="sm"
                                        >
                                            {lines}L
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Quick Actions
                                </label>
                                <div className="space-y-2">
                                    <Button
                                        onClick={maxBet}
                                        variant="secondary"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Max Bet
                                    </Button>
                                    <Button
                                        onClick={() => { setBetAmount(1); setBetLevel(1); setSelectedPaylines(1) }}
                                        variant="secondary"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Min Bet
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Spin Controls */}
                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={handleManualSpin}
                                disabled={spinning || !user || totalBet > user.coins}
                                variant="casino"
                                size="lg"
                                className="flex-1 min-w-[120px]"
                            >
                                {spinning ? (
                                    <>
                                        <div className="animate-spin mr-2">🎰</div>
                                        Spinning...
                                    </>
                                ) : (
                                    <>
                                        <PlayIcon className="h-5 w-5 mr-2" />
                                        SPIN
                                    </>
                                )}
                            </Button>

                            {!autoSpin ? (
                                <Button
                                    onClick={startAutoSpin}
                                    disabled={spinning || !user || totalBet > user.coins}
                                    variant="gold"
                                    size="lg"
                                >
                                    <BoltIcon className="h-5 w-5 mr-2" />
                                    Auto ({autoSpinCount})
                                </Button>
                            ) : (
                                <Button
                                    onClick={stopAutoSpin}
                                    variant="secondary"
                                    size="lg"
                                >
                                    <PauseIcon className="h-5 w-5 mr-2" />
                                    Stop ({autoSpinCount - currentAutoSpins})
                                </Button>
                            )}

                            <Button
                                onClick={() => setShowPaytable(!showPaytable)}
                                variant="outline"
                                size="lg"
                            >
                                <TrophyIcon className="h-5 w-5 mr-2" />
                                Paytable
                            </Button>

                            <Button
                                onClick={() => setShowStats(!showStats)}
                                variant="outline"
                                size="lg"
                            >
                                <ChartBarIcon className="h-5 w-5 mr-2" />
                                Stats
                            </Button>
                        </div>

                        {/* Auto Spin Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Auto Spins Count
                                </label>
                                <select
                                    value={autoSpinCount}
                                    onChange={(e) => setAutoSpinCount(parseInt(e.target.value))}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                >
                                    <option value={10}>10 Spins</option>
                                    <option value={25}>25 Spins</option>
                                    <option value={50}>50 Spins</option>
                                    <option value={100}>100 Spins</option>
                                    <option value={500}>500 Spins</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Session
                                </label>
                                <div className={`p-2 rounded-lg text-center font-bold ${totalProfit >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                    }`}>
                                    {totalProfit >= 0 ? '+' : ''}{totalProfit} coins
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paytable */}
                    {showPaytable && (
                        <div className="bg-gray-800/50 rounded-xl p-6">
                            <h3 className="text-2xl font-bold mb-4 text-center text-yellow-400">
                                💰 Paytable
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(SYMBOLS).map(([symbol, info]) => (
                                    <div key={symbol} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl">{symbol}</span>
                                            <div>
                                                <div className="font-medium">{info.name}</div>
                                                <div className="text-xs text-gray-400">{info.rarity}% chance</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-yellow-400 font-bold">{info.value}x</div>
                                            <div className="text-xs text-gray-400">per line</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-900/30 rounded-lg">
                                    <h4 className="font-bold text-blue-400 mb-2">Win Rules:</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• 3 matching symbols = Full payout</li>
                                        <li>• 2 matching symbols = 30% payout</li>
                                        <li>• Wins multiplied by bet level</li>
                                        <li>• Multiple paylines can win</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-purple-900/30 rounded-lg">
                                    <h4 className="font-bold text-purple-400 mb-2">Special Features:</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Up to 25 paylines</li>
                                        <li>• 10x bet level multiplier</li>
                                        <li>• Auto-spin up to 500 spins</li>
                                        <li>• Real-time statistics</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Recent Spins */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
                            Recent Spins
                        </h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {spinHistory.length === 0 ? (
                                <p className="text-gray-400 text-sm">No spins yet</p>
                            ) : (
                                spinHistory.slice().reverse().slice(0, 10).map((spin) => (
                                    <div
                                        key={spin.timestamp}
                                        className={`p-2 rounded-lg text-sm ${spin.win > 0
                                            ? spin.multiplier >= 10
                                                ? 'bg-yellow-900/30 border border-yellow-500/30'
                                                : 'bg-green-900/30 border border-green-500/30'
                                            : 'bg-gray-700/30'
                                            }`}
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Bet: {spin.bet}</span>
                                            <span className={
                                                spin.win > 0
                                                    ? spin.multiplier >= 10
                                                        ? 'text-yellow-400 font-bold'
                                                        : 'text-green-400'
                                                    : 'text-gray-400'
                                            }>
                                                {spin.win > 0 ? `+${spin.win}` : '0'}
                                            </span>
                                        </div>
                                        {spin.multiplier > 0 && (
                                            <div className="text-yellow-400 text-xs">
                                                {spin.multiplier}x multiplier
                                                {spin.multiplier >= 10 && ' 🎉'}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Statistics */}
                    {showStats && (
                        <div className="bg-gray-800/50 rounded-xl p-4">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <ChartBarIcon className="h-5 w-5 mr-2 text-purple-500" />
                                Session Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Total Spins:</span>
                                    <span className="font-bold">{totalSpins}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Total Bet:</span>
                                    <span className="font-bold text-red-400">{totalBetAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Total Won:</span>
                                    <span className="font-bold text-green-400">{totalWinAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Net Profit:</span>
                                    <span className={`font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {totalProfit >= 0 ? '+' : ''}{totalProfit}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Win Rate:</span>
                                    <span className="font-bold text-yellow-400">{winRate.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Big Wins:</span>
                                    <span className="font-bold text-purple-400">{bigWins}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Best Win:</span>
                                    <span className="font-bold text-yellow-400">{bestWin}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">RTP:</span>
                                    <span className="font-bold text-blue-400">
                                        {totalBetAmount > 0 ? ((totalWinAmount / totalBetAmount) * 100).toFixed(1) : '0.0'}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Game Info */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                            Game Info
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p><span className="text-yellow-400">RTP:</span> 94-96%</p>
                            <p><span className="text-yellow-400">Max Win:</span> 10,000x</p>
                            <p><span className="text-yellow-400">Volatility:</span> High</p>
                            <p><span className="text-yellow-400">Min Bet:</span> 1 coin</p>
                            <p><span className="text-yellow-400">Max Bet:</span> 25,000 coins</p>
                            <p><span className="text-yellow-400">Paylines:</span> 1-25</p>
                            <p><span className="text-yellow-400">Bet Levels:</span> 1-10x</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            {onBack && (
                <div className="text-center">
                    <Button onClick={onBack} variant="secondary" size="lg">
                        ← Back to Games
                    </Button>
                </div>
            )}
        </div>
    )
}