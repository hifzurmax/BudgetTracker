'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'

interface EditBudgetModalProps {
  isOpen: boolean
  currentAmount: number
  onConfirm: (newAmount: number) => Promise<void>
  onCancel: () => void
}

export default function EditBudgetModal({
  isOpen,
  currentAmount,
  onConfirm,
  onCancel,
}: EditBudgetModalProps) {
  const [amount, setAmount] = useState(currentAmount.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setAmount(currentAmount.toString())
      setError('')
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isOpen, currentAmount])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const parsedAmount = parseFloat(amount)

    if (!parsedAmount || parsedAmount <= 0) {
      setError('Amount must be a positive number')
      return
    }

    setLoading(true)
    try {
      await onConfirm(parsedAmount)
    } catch {
      setError('Failed to update. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <form onSubmit={handleSubmit} className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slide-up">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">✏️</span>
          <div className="w-full">
            <h3 className="font-semibold text-white text-base">Edit Budget Total</h3>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              Update the total amount for your current budget.
            </p>
          </div>
        </div>

        <div className="mb-6 mt-4">
          <label htmlFor="edit-budget-amount" className="label">New Amount (৳)</label>
          <input
            ref={inputRef}
            id="edit-budget-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            className="input-field"
            required
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-4 py-2 text-sm flex min-w-[90px] justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
