import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { LedgerAccount } from '@/models/ledger-account';
import { getAuthFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const ledgerAccounts = await LedgerAccount.find({ customerId: auth.customerId })
      .select('externalId name createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ ledgerAccounts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ledger accounts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 