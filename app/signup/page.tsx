"use client"
import { SignUpForm } from "@/components/auth/signup-form"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen w-full">
      {/* Image Container - 50% width */}
      <div className="relative hidden md:flex w-1/2 bg-gray-100">
        <Image
          width={1000}
          height={900}
          className="h-full w-full object-cover"
          src="/images/login/bg.png"
          alt="CoverLogin"
          priority
        />
        <div className="absolute w-4/5 bottom-8 left-1/2 transform -translate-x-1/2 bg-opacity-70 bg-gray-200 opacity-70 rounded-full flex items-center justify-between px-5 py-2 space-x-4">
          <span className="text-black font-semibold whitespace-nowrap">Already have an account?</span>
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-purple-600 font-bold py-2 px-5 rounded-full hover:bg-gray-100 transition duration-300 whitespace-nowrap"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Form Container - 50% width with centered content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        {/* Mobile-only sign-in button */}
        <div className="md:hidden w-full flex justify-center mb-6">
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <Link
              href="/login"
              className="inline-block bg-white border border-purple-600 text-purple-600 font-bold py-2 px-5 rounded-full hover:bg-gray-50 transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}

