'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { formatCurrency, formatShortDate, daysSince } from '@/lib/utils'
import { useToast } from '@/components/Toast'

interface Budget {
  id: string
  totalAmount: number
  givenBy: string
  createdAt: string
  isActive: boolean
  expenses: { id: string; amount: number }[]
}

export default function HistoryPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const res = await fetch('/api/budgets')
        const data = await res.json()
        // Only show inactive (archived) budgets on history page
        setBudgets(data)
      } catch {
        showToast('Failed to load budget history', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchBudgets()
  }, [showToast])

  const archived = budgets.filter((b) => !b.isActive)
  const active = budgets.find((b) => b.isActive)

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><LoadingSpinner message="Loading history…" /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Budget History</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          All archived budgets — {archived.length} total
        </p>
      </div>

      {/* Active Budget Banner */}
      {active && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-950/40 border border-green-800/50 animate-slide-up">
          <span className="text-xl">✅</span>
          <div className="flex-1 min-w-0">
            <p className="text-green-400 font-semibold text-sm">Active Budget</p>
            <p className="text-green-300/70 text-xs mt-0.5">
              {formatCurrency(active.totalAmount)} from {active.givenBy} — started {formatShortDate(active.createdAt)}
            </p>
          </div>
          <span className="badge-green text-xs flex-shrink-0">Current</span>
        </div>
      )}

      {/* Archived list */}
      {archived.length === 0 ? (
        <div className="card flex flex-col items-center text-center py-14 gap-4">
          <span className="text-5xl">🕓</span>
          <p className="text-gray-300 font-semibold text-lg">No archived budgets</p>
          <p className="text-gray-500 text-sm max-w-xs">
            Your previous budgets will appear here once you start a new one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {archived.map((budget, idx) => {
            const spent = budget.expenses.reduce((s, e) => s + e.amount, 0)
            const remaining = budget.totalAmount - spent
            const spentPercent = budget.totalAmount > 0
              ? Math.min((spent / budget.totalAmount) * 100, 100)
              : 0
            const wasLow = remaining < budget.totalAmount * 0.2

            return (
              <div
                key={budget.id}
                className="card animate-slide-up space-y-4"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-base">
                        {formatCurrency(budget.totalAmount)}
                      </p>
                      <span className="badge-yellow text-xs">from {budget.givenBy}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      📅 {formatShortDate(budget.createdAt)} &nbsp;·&nbsp;
                      🕓 {daysSince(budget.createdAt)} days ago
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                    Archived
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-800/60 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(budget.totalAmount)}</p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Spent</p>
                    <p className="text-sm font-bold text-red-400">{formatCurrency(spent)}</p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Remaining</p>
                    <p className={`text-sm font-bold ${wasLow ? 'text-red-400' : 'text-green-400'}`}>
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>{budget.expenses.length} expense{budget.expenses.length !== 1 ? 's' : ''}</span>
                    <span>{spentPercent.toFixed(1)}% used</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${spentPercent}%`,
                        backgroundColor:
                          spentPercent >= 80 ? '#ef4444'
                          : spentPercent >= 60 ? '#f59e0b'
                          : '#22c55e',
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
