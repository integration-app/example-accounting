import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ledger Accounts",
}

export default function LedgerAccountsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
