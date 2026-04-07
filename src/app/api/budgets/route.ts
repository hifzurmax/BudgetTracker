import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/budgets — list all budgets
export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        expenses: {
          select: { id: true, amount: true }, // history only needs totals, not full expense details
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(budgets)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
  }
}

// POST /api/budgets — create a new budget (deactivates current)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { totalAmount, givenBy } = body

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: 'Total amount must be greater than 0' }, { status: 400 })
    }
    if (!givenBy || givenBy.trim() === '') {
      return NextResponse.json({ error: 'givenBy is required' }, { status: 400 })
    }

    // Deactivate all existing active budgets
    await prisma.budget.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    })

    // Create new active budget
    const budget = await prisma.budget.create({
      data: {
        totalAmount: parseFloat(totalAmount),
        givenBy: givenBy.trim(),
        isActive: true,
      },
    })

    return NextResponse.json(budget, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
  }
}
