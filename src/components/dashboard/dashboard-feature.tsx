"use client"

import { useState } from "react"
import { CalendarIcon, GiftIcon, Loader2Icon } from "lucide-react"
import { format } from "date-fns"
import { useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useGiftCard } from "../gift-card/gift-card-data-access"
import { WalletButton } from "../solana/solana-provider"

export function FormCard() {
  const { publicKey } = useWallet()
  const { loading, error, giftCard, createGiftCard } = useGiftCard()
  const [date, setDate] = useState<Date>()
  const [amount, setAmount] = useState<string>("")
  const [title, setTitle] = useState<string>("")

  const handleSubmit = async () => {
    if (!date || !amount || !title) return
    await createGiftCard({
      amount: parseFloat(amount),
      title,
      unlockDate: date,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GiftIcon className="w-6 h-6" />
          Create Gift Card
        </CardTitle>
        <CardDescription>Create a time-locked Solana gift card.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!publicKey ? (
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">Connect your wallet to create a gift card</p>
            <WalletButton />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (SOL)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Unlock Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    id="date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {giftCard && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900">Gift Card Created!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Amount: {giftCard.amount.toNumber() / LAMPORTS_PER_SOL} SOL
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading || !publicKey || !date || !amount || !title}
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Gift Card"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
