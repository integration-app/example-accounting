import useSWR from 'swr';
import { LedgerAccountsResponse } from '@/types/ledger-account';
import { authenticatedFetcher, getAuthHeaders } from '@/lib/fetch-utils';

export function useLedgerAccounts() {
  const { data, error, isLoading, mutate } = useSWR<LedgerAccountsResponse>(
    '/api/ledger-accounts',
    (url) => authenticatedFetcher<LedgerAccountsResponse>(url),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const importLedgerAccounts = async () => {
    try {
      const response = await fetch('/api/ledger-accounts/import', {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to import ledger accounts');
      }

      // Refresh the ledger accounts list
      await mutate();

      return true;
    } catch (error) {
      console.error('Error importing ledger accounts:', error);
      throw error;
    }
  };

  return {
    ledgerAccounts: data?.ledgerAccounts ?? [],
    isLoading,
    isError: error,
    mutate,
    importLedgerAccounts,
  };
} 