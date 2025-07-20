'use client'

import { useUser } from '@/contexts/UserContext'
import {
    XMarkIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface PaymentHistoryModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PaymentHistoryModal({ isOpen, onClose }: PaymentHistoryModalProps) {
    const { user } = useUser()

    if (!isOpen || !user) return null

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString()
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-400" />
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-400" />
            case 'failed':
                return <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            default:
                return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-400'
            case 'pending':
                return 'text-yellow-400'
            case 'failed':
                return 'text-red-400'
            default:
                return 'text-gray-400'
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Payment History</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {!user.paymentHistory || user.paymentHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-lg">No payment history yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Your payment transactions will appear here once you make a purchase
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="px-6 py-3 bg-gray-700 border-b border-gray-600">
                                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-300">
                                    <div>Date</div>
                                    <div>Amount</div>
                                    <div>Coins</div>
                                    <div>Method</div>
                                    <div>Status</div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-700">
                                {user.paymentHistory
                                    .sort((a, b) => b.timestamp - a.timestamp)
                                    .map((transaction) => (
                                        <div key={transaction.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                                            <div className="grid grid-cols-5 gap-4 items-center">
                                                <div className="text-gray-300 text-sm">
                                                    {formatDate(transaction.timestamp)}
                                                </div>
                                                <div className="text-white font-medium">
                                                    €{transaction.amount}
                                                </div>
                                                <div className="text-yellow-400 font-medium">
                                                    {transaction.coins.toLocaleString()}
                                                </div>
                                                <div className="text-gray-300 capitalize">
                                                    {transaction.method === 'card' ? 'Credit Card' : 'Bank Transfer'}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(transaction.status)}
                                                    <span className={`capitalize font-medium ${getStatusColor(transaction.status)}`}>
                                                        {transaction.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Purchased:</span>
                                <span className="text-white font-semibold">
                                    €{user.paymentHistory
                                        .filter(t => t.status === 'completed')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Coins Received:</span>
                                <span className="text-yellow-400 font-semibold">
                                    {user.paymentHistory
                                        .filter(t => t.status === 'completed')
                                        .reduce((sum, t) => sum + t.coins, 0)
                                        .toLocaleString()
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
