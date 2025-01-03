"use client"

import { JournalEntryForm } from "../components/journal-entry-form"

export default function NewJournalEntryPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Journal Entry
          </h1>
          <p className="text-muted-foreground">
            Create a new journal entry with multiple lines
          </p>
        </div>
        <JournalEntryForm />
      </div>
    </div>
  )
}
