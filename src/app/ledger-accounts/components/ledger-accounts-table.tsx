import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LedgerAccount } from "@/types/ledger-account"
import { Skeleton } from "@/components/ui/skeleton"

interface LedgerAccountsTableProps {
  ledgerAccounts: LedgerAccount[]
  isLoading?: boolean
  isError?: Error | null
}

export function LedgerAccountsTable({
  ledgerAccounts,
  isLoading = false,
  isError = null,
}: LedgerAccountsTableProps) {
  if (isError) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          Error loading ledger accounts. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>External ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[150px]" />
                </TableCell>
              </TableRow>
            ))
          ) : ledgerAccounts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-center text-muted-foreground"
              >
                No ledger accounts found
              </TableCell>
            </TableRow>
          ) : (
            ledgerAccounts.map((account) => (
              <TableRow key={account.externalId}>
                <TableCell className="font-medium">
                  {account.externalId}
                </TableCell>
                <TableCell>{account.name}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
