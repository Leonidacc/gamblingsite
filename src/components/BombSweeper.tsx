'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  BanknotesIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface Cell {
  id: number
  isBomb: boolean
  isRevealed: boolean
  multiplier: number
}

export function BombSweeper() {
  const { user, updateCoins } = useUser()
  const [betAmount, setBetAmount] = useState(10)
  const [bombCount, setBombCount] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [cells, setCells] = useState<Cell[]>([])
  const [revealedSafeCells, setRevealedSafeCells] = useState(0)
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [winnings, setWinnings] = useState(0)

  const gridSize = 25 // 5x5 grid

  const generateGrid = () => {
    const newCells: Cell[] = []
    const bombPositions = new Set<number>()

    // Generate random bomb positions
    while (bombPositions.size < bombCount) {
      const pos = Math.floor(Math.random() * gridSize)
      bombPositions.add(pos)
    }

    // Create cells
    for (let i = 0; i < gridSize; i++) {
      newCells.push({
        id: i,
        isBomb: bombPositions.has(i),
        isRevealed: false,
        multiplier: calculateMultiplier(i, bombCount, gridSize)
      })
    }

    setCells(newCells)
  }

  const calculateMultiplier = (cellIndex: number, bombs: number, total: number) => {
    const safeCells = total - bombs
    return 1 + (bombs / safeCells) * 0.3
  }

  const startGame = () => {
    if (!user || betAmount > user.coins || betAmount < 1) return

    // Deduct bet amount
    updateCoins(-betAmount)

    setGameStarted(true)
    setGameOver(false)
    setWon(false)
    setRevealedSafeCells(0)
    setCurrentMultiplier(1)
    setWinnings(0)
    generateGrid()
  }

  const revealCell = (cellId: number) => {
    if (!gameStarted || gameOver) return

    const newCells = cells.map(cell => {
      if (cell.id === cellId && !cell.isRevealed) {
        return { ...cell, isRevealed: true }
      }
      return cell
    })

    setCells(newCells)

    const clickedCell = cells.find(c => c.id === cellId)
    if (!clickedCell) return

    if (clickedCell.isBomb) {
      // Hit a bomb - game over
      setGameOver(true)
      setWon(false)
      // Reveal all bombs
      setCells(prev => prev.map(cell =>
        cell.isBomb ? { ...cell, isRevealed: true } : cell
      ))
    } else {
      // Safe cell
      const newRevealedCount = revealedSafeCells + 1
      setRevealedSafeCells(newRevealedCount)

      // Calculate new multiplier
      const safeCells = gridSize - bombCount
      const multiplier = 1 + (newRevealedCount / safeCells) * 1.5
      setCurrentMultiplier(multiplier)
      setWinnings(betAmount * multiplier)

      // Check if all safe cells are revealed
      if (newRevealedCount === safeCells) {
        setGameOver(true)
        setWon(true)
      }
    }
  }

  const cashOut = () => {
    if (!gameStarted || gameOver) return

    setGameOver(true)
    setWon(true)
    if (user) {
      updateCoins(winnings)
    }
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setWon(false)
    setCells([])
    setRevealedSafeCells(0)
    setCurrentMultiplier(1)
    setWinnings(0)
  }

  useEffect(() => {
    if (gameOver && won && user) {
      updateCoins(winnings)
    }
  }, [gameOver, won, user, updateCoins, winnings])

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 mr-2 text-red-500" />
          Bomb Sweeper
        </h2>
        {user && (
          <div className="text-right">
            <div className="text-sm text-gray-400">Your Balance</div>
            <div className="text-xl font-semibold text-yellow-400 flex items-center">
              <BanknotesIcon className="h-5 w-5 mr-1" />
              {user.coins.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {!user ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg mb-4">Please login to play Bomb Sweeper</p>
        </div>
      ) : !gameStarted ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bet Amount
              </label>
              <Input
                type="number"
                min="1"
                max={user.coins}
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Available: {user.coins.toLocaleString()} coins
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bombs (1-24)
              </label>
              <Input
                type="number"
                min="1"
                max="24"
                value={bombCount}
                onChange={(e) => setBombCount(Math.min(24, Math.max(1, parseInt(e.target.value) || 3)))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="bg-gray-700 rounded p-4">
            <h3 className="text-lg font-semibold text-white mb-2">How to Play:</h3>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Click on cells to reveal them</li>
              <li>• Avoid the bombs!</li>
              <li>• Each safe cell increases your multiplier</li>
              <li>• Cash out anytime or reveal all safe cells to win</li>
              <li>• More bombs = higher potential winnings but riskier</li>
            </ul>
          </div>

          <Button
            onClick={startGame}
            disabled={betAmount > user.coins || betAmount < 1}
            variant="casino"
            size="lg"
            className="w-full"
          >
            Start Game ({betAmount} coins)
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700 rounded p-3">
              <div className="text-gray-400 text-sm">Bet Amount</div>
              <div className="text-white font-semibold">{betAmount}</div>
            </div>
            <div className="bg-gray-700 rounded p-3">
              <div className="text-gray-400 text-sm">Bombs</div>
              <div className="text-red-400 font-semibold">{bombCount}</div>
            </div>
            <div className="bg-gray-700 rounded p-3">
              <div className="text-gray-400 text-sm">Multiplier</div>
              <div className="text-green-400 font-semibold">{currentMultiplier.toFixed(2)}x</div>
            </div>
            <div className="bg-gray-700 rounded p-3">
              <div className="text-gray-400 text-sm">Potential Win</div>
              <div className="text-yellow-400 font-semibold">{Math.floor(winnings)}</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
            {cells.map((cell) => (
              <button
                key={cell.id}
                onClick={() => revealCell(cell.id)}
                disabled={gameOver || cell.isRevealed}
                className={`
                  aspect-square rounded text-sm font-semibold transition-all transform hover:scale-105
                  ${cell.isRevealed
                    ? cell.isBomb
                      ? 'bg-red-600 text-white'
                      : 'bg-green-600 text-white'
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                  }
                  ${gameOver ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {cell.isRevealed ? (
                  cell.isBomb ? '💣' : '💎'
                ) : '?'}
              </button>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            {!gameOver && revealedSafeCells > 0 && (
              <Button
                onClick={cashOut}
                variant="gold"
                size="lg"
                className="flex items-center"
              >
                <TrophyIcon className="h-5 w-5 mr-2" />
                Cash Out ({Math.floor(winnings)} coins)
              </Button>
            )}

            <Button
              onClick={resetGame}
              variant="secondary"
              size="lg"
              className="flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              New Game
            </Button>
          </div>

          {gameOver && (
            <div className={`text-center p-4 rounded-lg ${won ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
              <h3 className={`text-2xl font-bold ${won ? 'text-green-400' : 'text-red-400'}`}>
                {won ? 'You Won!' : 'Game Over!'}
              </h3>
              <p className={`${won ? 'text-green-300' : 'text-red-300'}`}>
                {won
                  ? `You won ${Math.floor(winnings)} coins!`
                  : 'You hit a bomb! Better luck next time.'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
