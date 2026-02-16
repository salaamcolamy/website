import { NextRequest, NextResponse } from 'next/server'
import { getBillplzClient, isBillplzConfigured } from '@/lib/billplz/client'
import { withSecurity } from '@/lib/security'

async function handler(request: NextRequest) {
  try {
    if (!isBillplzConfigured()) {
      return NextResponse.json({ error: 'Billplz is not configured' }, { status: 500 })
    }

    const searchParams = request.nextUrl.searchParams
    const billId = searchParams.get('billId')

    if (!billId) {
      return NextResponse.json({ error: 'Bill ID is required' }, { status: 400 })
    }

    const billplz = getBillplzClient()
    const bill = await billplz.getBill(billId)

    return NextResponse.json({
      success: true,
      billId: bill.id,
      paid: bill.paid,
      state: bill.state,
      amount: bill.amount,
      paidAmount: bill.paid_amount,
      paidAt: bill.paid_at,
      orderId: bill.reference_1,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check bill status' },
      { status: 500 }
    )
  }
}

export const GET = withSecurity(handler)
