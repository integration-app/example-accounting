"use client"

import { LedgerAccountsTable } from "./components/ledger-accounts-table"
import { useLedgerAccounts } from "@/hooks/use-ledger-accounts"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function LedgerAccountsPage() {
  const { ledgerAccounts, isLoading, isError, importLedgerAccounts } =
    useLedgerAccounts()
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    try {
      setIsImporting(true)
      await importLedgerAccounts()
    } catch (error) {
      console.error("Failed to import ledger accounts:", error)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ledger Accounts
            </h1>
            <p className="text-muted-foreground">Manage your ledger accounts</p>
          </div>
          <div className="flex gap-4">
            <Link href="/journal-entries/new">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Journal Entry
              </Button>
            </Link>
            <Button onClick={handleImport} disabled={isImporting}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isImporting ? "animate-spin" : ""}`}
              />
              {isImporting ? "Importing..." : "Import Accounts"}
            </Button>
          </div>
        </div>
        <LedgerAccountsTable
          ledgerAccounts={ledgerAccounts}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  )
}
