'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'

export default function CreateBudgetPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [totalAmount, setTotalAmount] = useState('')
  const [givenBy, setGivenBy] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const parsed = parseFloat(totalAmount)
    if (!parsed || parsed <= 0) {
      showToast('Amount must be greater than 0', 'error')
      return
    }
    if (!givenBy.trim()) {
      showToast('Please enter who gave this budget', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: parsed, givenBy: givenBy.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        showToast(err.error || 'Failed to create budget', 'error')
        return
      }

      showToast('Budget created successfully! 🎉', 'success')
      router.push('/')
      router.refresh()
    } catch {
      showToast('Something went wrong. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const quickAmounts = [100, 500, 1000, 5000]
  const quickSources = ['Father', 'Mother', 'Brother', 'Sister', 'Friend', 'Salary']

  return (
    <div className="max-w-lg mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-5xl block mb-3">💰</span>
        <h1 className="text-2xl font-bold text-white">Create New Budget</h1>
        <p className="text-gray-400 text-sm mt-1.5">
          Set your total budget and who gave it. This will become the active budget.
        </p>
      </div>

      <div className="card space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5" id="create-budget-form">
          {/* Amount */}
          <div>
            <label htmlFor="budget-amount" className="label">Total Amount (৳)</label>
            <input
              id="budget-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 1000.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="input-field text-lg"
              disabled={loading}
              required
            />
            {/* Quick amount buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setTotalAmount(q.toString())}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700
                             text-gray-400 hover:text-gray-200 border border-gray-700
                             transition-all duration-150 disabled:opacity-50"
                >
                  ${q}
                </button>
              ))}
            </div>
          </div>

          {/* Given By */}
          <div>
            <label htmlFor="given-by" className="label">Given By</label>
            <input
              id="given-by"
              type="text"
              placeholder="e.g. Father, Brother, Salary…"
              value={givenBy}
              onChange={(e) => setGivenBy(e.target.value)}
              className="input-field"
              maxLength={50}
              disabled={loading}
              required
            />
            {/* Quick source buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {quickSources.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setGivenBy(s)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700
                             text-gray-400 hover:text-gray-200 border border-gray-700
                             transition-all duration-150 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            id="submit-budget-btn"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <span>🚀</span> Create Budget
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center border-t border-gray-800 pt-4">
          Creating a new budget will archive your current active budget. All data is preserved.
        </p>
      </div>
    </div>
  )
}
