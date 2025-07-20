'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/Button'
import { AuthModal } from '@/components/AuthModal'
import { PaymentModal } from '@/components/PaymentModal'
import { PaymentHistoryModal } from '@/components/PaymentHistoryModal'
import {
  UserIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export function Navbar() {
  const { user, logout } = useUser()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                DLSpins
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </a>
                <a
                  href="#games"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Games
                </a>
                <a
                  href="#leaderboard"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Leaderboard
                </a>
              </div>
            </div>

            {/* User Section */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => setShowPaymentModal(true)}
                      className="hidden sm:flex"
                    >
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      Add Coins
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPaymentHistoryModal(true)}
                      className="hidden sm:flex text-gray-300 hover:text-white"
                    >
                      <ClockIcon className="h-4 w-4 mr-1" />
                      History
                    </Button>
                    <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                      <CurrencyDollarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        {user.coins.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <UserIcon className="h-5 w-5" />
                      <span>{user.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="gold"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Login / Register
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
              <a
                href="#"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </a>
              <a
                href="#games"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Games
              </a>
              <a
                href="#leaderboard"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Leaderboard
              </a>

              {user ? (
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.username}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400 mt-1 flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                        <span className="text-yellow-400">{user.coins.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <Button
                      variant="gold"
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full justify-start mb-2"
                    >
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      Add Coins
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentHistoryModal(true)}
                      className="w-full justify-start mb-2 text-gray-300 hover:text-white"
                    >
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Payment History
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-700 px-2">
                  <Button
                    variant="gold"
                    onClick={() => setShowAuthModal(true)}
                    className="w-full"
                  >
                    Login / Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
      <PaymentHistoryModal
        isOpen={showPaymentHistoryModal}
        onClose={() => setShowPaymentHistoryModal(false)}
      />
    </>
  )
}
