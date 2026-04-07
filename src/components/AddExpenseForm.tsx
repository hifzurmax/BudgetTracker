'use client'

import { useState, FormEvent } from 'react'
import { useToast } from '@/components/Toast'

interface AddExpenseFormProps {
  disabled: boolean
  onExpenseAdded: () => void
}

export default function AddExpenseForm({ disabled, onExpenseAdded }: AddExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      showToast('Amount must be a positive number', 'error')
      return
    }
    if (!description.trim()) {
      showToast('Please enter a description', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parsedAmount, description: description.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        showToast(err.error || 'Failed to add expense', 'error')
        return
      }

      showToast('Expense added successfully ✓', 'success')
      setAmount('')
      setDescription('')
      onExpenseAdded()
    } catch {
      showToast('Something went wrong. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">➕</span>
        <h2 className="text-lg font-semibold text-white">Add Expense</h2>
        {disabled && (
          <span className="ml-auto badge-red text-xs">No active budget</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="expense-amount" className="label">Amount ($)</label>
          <input
            id="expense-amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 25.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={disabled || loading}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="expense-description" className="label">Description</label>
          <input
            id="expense-description"
            type="text"
            placeholder="e.g. Lunch, Transport, Groceries…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled || loading}
            className="input-field"
            maxLength={100}
            required
          />
        </div>

        <button
          type="submit"
          id="add-expense-btn"
          disabled={disabled || loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding…
            </>
          ) : (
            <>
              <span>💸</span> Add Expense
            </>
          )}
        </button>
      </form>

      {disabled && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Create a budget first to start tracking expenses.
        </p>
      )}
    </div>
  )
}
