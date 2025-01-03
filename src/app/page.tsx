import { AuthTest } from "@/components/auth-test"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Overview",
}

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Accounting Integration Demo
            </h1>
            <p className="text-muted-foreground">
              This demo shows how to integrate with accounting software to
              create journal entries.
            </p>
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">How to use this app:</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li className="text-muted-foreground">
                  Go to{" "}
                  <Link
                    href="/integrations"
                    className="font-medium text-foreground hover:underline"
                  >
                    Integrations
                  </Link>{" "}
                  and connect your accounting software
                </li>
                <li className="text-muted-foreground">
                  Navigate to{" "}
                  <Link
                    href="/ledger-accounts"
                    className="font-medium text-foreground hover:underline"
                  >
                    Ledger Accounts
                  </Link>{" "}
                  and import your chart of accounts
                </li>
                <li className="text-muted-foreground">
                  Use{" "}
                  <Link
                    href="/journal-entries/new"
                    className="font-medium text-foreground hover:underline"
                  >
                    Create Journal Entry
                  </Link>{" "}
                  to create and post journal entries to your accounting system
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <AuthTest />
    </div>
  )
}
