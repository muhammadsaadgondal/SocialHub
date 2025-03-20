import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/hooks/context/AuthProvider";
import { Toaster } from 'react-hot-toast';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Hub",
  description: "Collaboration platform for Businesses to connect with ideal Influencers to run their campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Toaster
            position="bottom-right"
            toastOptions={{
              // Common styles for all toasts
              style: {
                border: '1px solid #ccc',
                padding: '8px', // Reduced padding
                fontSize: '14px', // Adjust font size
                color: '#333',
                borderRadius: '8px', // Rounded corners for a modern look
              },
              // Success toast styles
              success: {
                icon: <CheckCircle size={16} color="green" />, // Add success icon
                style: {
                  background: '#e6ffed', // Light green background
                  color: 'green',
                },
              },
              // Error toast styles
              error: {
                icon: <XCircle size={16} color="red" />, // Add error icon
                style: {
                  background: '#ffe6e6', // Light red background
                  color: 'red',
                },
              },
            }}
          />
         
              {children}
           
        </body>
      </AuthProvider>
    </html>
  );
}
