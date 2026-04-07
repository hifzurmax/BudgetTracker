import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/expenses — add an expense to the active budget
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, description } = body

    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    }
    if (!description || description.trim() === '') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }

    // Find the active budget
    const activeBudget = await prisma.budget.findFirst({
      where: { isActive: true },
    })

    if (!activeBudget) {
      return NextResponse.json({ error: 'No active budget found' }, { status: 404 })
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description: description.trim(),
        budgetId: activeBudget.id,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}
