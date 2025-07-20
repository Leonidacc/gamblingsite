'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
  coins: number
  paymentHistory?: PaymentTransaction[]
}

interface PaymentTransaction {
  id: string
  amount: number
  coins: number
  method: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: number
}

interface StoredUser extends User {
  password: string
}

interface UserContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateCoins: (amount: number) => void
  addPaymentTransaction: (transaction: Omit<PaymentTransaction, 'id' | 'timestamp'>) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('dlspins_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple mock authentication - in production, this would call an API
    const mockUsers: StoredUser[] = JSON.parse(localStorage.getItem('dlspins_users') || '[]')
    const foundUser = mockUsers.find((u: StoredUser) => u.username === username && u.password === password)

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        coins: foundUser.coins
      }
      setUser(userWithoutPassword)
      localStorage.setItem('dlspins_user', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simple mock registration - in production, this would call an API
    const mockUsers: StoredUser[] = JSON.parse(localStorage.getItem('dlspins_users') || '[]')

    // Check if user already exists
    if (mockUsers.some((u: StoredUser) => u.username === username || u.email === email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      coins: 1000 // Starting coins
    }

    mockUsers.push(newUser)
    localStorage.setItem('dlspins_users', JSON.stringify(mockUsers))

    const userWithoutPassword = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      coins: newUser.coins
    }

    setUser(userWithoutPassword)
    localStorage.setItem('dlspins_user', JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dlspins_user')
  }

  const updateCoins = (amount: number) => {
    if (user) {
      const newBalance = user.coins + amount
      const updatedUser = { ...user, coins: newBalance }
      setUser(updatedUser)
      localStorage.setItem('dlspins_user', JSON.stringify(updatedUser))

      // Also update in the users array
      const mockUsers: StoredUser[] = JSON.parse(localStorage.getItem('dlspins_users') || '[]')
      const userIndex = mockUsers.findIndex((u: StoredUser) => u.id === user.id)
      if (userIndex !== -1) {
        mockUsers[userIndex].coins = newBalance
        localStorage.setItem('dlspins_users', JSON.stringify(mockUsers))
      }
    }
  }

  const addPaymentTransaction = (transaction: Omit<PaymentTransaction, 'id' | 'timestamp'>) => {
    if (user) {
      const newTransaction: PaymentTransaction = {
        ...transaction,
        id: Date.now().toString(),
        timestamp: Date.now()
      }

      const updatedUser = {
        ...user,
        paymentHistory: [...(user.paymentHistory || []), newTransaction]
      }

      setUser(updatedUser)
      localStorage.setItem('dlspins_user', JSON.stringify(updatedUser))

      // Also update in the users array
      const mockUsers: StoredUser[] = JSON.parse(localStorage.getItem('dlspins_users') || '[]')
      const userIndex = mockUsers.findIndex((u: StoredUser) => u.id === user.id)
      if (userIndex !== -1) {
        mockUsers[userIndex].paymentHistory = updatedUser.paymentHistory
        localStorage.setItem('dlspins_users', JSON.stringify(mockUsers))
      }
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateCoins,
      addPaymentTransaction,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
