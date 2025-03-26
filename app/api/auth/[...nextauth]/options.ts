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
import {connectDB} from "@/lib/api";
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
      id: 'youtube-dashboard', 
      clientId: process.env.YOUTUBE_CLIENT_ID || '',
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
          prompt: 'consent', 
        },
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
      async signIn({ user, account, profile }) {
        try {
          await connectDB();
    
          switch (account?.provider) {
            case "google":
            case "facebook":
            case "facebook-dashboard":
            case "youtube-dashboard":
              // Find or create user based on the provider's account ID
              let existingUser = await User.findOne({ 
                providerId: account.providerAccountId 
              });
    
              if (!existingUser) {
                // Create a new user if not exists
                existingUser = new User({
                  email: user.email || `${account.providerAccountId}@${account.provider}.com`,
                  username: user.name || user.email?.split('@')[0] || account.providerAccountId,
                  accountType: "INFLUENCER",
                  status: "ACTIVE",
                  provider: account.provider,
                  providerId: account.providerAccountId
                });
    
                await existingUser.save();
              }
    
              // Explicitly set user details
              user.id = existingUser._id.toString();
              user.username = existingUser.username;
              user.accountType = existingUser.accountType;
    
              // Handle social media account saving for dashboard providers
              if (account.provider === "facebook-dashboard" || account.provider === "youtube-dashboard") {
                console.log("ACCOUNT DATA: ", account);
                console.log("USER OBJECT BEFORE SAVE: ", user);
                
                if (account.access_token) {
                  // Use the user's MongoDB _id, not the provider's account ID
                  const userIdToSave = existingUser._id.toString();
                  console.log("Passing userID as string:", userIdToSave);
                  
                  await saveSocialAccount( account.provider, account.access_token);
                } else {
                  throw new Error("Access token is undefined");
                }
                
                return "/socialDashboard";
              }
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


