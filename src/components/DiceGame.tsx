'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    CubeIcon,
    PlayIcon,
    ArrowPathIcon,
    TrophyIcon
} from '@heroicons/react/24/outline'

interface DiceGameProps {
    onBack?: () => void
}

type BetType = 'under' | 'over' | 'exact'

export function DiceGame({ onBack }: DiceGameProps) {
    const { user, updateCoins } = useUser()
    const [betAmount, setBetAmount] = useState(10)
    const [targetNumber, setTargetNumber] = useState(7)
    const [betType, setBetType] = useState<BetType>('under')
    const [isRolling, setIsRolling] = useState(false)
    const [diceValues, setDiceValues] = useState([1, 1])
    const [gameResult, setGameResult] = useState<{
        won: boolean
        winAmount: number
        total: number
    } | null>(null)
    const [showResult, setShowResult] = useState(false)

    // Calculate multiplier based on bet type and target number (with house edge)
    const calculateMultiplier = (type: BetType, target: number): number => {
        const houseEdge = 0.15 // 15% house edge makes it harder to win
        const minMultiplier = 1.01 // Minimum payout multiplier

        switch (type) {
            case 'under':
                // Calculate actual probability of rolling under target
                const underWays = target === 2 ? 0 : target === 3 ? 1 : target === 4 ? 3 :
                    target === 5 ? 6 : target === 6 ? 10 : target === 7 ? 15 :
                        target === 8 ? 21 : target === 9 ? 26 : target === 10 ? 30 :
                            target === 11 ? 33 : target === 12 ? 35 : 0
                const underProb = underWays / 36
                return underProb > 0 ? Math.max(minMultiplier, (1 - houseEdge) / underProb) : 1

            case 'over':
                // Calculate actual probability of rolling over target
                const overWays = target === 2 ? 35 : target === 3 ? 33 : target === 4 ? 30 :
                    target === 5 ? 26 : target === 6 ? 21 : target === 7 ? 15 :
                        target === 8 ? 10 : target === 9 ? 6 : target === 10 ? 3 :
                            target === 11 ? 1 : target === 12 ? 0 : 0
                const overProb = overWays / 36
                return overProb > 0 ? Math.max(minMultiplier, (1 - houseEdge) / overProb) : 1

            case 'exact':
                // Calculate exact probability for each sum
                const exactWays = target === 2 || target === 12 ? 1 :
                    target === 3 || target === 11 ? 2 :
                        target === 4 || target === 10 ? 3 :
                            target === 5 || target === 9 ? 4 :
                                target === 6 || target === 8 ? 5 :
                                    target === 7 ? 6 : 0
                const exactProb = exactWays / 36
                return exactProb > 0 ? Math.max(2, (1 - houseEdge) / exactProb) : 1

            default:
                return 1
        }
    }

    const currentMultiplier = calculateMultiplier(betType, targetNumber)

    // Calculate win probability for display
    const getWinProbability = (type: BetType, target: number): number => {
        switch (type) {
            case 'under':
                const underWays = target === 2 ? 0 : target === 3 ? 1 : target === 4 ? 3 :
                    target === 5 ? 6 : target === 6 ? 10 : target === 7 ? 15 :
                        target === 8 ? 21 : target === 9 ? 26 : target === 10 ? 30 :
                            target === 11 ? 33 : target === 12 ? 35 : 0
                return (underWays / 36) * 100
            case 'over':
                const overWays = target === 2 ? 35 : target === 3 ? 33 : target === 4 ? 30 :
                    target === 5 ? 26 : target === 6 ? 21 : target === 7 ? 15 :
                        target === 8 ? 10 : target === 9 ? 6 : target === 10 ? 3 :
                            target === 11 ? 1 : target === 12 ? 0 : 0
                return (overWays / 36) * 100
            case 'exact':
                const exactWays = target === 2 || target === 12 ? 1 :
                    target === 3 || target === 11 ? 2 :
                        target === 4 || target === 10 ? 3 :
                            target === 5 || target === 9 ? 4 :
                                target === 6 || target === 8 ? 5 :
                                    target === 7 ? 6 : 0
                return (exactWays / 36) * 100
            default:
                return 0
        }
    }

    const winProbability = getWinProbability(betType, targetNumber)

    const rollDice = async () => {
        if (!user || betAmount > user.coins || betAmount < 1 || isRolling) return

        setIsRolling(true)
        setShowResult(false)
        setGameResult(null)

        // Deduct bet amount immediately
        updateCoins(-betAmount)

        // Animate dice rolling
        const rollDuration = 2000 // 2 seconds
        const rollInterval = 100 // Change dice every 100ms

        const rollAnimation = setInterval(() => {
            setDiceValues([
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ])
        }, rollInterval)

        // Stop animation and show final result
        setTimeout(() => {
            clearInterval(rollAnimation)

            // Generate final dice values
            const finalDice = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ]
            setDiceValues(finalDice)

            const total = finalDice[0] + finalDice[1]
            let won = false

            // Check if player won based on bet type
            switch (betType) {
                case 'under':
                    won = total < targetNumber
                    break
                case 'over':
                    won = total > targetNumber
                    break
                case 'exact':
                    won = total === targetNumber
                    break
            }

            const winAmount = won ? betAmount * currentMultiplier : 0

            // Add winnings if won
            if (won && user) {
                updateCoins(winAmount)
            }

            setGameResult({
                won,
                winAmount,
                total
            })

            setIsRolling(false)
            setShowResult(true)
        }, rollDuration)
    }

    const resetGame = () => {
        setShowResult(false)
        setGameResult(null)
    }

    // Dice face component with dots
    const DiceFace = ({ value, isRolling }: { value: number, isRolling: boolean }) => {
        const getDots = (num: number) => {
            const dotPositions: { [key: number]: string[] } = {
                1: ['center'],
                2: ['top-left', 'bottom-right'],
                3: ['top-left', 'center', 'bottom-right'],
                4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
                6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
            }
            return dotPositions[num] || []
        }

        const getDotClass = (position: string) => {
            const positions: { [key: string]: string } = {
                'top-left': 'top-2 left-2',
                'top-right': 'top-2 right-2',
                'middle-left': 'top-1/2 left-2 -translate-y-1/2',
                'middle-right': 'top-1/2 right-2 -translate-y-1/2',
                'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'bottom-left': 'bottom-2 left-2',
                'bottom-right': 'bottom-2 right-2'
            }
            return positions[position] || ''
        }

        return (
            <div className={`
        relative w-20 h-20 bg-white rounded-lg border-2 border-gray-300 shadow-lg
        ${isRolling ? 'dice-rolling' : showResult ? 'dice-stopped dice-glow' : 'hover:shadow-xl'}
        transition-all duration-200
      `}>
                {getDots(value).map((position, index) => (
                    <div
                        key={index}
                        className={`
              absolute w-3 h-3 bg-gray-800 rounded-full
              ${getDotClass(position)}
              ${isRolling ? 'opacity-70' : 'opacity-100'}
              transition-opacity duration-200
            `}
                    />
                ))}
            </div>
        )
    }

    const getBetTypeText = () => {
        switch (betType) {
            case 'under': return `Under ${targetNumber}`
            case 'over': return `Over ${targetNumber}`
            case 'exact': return `Exactly ${targetNumber}`
        }
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <CubeIcon className="h-8 w-8 mr-3 text-yellow-500" />
                    Dice Game
                </h2>
                {onBack && (
                    <Button variant="outline" onClick={onBack}>
                        Back to Games
                    </Button>
                )}
            </div>

            {!user ? (
                <div className="text-center py-12">
                    <CubeIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Login Required</h3>
                    <p className="text-gray-400">Please log in to play the dice game</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Game Area */}
                    <div className="space-y-6">
                        {/* Dice Display */}
                        <div className={`
              bg-gray-700 rounded-xl p-8 text-center
              ${isRolling ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30' : ''}
              transition-all duration-500
            `}>
                            <h3 className="text-lg font-semibold text-white mb-6">
                                {isRolling ? 'Rolling the Dice...' : 'Roll the Dice!'}
                            </h3>
                            <div className="flex justify-center space-x-6 mb-6">
                                <DiceFace value={diceValues[0]} isRolling={isRolling} />
                                <DiceFace value={diceValues[1]} isRolling={isRolling} />
                            </div>

                            {/* Total Display */}
                            <div className="text-center">
                                <div className={`
                  text-4xl font-bold mb-2 transition-all duration-300
                  ${showResult && gameResult?.won ? 'text-green-400' :
                                        showResult && !gameResult?.won ? 'text-red-400' : 'text-yellow-400'}
                `}>
                                    {diceValues[0] + diceValues[1]}
                                </div>
                                <div className="text-gray-400 text-sm">Total</div>
                            </div>

                            {/* Result Display */}
                            {showResult && gameResult && (
                                <div className={`
                  mt-6 p-4 rounded-lg border-2 animate-pulse
                  ${gameResult.won
                                        ? 'bg-green-900/30 border-green-500 shadow-lg shadow-green-500/20'
                                        : 'bg-red-900/30 border-red-500 shadow-lg shadow-red-500/20'
                                    }
                  transition-all duration-500
                `}>
                                    <div className={`text-xl font-bold mb-2 ${gameResult.won ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {gameResult.won ? '🎉 You Won!' : '� You Lost!'}
                                    </div>
                                    <div className="text-gray-300">
                                        Rolled: {gameResult.total} | Bet: {getBetTypeText()}
                                    </div>
                                    {gameResult.won && (
                                        <div className="text-yellow-400 font-semibold text-lg animate-bounce">
                                            Won: {Math.round(gameResult.winAmount)} coins! 🪙
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Roll Button */}
                        <div className="space-y-4">
                            {isRolling && (
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-blue-400 text-sm font-medium">Rolling dice...</span>
                                    </div>
                                </div>
                            )}

                            <Button
                                variant={isRolling ? "secondary" : "casino"}
                                onClick={rollDice}
                                disabled={isRolling || betAmount > user.coins || betAmount < 1}
                                className="w-full text-lg py-4"
                            >
                                {isRolling ? (
                                    <div className="flex items-center">
                                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                        Rolling...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <PlayIcon className="h-5 w-5 mr-2" />
                                        Roll Dice ({betAmount} coins)
                                    </div>
                                )}
                            </Button>

                            {showResult && (
                                <Button
                                    variant="gold"
                                    onClick={resetGame}
                                    className="w-full text-lg py-3"
                                >
                                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                                    New Game
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Betting Controls */}
                    <div className="space-y-6">
                        {/* User Info */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Your Balance</h3>
                            <div className="text-2xl font-bold text-yellow-400">
                                {user.coins.toLocaleString()} coins
                            </div>
                        </div>

                        {/* Bet Amount */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Bet Amount</h3>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {[10, 25, 50, 100, 250, 500].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setBetAmount(amount)}
                                        className={`p-2 rounded text-sm font-medium transition-colors ${betAmount === amount
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                            }`}
                                        disabled={isRolling}
                                    >
                                        {amount}
                                    </button>
                                ))}
                            </div>
                            <Input
                                type="number"
                                min="1"
                                max={user.coins}
                                value={betAmount}
                                onChange={(e) => setBetAmount(Number(e.target.value))}
                                className="bg-gray-800 border-gray-600 text-white"
                                disabled={isRolling}
                                placeholder="Custom amount"
                            />
                        </div>

                        {/* Bet Type */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Bet Type</h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setBetType('under')}
                                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${betType === 'under'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                            }`}
                                        disabled={isRolling}
                                    >
                                        Under
                                    </button>
                                    <button
                                        onClick={() => setBetType('over')}
                                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${betType === 'over'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                            }`}
                                        disabled={isRolling}
                                    >
                                        Over
                                    </button>
                                    <button
                                        onClick={() => setBetType('exact')}
                                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${betType === 'exact'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                            }`}
                                        disabled={isRolling}
                                    >
                                        Exact
                                    </button>
                                </div>

                                {/* Target Number */}
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">
                                        Target Number (2-12)
                                    </label>
                                    <Input
                                        type="number"
                                        min="2"
                                        max="12"
                                        value={targetNumber}
                                        onChange={(e) => setTargetNumber(Math.min(12, Math.max(2, Number(e.target.value))))}
                                        className="bg-gray-800 border-gray-600 text-white"
                                        disabled={isRolling}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bet Summary */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Bet Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Bet:</span>
                                    <span className="text-white">{betAmount} coins</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Type:</span>
                                    <span className="text-white">{getBetTypeText()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Win Chance:</span>
                                    <span className={`font-medium ${winProbability > 70 ? 'text-green-400' :
                                        winProbability > 40 ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                        {winProbability.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Multiplier:</span>
                                    <span className="text-yellow-400">{currentMultiplier.toFixed(2)}x</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t border-gray-600 pt-2">
                                    <span className="text-gray-300">Potential Win:</span>
                                    <span className="text-yellow-400">{Math.round(betAmount * currentMultiplier)} coins</span>
                                </div>
                                {(winProbability > 80 || currentMultiplier <= 1.02) && (
                                    <div className="mt-2 p-2 bg-orange-900/20 border border-orange-500/30 rounded text-xs">
                                        <span className="text-orange-400">
                                            ⚠️ {currentMultiplier <= 1.02 ?
                                                'Minimum payout bet - Very low profit potential' :
                                                'High win chance = Low payout (House advantage)'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Game Rules */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                <TrophyIcon className="h-5 w-5 mr-2" />
                                How to Play
                            </h3>
                            <div className="text-sm text-gray-300 space-y-1">
                                <p>• <strong>Under:</strong> Total must be less than target number</p>
                                <p>• <strong>Over:</strong> Total must be greater than target number</p>
                                <p>• <strong>Exact:</strong> Total must equal target number exactly</p>
                                <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
                                    <p className="text-red-400 text-xs">
                                        ⚠️ <strong>House Edge:</strong> 15% - The house has mathematical advantage
                                    </p>
                                </div>
                                <p className="text-yellow-400 mt-2">💡 High probability bets now have lower payouts!</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Example: Rolling over 2 has 97% chance but only pays 1.01x (minimum)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
