import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { AuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import LinkedInProvider from "next-auth/providers/linkedin";
import InstagramProvider from "next-auth/providers/instagram";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { saveSocialAccount } from "@/lib/saveSocialMediaAccount";
import { Braces } from "lucide-react";

export const authOptions: AuthOptions = {
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          // Connect to MongoDB
          await connectDB();

          // Find the user by email
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("User not found");
          }

          // Compare the password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Return the user object (without the password)
          return { ...user.toObject(), password: undefined };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),

    // Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "public_profile,email",
        },
      },
    }),
    FacebookProvider({
      id: "facebook-dashboard", // Unique ID for dashboard flow
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email,public_profile,pages_show_list,pages_manage_posts,pages_read_engagement,pages_manage_engagement,pages_read_user_content,instagram_manage_insights,business_management", // Additional scopes for dashboard
        },
      },
    }),
    GoogleProvider({
      id: "youtube-dashboard", // Unique ID for dashboard flow
      clientId: process.env.YOUTUBE_CLIENT_ID!,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly", // Additional scopes for dashboard
        },
      },
    }),
    TwitterProvider({
      id: "twitter-dashboard",
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      id: "linkedin-dashboard",
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        switch (account?.provider) {
          case "google":
          case "facebook":
            await connectDB();
            // Find the user by email
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
              // Update the existing user with provider information (if not already set)
              if (!existingUser.provider) {
                existingUser.provider = account.provider;
                existingUser.providerId = account.providerAccountId;
                await existingUser.save();
              }

              // Return the existing user
              user.id = existingUser._id;
              user.username = existingUser.username;
              user.accountType = existingUser.accountType;
            } else {
              // Create a new user for third-party sign-in
              const newUser = new User({
                email: user.email!,
                username: user.email!.split("@")[0] || user.name,
                accountType: "INFLUENCER", // Default role for third-party sign-in
                status: "ACTIVE",
                provider: account.provider, // Store the provider
                providerId: account.providerAccountId, // Store the provider ID
              });

              // Save the new user
              await newUser.save();

              // Return the new user
              user.id = newUser._id;
              user.username = newUser.username;
              user.accountType = newUser.accountType;
            }
            break;

          case "facebook-dashboard":
          case "twitter-dashboard":
          case "google-dashboard":
          case "linkedin-dashboard":
          case "instagram-dashboard":
            console.log("ACCOUNT DATA: ", account)
            if (account.access_token) {
              await saveSocialAccount(user.id, account.provider, account.access_token);
            } else {
              throw new Error("Access token is undefined");
            }
            // Redirect to the test page after saving
            return "/authTest";
            break;

          default:
            return false; // Block sign-in for unsupported platforms
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Block sign-in
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.accountType = user.accountType;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username;
      session.user.accountType = token.accountType;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
  },

  secret: process.env.NEXTAUTH_SECRET!,
};


