"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "./components/dashboard-header"
import { SocialAccountsList } from "./components/social-accounts-list"
import { ConnectAccountButton } from "./components/connect-account-button"
import { AnalyticsOverview } from "./components/analytics-overview"
import { PlatformAnalytics } from "./components/platform-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { fetchSocialAccounts, fetchOverviewAnalytics } from "@/lib/api"
import type { SocialAccount, OverviewAnalytics } from "@/lib/types"

export default function Dashboard() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [overview, setOverview] = useState<OverviewAnalytics | null>(null)
  const [loading, setLoading] = useState({ accounts: false, analytics: false })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading((prev) => ({ ...prev, accounts: true }))
        const accountsData = await fetchSocialAccounts()
        setAccounts(accountsData)
      } catch (err) {
        setError("Failed to load social accounts")
        console.error("Error loading accounts:", err)
      } finally {
        setLoading((prev) => ({ ...prev, accounts: false }))
      }

      try {
        setLoading((prev) => ({ ...prev, analytics: true }))
        const overviewData = await fetchOverviewAnalytics()
        setOverview(overviewData)
      } catch (err) {
        setError("Failed to load analytics overview")
        console.error("Error loading analytics:", err)
      } finally {
        setLoading((prev) => ({ ...prev, analytics: false }))
      }
    }

    loadData()
  }, [])

  const isLoading = loading.accounts || loading.analytics

  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Social Dashboard</h1>
              <p className="text-muted-foreground">Manage your social media accounts and analytics.</p>
            </div>
            <ConnectAccountButton
              accounts={accounts}
              onAccountConnected={(newAccount) => setAccounts([...accounts, newAccount])}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              {loading.analytics ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <AnalyticsOverview overview={overview} />
                  <PlatformAnalytics />
                </>
              )}
            </TabsContent>

            <TabsContent value="accounts">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>You can connect up to 5 social media accounts to your dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.accounts ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <SocialAccountsList
                      accounts={accounts}
                      onAccountDisconnected={(id) => setAccounts(accounts.filter((a) => a.id !== id))}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

