import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/budgets/active — get the currently active budget with expenses
export async function GET() {
  try {
    const budget = await prisma.budget.findFirst({
      where: { isActive: true },
      include: {
        expenses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!budget) {
      return NextResponse.json(null)
    }

    return NextResponse.json(budget)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch active budget' }, { status: 500 })
  }
}

// PATCH /api/budgets/active — update the currently active budget
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { totalAmount } = body

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    }

    const activeBudget = await prisma.budget.findFirst({
      where: { isActive: true },
    })

    if (!activeBudget) {
      return NextResponse.json({ error: 'No active budget found' }, { status: 404 })
    }

    const updatedBudget = await prisma.budget.update({
      where: { id: activeBudget.id },
      data: { totalAmount: parseFloat(totalAmount) },
    })

    return NextResponse.json(updatedBudget, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
  }
}
