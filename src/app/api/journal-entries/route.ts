import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/server-auth';
import { getIntegrationClient } from '@/lib/integration-app-client';

interface IntegrationError extends Error {
  status?: number;
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

    // Get request body
    const body = await request.json();

    // Get Integration.app client
    const client = await getIntegrationClient(auth);

    // Find the first available connection
    const connectionsResponse = await client.connections.find();
    const firstConnection = connectionsResponse.items?.[0];

    if (!firstConnection) {
      return NextResponse.json(
        { error: 'No apps connected to create journal entries' },
        { status: 400 }
      );
    }

    // Create journal entry via Integration.app
    const result = await client
      .connection(firstConnection.id)
      .action('create-journal-entry')
      .run(body);

    return NextResponse.json(result.output, { status: 200 });
  } catch (error: unknown) {
    console.error('Error creating journal entry:', error);
    const integrationError = error as IntegrationError;
    return NextResponse.json(
      { 
        error: integrationError.message || 'Failed to create journal entry',
        data: integrationError.data 
      },
      { status: integrationError.status || 500 }
    );
  }
} 