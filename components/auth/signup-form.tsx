"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { InitialSignUpForm } from "./initial-signun-form"
import { OtpVerificationForm } from "./otp-verification"
import { AccountDetailsForm } from "./account-details-form"
import { SignUpSuccess } from "./signup-sucess"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { createUser } from "@/lib/data"

// Define the steps in the sign-up process
type SignUpStep = "INITIAL" | "OTP_VERIFICATION" | "ACCOUNT_DETAILS" | "SUCCESS"

// Update the user data structure to match the types from types.ts
export interface SignUpUserData {
  email: string
  password: string
  username: string
  profilePicture?: string
  status: "ACTIVE" | "DELETED" | "BLOCKED"
  accountType: "INFLUENCER" | "CAMPAIGN_MANAGER"
  fullName?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  thirdPartyAuth?: {
    google?: boolean
    facebook?: boolean
    twitter?: boolean
    linkedin?: boolean
  }

  // Role-specific data
  // Influencer data
  niche?: string
  interests?: string[]
  socialMediaProfiles?: {
    platform: string
    handle: string
    url: string
    followers: number
  }[]

  // Campaign Manager data
  associatedCompany?: string
  level?: string

  // OTP verification
  otp?: string
}

export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("INITIAL")
  const [userData, setUserData] = useState<SignUpUserData>({
    email: "",
    password: "",
    accountType: "INFLUENCER",
    username: "",
    status: "ACTIVE",
    socialMediaProfiles: [],
  })
  const router = useRouter()

  // Handle the initial sign-up form submission
  const handleInitialSubmit = async (data: {
    email: string
    password: string
    accountType: "INFLUENCER" | "CAMPAIGN_MANAGER"
  }) => {
    try {
      // In a real app, you would call your API to create a user and send OTP
      console.log("Initial sign-up data:", data)

      // Update user data state
      setUserData({
        ...userData,
        email: data.email,
        password: data.password,
        accountType: data.accountType,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success toast
      toast.success(`We've sent a verification code to ${data.email}`)

      // Move to OTP verification step
      setCurrentStep("OTP_VERIFICATION")
    } catch (error) {
      console.error("Error in initial sign-up:", error)
      toast.error(`There was an error sending the verification code. Please try again.`)
    }
  }

  // Handle OTP verification
  const handleOtpVerify = async (otp: string) => {
    try {
      // In a real app, you would verify the OTP with your API
      console.log("Verifying OTP:", otp)

      // Update user data with OTP
      setUserData({
        ...userData,
        otp,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success toast
      toast.success(`Your email has been successfully verified.`)

      // Move to account details step
      setCurrentStep("ACCOUNT_DETAILS")
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error(`The verification code is invalid or has expired. Please try again.`)
    }
  }

  // Handle account details submission
  const handleAccountDetailsSubmit = async (data: Partial<SignUpUserData>) => {
    try {
      const completeUserData = {
        ...userData,
        ...data,
      }

      // Format the data for the API
      const formattedUserData = {
        email: completeUserData.email,
        password: completeUserData.password,
        username: completeUserData.username,
        accountType: completeUserData.accountType,
        fullName: completeUserData.fullName,
        bio: completeUserData.bio,
        location: completeUserData.location,
        phone: completeUserData.phone,
        website: completeUserData.website,
        niche: completeUserData.accountType === "INFLUENCER" ? completeUserData.niche : undefined,
        interests: completeUserData.accountType === "INFLUENCER" ? completeUserData.interests : undefined,
        socialMediaProfiles: completeUserData.accountType === "INFLUENCER" ? completeUserData.socialMediaProfiles : undefined,
        associatedCompany: completeUserData.accountType === "CAMPAIGN_MANAGER" ? completeUserData.associatedCompany : undefined,
        level: completeUserData.accountType === "CAMPAIGN_MANAGER" ? completeUserData.level : undefined,
      }

      // Call the API to create the user
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedUserData),
      })

      if (!response.ok) {
        throw new Error("Failed to create user")
      }

      toast.success("Account created successfully!")
      setCurrentStep("SUCCESS")
    } catch (error) {
      console.error("Error completing sign-up:", error)
      toast.error("There was an error creating your account. Please try again.")
    }
  }

  // Handle redirection after successful sign-up
  const handleContinue = () => {
    router.push("/login")
  }

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case "INITIAL":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Enter your email and choose a password to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <InitialSignUpForm onSubmit={handleInitialSubmit} />
            </CardContent>
          </Card>
        )

      case "OTP_VERIFICATION":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Verify your email</CardTitle>
              <CardDescription>We've sent a verification code to {userData.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <OtpVerificationForm
                onVerify={handleOtpVerify}
                email={userData.email}
                onResendOtp={() => {
                  toast.success(`We've sent a new verification code to ${userData.email}`)
                }}
              />
            </CardContent>
          </Card>
        )

      case "ACCOUNT_DETAILS":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Complete your profile</CardTitle>
              <CardDescription>Tell us more about yourself to complete your account setup</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountDetailsForm accountType={userData.accountType} onSubmit={handleAccountDetailsSubmit} />
            </CardContent>
          </Card>
        )

      case "SUCCESS":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account created successfully!</CardTitle>
              <CardDescription>Your account has been created and is ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpSuccess onContinue={handleContinue} />
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gradient-to-b dark:from-purple-900 dark:to-purple-800">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2 text-purple-600 dark:text-purple-400">Create your account</h1>
          <p className="text-purple-600 dark:text-purple-400">Join our platform and start connecting</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "INITIAL" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"}`}
            >
              1
            </div>
            <span className="text-xs mt-1 text-purple-600 dark:text-purple-400">Sign Up</span>
          </div>
          <div className="flex-1 flex items-center mx-2">
            <div className={`h-1 w-full ${currentStep !== "INITIAL" ? "bg-purple-600" : "bg-purple-100"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "OTP_VERIFICATION" ? "bg-purple-600 text-white" : currentStep === "INITIAL" ? "bg-purple-100 text-purple-600" : "bg-purple-600 text-white"}`}
            >
              2
            </div>
            <span className="text-xs mt-1 text-purple-600 dark:text-purple-400">Verify</span>
          </div>
          <div className="flex-1 flex items-center mx-2">
            <div
              className={`h-1 w-full ${currentStep === "ACCOUNT_DETAILS" || currentStep === "SUCCESS" ? "bg-purple-600" : "bg-purple-100"}`}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "ACCOUNT_DETAILS" ? "bg-purple-600 text-white" : currentStep === "SUCCESS" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"}`}
            >
              3
            </div>
            <span className="text-xs mt-1 text-purple-600 dark:text-purple-400">Details</span>
          </div>
          <div className="flex-1 flex items-center mx-2">
            <div className={`h-1 w-full ${currentStep === "SUCCESS" ? "bg-purple-600" : "bg-purple-100"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "SUCCESS" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"}`}
            >
              4
            </div>
            <span className="text-xs mt-1 text-purple-600 dark:text-purple-400">Done</span>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}