'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register } = useUser()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let success = false

      if (isLogin) {
        success = await login(formData.username, formData.password)
        if (!success) {
          setError('Invalid username or password')
        }
      } else {
        success = await register(formData.username, formData.email, formData.password)
        if (!success) {
          setError('Username or email already exists')
        }
      }

      if (success) {
        onClose()
        setFormData({ username: '', email: '', password: '' })
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
              placeholder="Enter your username"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
                placeholder="Enter your email"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            variant="gold"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setFormData({ username: '', email: '', password: '' })
            }}
            className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"
            }
          </button>
        </div>
      </div>
    </div>
  )
}
