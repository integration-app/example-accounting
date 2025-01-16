import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { LedgerAccount } from '@/models/ledger-account';
import { getAuthFromRequest } from '@/lib/server-auth';
import { getIntegrationClient } from '@/lib/integration-app-client';

interface ExternalLedgerAccount {
  id: string;
  name: string;
}

interface GetLedgerAccountsResponse {
  records: ExternalLedgerAccount[];
  cursor?: string;
}

interface IntegrationError extends Error {
  data?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // 1. Get Integration.app client
    const client = await getIntegrationClient(auth);

    // 2. Find the first available connection
    const connectionsResponse = await client.connections.find();
    const firstConnection = connectionsResponse.items?.[0];

    if (!firstConnection) {
      return NextResponse.json(
        { error: 'No apps connected to import ledger accounts from' },
        { status: 400 }
      );
    }

    // 3. Get all ledger accounts from the accounting system via Integration.app
    const allExternalAccounts: ExternalLedgerAccount[] = [];
    let cursor: string | undefined = undefined;

    do {
      const result = await client
        .connection(firstConnection.id)
        .action('get-ledger-accounts')
        .run(cursor ? { cursor } : undefined);

      const response = result.output as GetLedgerAccountsResponse;
      allExternalAccounts.push(...response.records);
      cursor = response.cursor;
    } while (cursor);

    // 4. Delete existing ledger accounts for this customer
    await LedgerAccount.deleteMany({ customerId: auth.customerId });

    // 5. Create new ledger accounts from the imported data
    const ledgerAccounts = await LedgerAccount.create(
      allExternalAccounts.map((extAccount) => ({
        externalId: extAccount.id,
        name: extAccount.name,
        customerId: auth.customerId,
      }))
    );

    return NextResponse.json({ ledgerAccounts }, { status: 200 });
  } catch (error) {
    console.error('Error importing ledger accounts:', error);
    const integrationError = error as IntegrationError;
    return NextResponse.json(
      { 
        error: integrationError.message || 'Failed to import ledger accounts',
        data: integrationError.data 
      },
      { status: 500 }
    );
  }
} 