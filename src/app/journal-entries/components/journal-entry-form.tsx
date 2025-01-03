"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useLedgerAccounts } from "@/hooks/use-ledger-accounts"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { getAuthHeaders } from "@/app/auth-provider"

const journalEntryLineSchema = z.object({
  amount: z
    .union([z.undefined(), z.coerce.number()])
    .refine((val) => !val || val > 0, {
      message: "Amount must be greater than 0",
    }),
  currency: z.string().min(1, "Currency is required"),
  type: z.enum(["Debit", "Credit"]),
  ledgerAccountId: z.string().min(1, "Ledger account is required"),
})

const journalEntrySchema = z.object({
  lines: z
    .array(journalEntryLineSchema)
    .min(1, "At least one line is required")
    .refine(
      (lines) =>
        lines.every(
          (line) => typeof line.amount === "number" && line.amount > 0
        ),
      {
        message: "All lines must have valid amounts",
      }
    ),
})

type JournalEntryLine = {
  amount: number | undefined
  currency: string
  type: "Debit" | "Credit"
  ledgerAccountId: string
}

type JournalEntryFormValues = {
  lines: JournalEntryLine[]
}

export function JournalEntryForm() {
  const { ledgerAccounts } = useLedgerAccounts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      lines: [
        {
          amount: undefined,
          currency: "USD",
          type: "Debit",
          ledgerAccountId: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "lines",
    control: form.control,
  })

  const onSubmit = async (data: JournalEntryFormValues) => {
    try {
      setIsSubmitting(true)

      const response = await fetch("/api/journal-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.data) {
          const apiError = error.data?.response?.data?.Fault?.Error?.[0]
          const errorMessage = apiError?.Message || error.error
          const errorDetail = apiError?.Detail

          toast.error(
            <div className="space-y-2">
              <p className="font-medium">{errorMessage}</p>
              {errorDetail && (
                <p className="text-sm text-muted-foreground">{errorDetail}</p>
              )}
            </div>,
            { duration: 5000 }
          )
        } else {
          toast.error(error.error || "Failed to create journal entry")
        }
        throw new Error(error.error || "Failed to create journal entry")
      }

      const result = await response.json()
      toast.success(
        <div className="space-y-2">
          <p>Journal entry created successfully</p>
          <p className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
            ID: {result.id}
          </p>
        </div>,
        { duration: 5000 }
      )

      // Reset form to initial state
      form.reset({
        lines: [
          {
            amount: undefined,
            currency: "USD",
            type: "Debit",
            ledgerAccountId: "",
          },
        ],
      })
    } catch (error) {
      console.error("Error creating journal entry:", error)
      if (!(error instanceof Error)) {
        toast.error("Failed to create journal entry")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-start p-4 border rounded-lg"
            >
              <FormField
                control={form.control}
                name={`lines.${index}.amount`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`lines.${index}.currency`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`lines.${index}.type`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Debit">Debit</SelectItem>
                        <SelectItem value="Credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`lines.${index}.ledgerAccountId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ledger Account</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ledgerAccounts.map((account) => (
                          <SelectItem
                            key={account.externalId}
                            value={account.externalId}
                          >
                            {account.name} ({account.externalId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => remove(index)}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                amount: undefined,
                currency: "USD",
                type: "Debit",
                ledgerAccountId: "",
              })
            }
            disabled={isSubmitting}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Line
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Journal Entry"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
