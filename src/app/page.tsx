'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { BombSweeper } from '@/components/BombSweeper'
import { DiceGame } from '@/components/DiceGame'
import { SlotMachine } from '@/components/SlotMachine'
import { PaymentModal } from '@/components/PaymentModal'
import { Button } from '@/components/ui/Button'
import {
    FireIcon,
    TrophyIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function Home() {
    const [activeGame, setActiveGame] = useState<string | null>(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="py-20 text-center">
                    <div className="space-y-6">
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            DLSpins
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Experience the ultimate online casino with provably fair games, instant withdrawals,
                            and the most exciting gambling experience on the web.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                variant="gold"
                                size="lg"
                                className="text-lg px-8 py-4"
                                onClick={() => setShowPaymentModal(true)}
                            >
                                <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                                Add Coins
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                <TrophyIcon className="h-6 w-6 mr-2" />
                                View Leaderboard
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center mb-4">
                            <ShieldCheckIcon className="h-8 w-8 text-green-400 mr-3" />
                            <h3 className="text-xl font-semibold">Provably Fair</h3>
                        </div>
                        <p className="text-gray-300">
                            All our games use cryptographic algorithms to ensure complete fairness and transparency.
                        </p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center mb-4">
                            <CurrencyDollarIcon className="h-8 w-8 text-yellow-400 mr-3" />
                            <h3 className="text-xl font-semibold">Instant Payouts</h3>
                        </div>
                        <p className="text-gray-300">
                            Cash out your winnings instantly with no delays or hidden fees.
                        </p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center mb-4">
                            <UsersIcon className="h-8 w-8 text-blue-400 mr-3" />
                            <h3 className="text-xl font-semibold">Active Community</h3>
                        </div>
                        <p className="text-gray-300">
                            Join thousands of players in our active gambling community with live chat and tournaments.
                        </p>
                    </div>
                </section>

                {/* Games Section */}
                <section id="games" className="py-16">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        <FireIcon className="h-10 w-10 text-red-500 inline-block mr-3" />
                        Featured Games
                    </h2>

                    {activeGame === 'bombsweeper' ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <Button
                                    onClick={() => setActiveGame(null)}
                                    variant="secondary"
                                    className="mb-6"
                                >
                                    ← Back to Games
                                </Button>
                            </div>
                            <BombSweeper />
                        </div>
                    ) : activeGame === 'dice' ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <Button
                                    onClick={() => setActiveGame(null)}
                                    variant="secondary"
                                    className="mb-6"
                                >
                                    ← Back to Games
                                </Button>
                            </div>
                            <DiceGame onBack={() => setActiveGame(null)} />
                        </div>
                    ) : activeGame === 'slots' ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <Button
                                    onClick={() => setActiveGame(null)}
                                    variant="secondary"
                                    className="mb-6"
                                >
                                    ← Back to Games
                                </Button>
                            </div>
                            <SlotMachine onBack={() => setActiveGame(null)} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Bomb Sweeper Game Card */}
                            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all cursor-pointer group">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl">💣</div>
                                    <h3 className="text-2xl font-bold">Bomb Sweeper</h3>
                                    <p className="text-gray-300">
                                        Test your luck and skill! Avoid the bombs and cash out before it&apos;s too late.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Min Bet:</span>
                                            <span className="text-white">1 coin</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Max Multiplier:</span>
                                            <span className="text-yellow-400">24.75x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">House Edge:</span>
                                            <span className="text-green-400">1%</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setActiveGame('bombsweeper')}
                                        variant="casino"
                                        className="w-full group-hover:scale-105 transition-transform"
                                    >
                                        Play Now
                                    </Button>
                                </div>
                            </div>

                            {/* Dice Game Card */}
                            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer group">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl">🎲</div>
                                    <h3 className="text-2xl font-bold">Dice Roll</h3>
                                    <p className="text-gray-300">
                                        Classic dice game with customizable risk levels and massive multipliers.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Min Bet:</span>
                                            <span className="text-white">1 coin</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Max Multiplier:</span>
                                            <span className="text-yellow-400">28x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">House Edge:</span>
                                            <span className="text-red-400">15%</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setActiveGame('dice')}
                                        variant="casino"
                                        className="w-full group-hover:scale-105 transition-transform"
                                    >
                                        Play Now
                                    </Button>
                                </div>
                            </div>

                            {/* Slot Machine Game Card */}
                            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer group">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl">🎰</div>
                                    <h3 className="text-2xl font-bold">Slot Machine</h3>
                                    <p className="text-gray-300">
                                        Spin the reels with multiple paylines, auto-spin, and massive jackpots!
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Min Bet:</span>
                                            <span className="text-white">1 coin</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Max Multiplier:</span>
                                            <span className="text-yellow-400">100x</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Paylines:</span>
                                            <span className="text-green-400">Up to 25</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setActiveGame('slots')}
                                        variant="casino"
                                        className="w-full group-hover:scale-105 transition-transform"
                                    >
                                        Play Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-gray-800/30 rounded-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-yellow-400">1,247</div>
                            <div className="text-gray-400">Active Players</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400">₿24.7</div>
                            <div className="text-gray-400">Total Winnings</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-400">98.5%</div>
                            <div className="text-gray-400">Payout Rate</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400">24/7</div>
                            <div className="text-gray-400">Support</div>
                        </div>
                    </div>
                </section>

                {/* Leaderboard Preview */}
                <section id="leaderboard" className="py-16">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        <TrophyIcon className="h-8 w-8 text-yellow-400 inline-block mr-2" />
                        Top Winners Today
                    </h2>

                    <div className="bg-gray-800 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
                            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-300">
                                <div>Rank</div>
                                <div>Player</div>
                                <div>Game</div>
                                <div className="text-right">Winnings</div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-700">
                            {[
                                { rank: 1, player: 'CryptoKing', game: 'Bomb Sweeper', winnings: 15420 },
                                { rank: 2, player: 'LuckyPlayer', game: 'Bomb Sweeper', winnings: 8930 },
                                { rank: 3, player: 'HighRoller', game: 'Bomb Sweeper', winnings: 6750 },
                                { rank: 4, player: 'SpinMaster', game: 'Bomb Sweeper', winnings: 4320 },
                                { rank: 5, player: 'BombDefuser', game: 'Bomb Sweeper', winnings: 3890 },
                            ].map((entry) => (
                                <div key={entry.rank} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                                    <div className="grid grid-cols-4 gap-4 items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                        ${entry.rank === 1 ? 'bg-yellow-500 text-black' :
                                                    entry.rank === 2 ? 'bg-gray-400 text-black' :
                                                        entry.rank === 3 ? 'bg-yellow-600 text-black' :
                                                            'bg-gray-600 text-white'
                                                }
                      `}>
                                                {entry.rank}
                                            </span>
                                        </div>
                                        <div className="font-medium">{entry.player}</div>
                                        <div className="text-gray-400">{entry.game}</div>
                                        <div className="text-right font-bold text-green-400">
                                            +{entry.winnings.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-700 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                            DLSpins
                        </h3>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The premier online casino experience. Play responsibly and enjoy the thrill of winning big!
                        </p>
                        <div className="flex justify-center space-x-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-300 transition-colors">Responsible Gambling</a>
                            <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
                        </div>
                        <p className="text-gray-600 text-sm">
                            © 2024 DLSpins. All rights reserved. Gambling can be addictive, please play responsibly.
                        </p>
                    </div>
                </div>
            </footer>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
            />
        </div>
    )
}