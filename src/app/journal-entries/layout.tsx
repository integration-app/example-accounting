import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Journal Entries",
}

export default function JournalEntriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
