"use client"

import type React from "react"
import { useState } from "react"
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Plus, Loader2, TwitterIcon as TikTok } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SocialAccount, SocialPlatform } from "@/lib/types"
import { connectUsernameAccount } from "@/lib/api"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"

interface ConnectAccountButtonProps {
  accounts: SocialAccount[]
  onAccountConnected: (account: SocialAccount) => void
}

export function ConnectAccountButton({ accounts, onAccountConnected }: ConnectAccountButtonProps) {
  const [open, setOpen] = useState(false)
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null)
  const [username, setUsername] = useState("")
  const [usernameFor, setUsernameFor] = useState<SocialPlatform | null>(null)

  const handleOAuthConnect = async (platform: SocialPlatform) => {
    setConnecting(platform)

    try {
      // Map platform to the correct provider ID
      const providerId = getProviderId(platform)

      // Redirect to OAuth flow
      signIn(providerId, {
        callbackUrl: "/dashboard",
      })
    } catch (error) {
      toast.error(`Failed to connect ${platform} account. Please try again.`)
      setConnecting(null)
    }
  }

  const handleUsernameConnect = (platform: SocialPlatform) => {
    setUsernameFor(platform)
  }

  const submitUsernameConnect = async () => {
    if (!usernameFor || !username.trim()) return

    setConnecting(usernameFor)

    try {
      const newAccount = await connectUsernameAccount(usernameFor, username)
      onAccountConnected(newAccount)
      toast.success(`Your ${usernameFor} account has been connected successfully.`)
      setOpen(false)
      setUsername("")
      setUsernameFor(null)
    } catch (error) {
      toast.error(`Failed to connect ${usernameFor} account. Please try again.`)
    } finally {
      setConnecting(null)
    }
  }

  // Helper function to map platform to provider ID
  const getProviderId = (platform: SocialPlatform): string => {
    switch (platform) {
      case "facebook":
        return "facebook-dashboard"
      case "youtube":
        return "youtube-dashboard"
      default:
        return platform
    }
  }

  const canConnectMore = accounts.length < 5
  const platforms: {
    id: SocialPlatform
    name: string
    icon: React.ReactNode
    color: string
    authType: "oauth" | "username"
  }[] = [
    {
      id: "facebook",
      name: "Meta",
      icon: <Facebook className="h-5 w-5" />,
      color: "text-blue-600",
      authType: "oauth",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      color: "text-blue-700",
      authType: "username",
    },
    { id: "youtube", name: "YouTube", icon: <Youtube className="h-5 w-5" />, color: "text-red-600", authType: "oauth" },
    { id: "tiktok", name: "TikTok", icon: <TikTok className="h-5 w-5" />, color: "text-black", authType: "username" },
  ]

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

        {usernameFor ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">
                  Enter your {platforms.find((p) => p.id === usernameFor)?.name} username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`@username`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUsernameFor(null)}>
                Back
              </Button>
              <Button onClick={submitUsernameConnect} disabled={!username.trim() || connecting === usernameFor}>
                {connecting === usernameFor ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Connect Account
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="grid gap-4 py-4">
            {platforms.map((platform) => {
              const isConnected = accounts.some((a) => a.platform === platform.id)

              return (
                <Button
                  key={platform.id}
                  variant="outline"
                  className="flex justify-start gap-3"
                  onClick={() =>
                    platform.authType === "oauth" ? handleOAuthConnect(platform.id) : handleUsernameConnect(platform.id)
                  }
                  disabled={connecting !== null || isConnected}
                >
                  {connecting === platform.id ? (
                    <Loader2 className={`h-5 w-5 animate-spin ${platform.color}`} />
                  ) : (
                    <span className={platform.color}>{platform.icon}</span>
                  )}
                  Connect {platform.name}
                  {isConnected && " (Already connected)"}
                </Button>
              )
            })}
          </div>
        )}

        <div className="text-xs text-muted-foreground">You can connect up to 5 social accounts in total.</div>
      </DialogContent>
    </Dialog>
  )
}

