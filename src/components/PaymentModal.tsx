'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    XMarkIcon,
    CreditCardIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
}

interface PaymentMethod {
    id: string
    name: string
    icon: React.ReactNode
    description: string
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    const { user, updateCoins, addPaymentTransaction } = useUser()
    const [selectedAmount, setSelectedAmount] = useState(10)
    const [customAmount, setCustomAmount] = useState('')
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    })

    const predefinedAmounts = [5, 10, 25, 50, 100, 250]

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'card',
            name: 'Credit/Debit Card',
            icon: <CreditCardIcon className="h-6 w-6" />,
            description: 'Visa, Mastercard, American Express'
        },
        {
            id: 'bank',
            name: 'Bank Transfer',
            icon: <BanknotesIcon className="h-6 w-6" />,
            description: 'Direct bank transfer (SEPA)'
        }
    ]

    if (!isOpen) return null

    const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount
    const coinAmount = finalAmount // 1 EUR = 1 Coin

    const handlePayment = async () => {
        if (!user || finalAmount < 1) return

        setLoading(true)

        // Mock payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Simulate successful payment (in production, this would call a real payment API)
        const success = Math.random() > 0.1 // 90% success rate for demo

        if (success) {
            // Add payment transaction to history
            addPaymentTransaction({
                amount: finalAmount,
                coins: coinAmount,
                method: selectedPaymentMethod,
                status: 'completed'
            })

            // Add coins to user balance
            updateCoins(coinAmount)
            setSuccess(true)

            // Reset form after success
            setTimeout(() => {
                setSuccess(false)
                onClose()
                setCardDetails({ number: '', expiry: '', cvv: '', name: '' })
                setCustomAmount('')
                setSelectedAmount(10)
            }, 2000)
        } else {
            alert('Payment failed. Please try again.')
        }

        setLoading(false)
    }

    const handleCardInputChange = (field: string, value: string) => {
        setCardDetails(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = matches && matches[0] || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return v
        }
    }

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4)
        }
        return v
    }

    if (success) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 border border-green-500 rounded-lg p-8 w-full max-w-md mx-4 text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-green-400 mb-2">Payment Successful!</h2>
                    <p className="text-gray-300 mb-4">
                        €{finalAmount} has been processed successfully.
                    </p>
                    <p className="text-lg font-semibold text-yellow-400">
                        +{coinAmount} coins added to your balance!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center">
                        <BanknotesIcon className="h-8 w-8 mr-3 text-yellow-400" />
                        Add Coins
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Amount Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Select Amount</h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {predefinedAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => {
                                        setSelectedAmount(amount)
                                        setCustomAmount('')
                                    }}
                                    className={`p-3 rounded-lg border text-center transition-all ${selectedAmount === amount && !customAmount
                                        ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                        }`}
                                >
                                    <div className="text-lg font-bold">€{amount}</div>
                                    <div className="text-xs opacity-75">{amount} coins</div>
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Custom Amount (€)
                            </label>
                            <Input
                                type="number"
                                min="1"
                                max="10000"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white"
                                placeholder="Enter custom amount"
                            />
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Amount:</span>
                            <span className="text-white font-semibold">€{finalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Coins received:</span>
                            <span className="text-yellow-400 font-semibold">{coinAmount}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
                            <span className="text-gray-300 font-medium">Total:</span>
                            <span className="text-white font-bold text-lg">€{finalAmount}</span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                    className={`w-full p-4 rounded-lg border text-left transition-all ${selectedPaymentMethod === method.id
                                        ? 'border-yellow-400 bg-yellow-400/10'
                                        : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="text-yellow-400">{method.icon}</div>
                                        <div>
                                            <div className="text-white font-medium">{method.name}</div>
                                            <div className="text-gray-400 text-sm">{method.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card Details Form */}
                    {selectedPaymentMethod === 'card' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Card Details</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Cardholder Name
                                </label>
                                <Input
                                    type="text"
                                    value={cardDetails.name}
                                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                                    className="bg-gray-800 border-gray-600 text-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Card Number
                                </label>
                                <Input
                                    type="text"
                                    value={cardDetails.number}
                                    onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                                    className="bg-gray-800 border-gray-600 text-white"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Expiry Date
                                    </label>
                                    <Input
                                        type="text"
                                        value={cardDetails.expiry}
                                        onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                                        className="bg-gray-800 border-gray-600 text-white"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        CVV
                                    </label>
                                    <Input
                                        type="text"
                                        value={cardDetails.cvv}
                                        onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                                        className="bg-gray-800 border-gray-600 text-white"
                                        placeholder="123"
                                        maxLength={3}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Notice */}
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <ShieldCheckIcon className="h-6 w-6 text-green-400 mt-0.5" />
                            <div>
                                <h4 className="text-green-400 font-medium mb-1">Secure Payment</h4>
                                <p className="text-green-300 text-sm">
                                    Your payment information is encrypted and secure. We never store your card details.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="gold"
                            onClick={handlePayment}
                            className="flex-1"
                            disabled={loading || finalAmount < 1 || (selectedPaymentMethod === 'card' && (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv))}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                `Pay €${finalAmount}`
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
