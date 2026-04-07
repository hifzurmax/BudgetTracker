'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import SummaryCards from '@/components/SummaryCards'
import AddExpenseForm from '@/components/AddExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import LoadingSpinner from '@/components/LoadingSpinner'
import ConfirmModal from '@/components/ConfirmModal'
import { useToast } from '@/components/Toast'
import { daysSince } from '@/lib/utils'

interface Expense {
  id: string
  amount: number
  description: string
  createdAt: string
}

interface Budget {
  id: string
  totalAmount: number
  givenBy: string
  createdAt: string
  isActive: boolean
  expenses: Expense[]
}

export default function DashboardPage() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewBudgetConfirm, setShowNewBudgetConfirm] = useState(false)
  const [creatingNew, setCreatingNew] = useState(false)
  const { showToast } = useToast()

  const fetchBudget = useCallback(async () => {
    try {
      const res = await fetch('/api/budgets/active', { cache: 'no-store' })
      const data = await res.json()
      setBudget(data)
    } catch {
      showToast('Failed to load budget', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchBudget()
  }, [fetchBudget])

  const totalSpent = budget?.expenses.reduce((sum, e) => sum + e.amount, 0) ?? 0
  const remaining = (budget?.totalAmount ?? 0) - totalSpent
  const isLowBalance = budget
    ? remaining < budget.totalAmount * 0.2
    : false

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><LoadingSpinner message="Loading your budget…" /></div>

  /* ─── No Active Budget ─── */
  if (!budget) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="card flex flex-col items-center text-center py-16 gap-5 animate-fade-in">
          <span className="text-6xl">💰</span>
          <div>
            <h1 className="text-2xl font-bold text-white">No Active Budget</h1>
            <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
              You don&apos;t have an active budget yet. Create one to start tracking your expenses.
            </p>
          </div>
          <Link href="/create-budget" className="btn-primary px-8" id="create-budget-cta">
            <span>🚀</span> Create Budget
          </Link>
        </div>
      </div>
    )
  }

  /* ─── Dashboard ─── */
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track your spending below</p>
        </div>
        <button
          id="start-new-budget-btn"
          onClick={() => setShowNewBudgetConfirm(true)}
          disabled={creatingNew}
          className="btn-secondary text-sm px-4 py-2"
        >
          <span>🔄</span> Start New Budget
        </button>
      </div>

      {/* Summary Cards + Progress */}
      <SummaryCards
        totalAmount={budget.totalAmount}
        totalSpent={totalSpent}
        remaining={remaining}
        givenBy={budget.givenBy}
        daysSince={daysSince(budget.createdAt)}
        isLowBalance={isLowBalance}
      />

      {/* Add Expense Form */}
      <AddExpenseForm
        disabled={false}
        onExpenseAdded={fetchBudget}
      />

      {/* Expense List */}
      <ExpenseList
        expenses={budget.expenses}
        onExpenseDeleted={fetchBudget}
      />

      {/* Start New Budget Confirm */}
      <ConfirmModal
        isOpen={showNewBudgetConfirm}
        title="Start New Budget?"
        message="This will archive your current budget and create a fresh one. All expense history is preserved."
        confirmLabel="Yes, Start New"
        onConfirm={async () => {
          setShowNewBudgetConfirm(false)
          setCreatingNew(true)
          try {
            // Deactivate current — the POST /api/budgets route does this automatically.
            // Navigate to create-budget page.
            window.location.href = '/create-budget'
          } finally {
            setCreatingNew(false)
          }
        }}
        onCancel={() => setShowNewBudgetConfirm(false)}
      />
    </div>
  )
}
