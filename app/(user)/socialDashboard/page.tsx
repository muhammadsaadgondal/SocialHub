import type { Metadata } from "next"
import Dashboard from "./components/dashboard"

export const metadata: Metadata = {
  title: "Social Media Dashboard",
  description: "Manage your social media accounts and view analytics in one place",
}

export default function DashboardPage() {
  return <Dashboard />
}

