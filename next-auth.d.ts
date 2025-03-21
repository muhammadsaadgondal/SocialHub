import "next-auth";
import { DefaultSession } from "next-auth";

// Extend the User and Session types from NextAuth
declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    accountType?: string; 
  }

  interface Session {
    user: User; // Use the extended User interface
  }
}

// Extend the JWT type to include accountType as well
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    accountType?: string; // Add accountType here as well
  }
}
