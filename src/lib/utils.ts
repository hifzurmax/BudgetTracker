const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export function formatCurrency(amount: number): string {
  return `৳${currencyFormatter.format(amount)}`
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(date: string | Date): string {
  return dateFormatter.format(new Date(date))
}

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatShortDate(date: string | Date): string {
  return shortDateFormatter.format(new Date(date))
}

export function daysSince(date: string | Date): number {
  const now = new Date()
  const start = new Date(date)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
