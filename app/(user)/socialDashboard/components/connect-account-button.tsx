"use client"

import { useState } from "react"
import { Facebook, Instagram, Linkedin, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { SocialAccount, SocialPlatform } from "@/lib/types"
import { connectSocialAccount } from "@/lib/api"
import toast from "react-hot-toast"

interface ConnectAccountButtonProps {
  accounts: SocialAccount[]
  onAccountConnected: (account: SocialAccount) => void
}

export function ConnectAccountButton({ accounts, onAccountConnected }: ConnectAccountButtonProps) {
  const [open, setOpen] = useState(false)
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null)

  const handleConnect = async (platform: SocialPlatform) => {
    setConnecting(platform)

    try {
      const newAccount = await connectSocialAccount(platform)
      onAccountConnected(newAccount)
      toast.success(`Your ${platform} account has been connected successfully.`)
      setOpen(false)
    } catch (error) {
      toast.error(`Failed to connect ${platform} account. Please try again.`)
    } finally {
      setConnecting(null)
    }
  }

  const canConnectMore = accounts.length < 5

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canConnectMore}>
          <Plus className="mr-2 h-4 w-4" />
          Connect Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect a social account</DialogTitle>
          <DialogDescription>Choose a platform to connect to your dashboard.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex justify-start gap-3"
            onClick={() => handleConnect("facebook")}
            disabled={connecting !== null || accounts.some((a) => a.platform === "facebook")}
          >
            {connecting === "facebook" ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            ) : (
              <Facebook className="h-5 w-5 text-blue-600" />
            )}
            Connect Facebook
            {accounts.some((a) => a.platform === "facebook") && " (Already connected)"}
          </Button>
          <Button
            variant="outline"
            className="flex justify-start gap-3"
            onClick={() => handleConnect("instagram")}
            disabled={connecting !== null || accounts.some((a) => a.platform === "instagram")}
          >
            {connecting === "instagram" ? (
              <Loader2 className="h-5 w-5 animate-spin text-pink-600" />
            ) : (
              <Instagram className="h-5 w-5 text-pink-600" />
            )}
            Connect Instagram
            {accounts.some((a) => a.platform === "instagram") && " (Already connected)"}
          </Button>
          <Button
            variant="outline"
            className="flex justify-start gap-3"
            onClick={() => handleConnect("linkedin")}
            disabled={connecting !== null || accounts.some((a) => a.platform === "linkedin")}
          >
            {connecting === "linkedin" ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
            ) : (
              <Linkedin className="h-5 w-5 text-blue-700" />
            )}
            Connect LinkedIn
            {accounts.some((a) => a.platform === "linkedin") && " (Already connected)"}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">You can connect up to 5 social accounts in total.</div>
      </DialogContent>
    </Dialog>
  )
}

