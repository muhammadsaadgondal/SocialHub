"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface OtpVerificationFormProps {
  onVerify: (otp: string) => Promise<void>
  onResendOtp: () => void
  email: string
}

export function OtpVerificationForm({ onVerify, onResendOtp, email }: OtpVerificationFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    // Take only the last character if multiple characters are pasted
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit if all fields are filled
    if (newOtp.every((digit) => digit) && newOtp.join("").length === 6) {
      handleSubmit(newOtp.join(""))
    }
  }

  // Handle key down events for navigation and deletion
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Navigate left
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      // Navigate right
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a valid OTP (numbers only)
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]

    // Fill in the OTP fields with pasted digits
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }

    // Auto-submit if all fields are filled
    if (newOtp.every((digit) => digit) && newOtp.join("").length === 6) {
      handleSubmit(newOtp.join(""))
    }
  }

  // Handle form submission
  const handleSubmit = async (otpValue: string) => {
    if (otpValue.length !== 6 || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onVerify(otpValue)
    } catch (error) {
      console.error("Error verifying OTP:", error)
      // Reset OTP fields on error
      setOtp(Array(6).fill(""))
      inputRefs.current[0]?.focus()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = () => {
    onResendOtp()
    setResendDisabled(true)
    setCountdown(60)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            className="w-12 h-12 text-center text-lg"
            autoFocus={index === 0}
            disabled={isSubmitting}
          />
        ))}
      </div>

      <Button
        onClick={() => handleSubmit(otp.join(""))}
        className="w-full  bg-purple-600 hover:bg-purple-700"
        disabled={otp.join("").length !== 6 || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
        <Button variant="link" onClick={handleResendOtp} disabled={resendDisabled} className="text-sm">
          {resendDisabled ? `Resend code in ${countdown}s` : "Resend verification code"}
        </Button>
      </div>
    </div>
  )
}

