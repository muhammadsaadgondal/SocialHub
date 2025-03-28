"use client";

import { useEffect, useState } from "react";
import { SocialAccountsList } from "./social-accounts-list";
import { ConnectAccountButton } from "./connect-account-button";
import { AnalyticsOverview } from "./analytics-overview";
import { PlatformAnalytics } from "./platform-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { fetchSocialAccounts, fetchOverviewAnalytics, refreshSocialData } from "@/lib/api";
import type { SocialAccount, OverviewAnalytics } from "@/lib/types"; // Ensure this matches the updated type
import toast from "react-hot-toast";

// Update the OverviewAnalytics type to reflect the change from shares to posts
interface Metric {
  title: string;
  value: string;
  trend: "up" | "down";
  change: string;
}

interface UpdatedOverviewAnalytics {
  metrics: {
    followers: Metric;
    engagement: Metric;
    posts: Metric; // Changed from shares to posts
    impressions: Metric;
  };
  audienceGrowth: Array<{ name: string; [platform: string]: number | string }>;
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [overview, setOverview] = useState<UpdatedOverviewAnalytics | null>(null); // Updated type
  const [loading, setLoading] = useState({ accounts: false, analytics: false });
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading((prev) => ({ ...prev, accounts: true }));
      const accountsData = await fetchSocialAccounts();
      setAccounts(accountsData);
    } catch (err) {
      setError("Failed to load social accounts");
      console.error("Error loading accounts:", err);
    } finally {
      setLoading((prev) => ({ ...prev, accounts: false }));
    }

    try {
      setLoading((prev) => ({ ...prev, analytics: true }));
      const overviewData = await fetchOverviewAnalytics();
      setOverview(overviewData ?? null);
    } catch (err) {
      setError("Failed to load analytics overview");
      console.error("Error loading analytics:", err);
    } finally {
      setLoading((prev) => ({ ...prev, analytics: false }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshSocialData();
      await loadData();
      toast.success("Social media data refreshed successfully");
    } catch (err) {
      toast.error("Failed to refresh social media data");
      console.error("Error refreshing data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const isLoading = loading.accounts || loading.analytics;

  return (
    <div className="w-full min-h-screen">
      <main className="w-full px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-full space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Social Dashboard</h1>
              <p className="text-muted-foreground">Manage your social media accounts and analytics.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing || accounts.length === 0}>
                {refreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh Data
              </Button>
              <ConnectAccountButton
                accounts={accounts}
                onAccountConnected={(newAccount) => setAccounts([...accounts, newAccount])}
              />
            </div>
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
              ) : accounts.length === 0 ? (
                <Alert>
                  <AlertDescription>Connect at least one social media account to view analytics.</AlertDescription>
                </Alert>
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
  );
}