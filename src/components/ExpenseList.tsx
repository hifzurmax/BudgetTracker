'use client'

import { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/components/Toast'
import ConfirmModal from '@/components/ConfirmModal'

interface Expense {
  id: string
  amount: number
  description: string
  createdAt: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onExpenseDeleted: (id: string) => void
}

export default function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    setDeletingId(id)
    setConfirmId(null)
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        showToast('Failed to delete expense', 'error')
        return
      }
      showToast('Expense deleted', 'success')
      onExpenseDeleted(id)
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <span className="text-5xl mb-4">🧾</span>
        <p className="text-gray-300 font-semibold text-lg">No expenses yet</p>
        <p className="text-gray-500 text-sm mt-1">Your expense list is empty. Start tracking!</p>
      </div>
    )
  }

  return (
    <>
      <div className="card animate-fade-in space-y-0">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🧾</span>
          <h2 className="text-lg font-semibold text-white">Expenses</h2>
          <span className="ml-auto badge-yellow">{expenses.length} item{expenses.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="divide-y divide-gray-800/70">
          {expenses.map((expense, idx) => (
            <div
              key={expense.id}
              className="flex items-center gap-3 py-3.5 group animate-slide-up"
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💸</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-100 truncate">{expense.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(expense.createdAt)}</p>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-bold text-red-400">
                  -{formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={() => setConfirmId(expense.id)}
                  disabled={deletingId === expense.id}
                  aria-label="Delete expense"
                  className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/50
                             transition-all duration-200 opacity-0 group-hover:opacity-100
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === expense.id ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmId !== null}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
        danger
      />
    </>
  )
}
