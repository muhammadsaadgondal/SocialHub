import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import type { AuthOptions } from "next-auth"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import connectDB from "@/lib/db"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          // Connect to MongoDB
          await connectDB()

          // Find the user by email
          const user = await User.findOne({ email: credentials.email })
          if (!user) {
            throw new Error("User not found")
          }

          // Compare the password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )
          if (!isValidPassword) {
            throw new Error("Invalid password")
          }

          // Return the user object (without the password)
          return { ...user.toObject(), password: undefined }
        } catch (error) {
          console.error("Error during authorization:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "public_profile,email",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if the user is signing in via third-party providers (Google/Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        // Connect to MongoDB
        await connectDB()

        // Find the user by email
        const existingUser = await User.findOne({ email: user.email })
        if (existingUser) {
          // Return the existing user
          user.id = existingUser._id
          user.username = existingUser.username
          user.accountType = existingUser.accountType
        } else {
          // Create a new user for third-party sign-in
          const newUser = new User({
            email: user.email!,
            username: user.name || user.email!.split("@")[0],
            accountType: "INFLUENCER", // Default role for third-party sign-in
            status: "ACTIVE",
          })

          // Save the new user
          await newUser.save()

          // Return the new user
          user.id = newUser._id
          user.username = newUser.username
          user.accountType = newUser.accountType
        }
      }

      return true // Allow sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.accountType = user.accountType
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.username = token.username
      session.user.accountType = token.accountType
      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  secret: process.env.NEXTAUTH_SECRET!,
}