'use client'

import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  totalAmount: number
  totalSpent: number
  remaining: number
  givenBy: string
  daysSince: number
  isLowBalance: boolean
}

export default function SummaryCards({
  totalAmount,
  totalSpent,
  remaining,
  givenBy,
  daysSince,
  isLowBalance,
}: SummaryCardsProps) {
  const spentPercent = totalAmount > 0 ? Math.min((totalSpent / totalAmount) * 100, 100) : 0
  const remainingPercent = 100 - spentPercent

  return (
    <div className="space-y-4">
      {/* Low Balance Warning */}
      {isLowBalance && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-700/60 bg-red-950/40 animate-fade-in">
          <span className="text-xl flex-shrink-0 mt-0.5">🚨</span>
          <div>
            <p className="text-red-400 font-semibold text-sm">Low Balance Warning</p>
            <p className="text-red-300/70 text-xs mt-0.5">
              Your remaining balance is less than 20% of the total budget. Spend wisely!
            </p>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Budget */}
        <div className="card col-span-2 sm:col-span-1 flex flex-col gap-2 animate-slide-up">
          <p className="label text-xs uppercase tracking-wider">Total Budget</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
          <span className="badge-green w-fit">
            <span>👤</span> {givenBy}
          </span>
        </div>

        {/* Total Spent */}
        <div className="card col-span-2 sm:col-span-1 flex flex-col gap-2 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <p className="label text-xs uppercase tracking-wider">Total Spent</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-gray-500">{spentPercent.toFixed(1)}% of budget</p>
        </div>

        {/* Remaining */}
        <div className={`card col-span-2 sm:col-span-1 flex flex-col gap-2 animate-slide-up ${isLowBalance ? 'border-red-800/60' : ''}`} style={{ animationDelay: '0.1s' }}>
          <p className="label text-xs uppercase tracking-wider">Remaining</p>
          <p className={`text-2xl font-bold ${isLowBalance ? 'text-red-400' : 'text-green-400'}`}>
            {formatCurrency(remaining)}
          </p>
          <p className="text-xs text-gray-500">{remainingPercent.toFixed(1)}% left</p>
        </div>

        {/* Days Since */}
        <div className="card col-span-2 sm:col-span-1 flex flex-col gap-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <p className="label text-xs uppercase tracking-wider">Days Active</p>
          <p className="text-2xl font-bold text-blue-400">{daysSince}</p>
          <p className="text-xs text-gray-500">{daysSince === 1 ? 'day' : 'days'} since started</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Budget Used</p>
          <p className="text-xs font-semibold text-gray-300">{spentPercent.toFixed(1)}%</p>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${spentPercent}%`,
              backgroundColor:
                spentPercent >= 80 ? '#ef4444'
                : spentPercent >= 60 ? '#f59e0b'
                : '#22c55e',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}
