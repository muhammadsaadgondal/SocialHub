"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface SignUpSuccessProps {
  onContinue: () => void
}

export function SignUpSuccess({ onContinue }: SignUpSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6 text-center">
      <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-300" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Account Created Successfully!</h3>
        <p className="text-muted-foreground">
          Your account has been created and is ready to use. You can now sign in to access your account.
        </p>
      </div>

      <Button onClick={onContinue} className="w-full  bg-purple-600 hover:bg-purple-700">
        Continue to Sign In
      </Button>
    </div>
  )
}

