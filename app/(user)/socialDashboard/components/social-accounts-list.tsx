"use client"

import { Facebook, Instagram, Linkedin, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { SocialAccount, SocialPlatform } from "@/lib/types"
import { disconnectSocialAccount } from "@/lib/api"
import { useState } from "react"
import toast from "react-hot-toast"

interface SocialAccountsListProps {
  accounts: SocialAccount[]
  onAccountDisconnected: (id: string) => void
}

export function SocialAccountsList({ accounts, onAccountDisconnected }: SocialAccountsListProps) {
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  const handleDisconnect = async (id: string) => {
    setDisconnecting(id)
    try {
      const success = await disconnectSocialAccount(id)
      if (success) {
        onAccountDisconnected(id)
        toast.success("The social account has been disconnected successfully.")
      }
    } catch (error) {
      toast.error("Failed to disconnect account. Please try again.")
    } finally {
      setDisconnecting(null)
    }
  }

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-600" />
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />
      default:
        return null
    }
  }

  const getPlatformName = (platform: SocialPlatform) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  if (accounts.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          You haven&apos;t connected any social accounts yet. Click the &quot;Connect Account&quot; button to get
          started.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            {getPlatformIcon(account.platform)}
            <div>
              <div className="font-medium">{getPlatformName(account.platform)}</div>
              <div className="text-sm text-muted-foreground">@{account.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Updated {account.lastUpdated}</div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  disabled={disconnecting === account.id}
                >
                  {disconnecting === account.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Disconnect account</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disconnect your {getPlatformName(account.platform)} account? You can
                    reconnect it later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDisconnect(account.id)}>Disconnect</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
      {accounts.length < 5 && (
        <div className="mt-4 text-sm text-muted-foreground">
          You can connect {5 - accounts.length} more account{accounts.length === 4 ? "" : "s"}.
        </div>
      )}
    </div>
  )
}

