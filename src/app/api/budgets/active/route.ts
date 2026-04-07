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
