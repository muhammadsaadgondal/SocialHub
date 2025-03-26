"use client"

import { ArrowDown, ArrowUp, Users, MessageSquare, Share2, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleLineChart } from "./chart"
import type { OverviewAnalytics, MetricCard } from "@/lib/types"

interface AnalyticsOverviewProps {
  overview: OverviewAnalytics | null
}

export function AnalyticsOverview({ overview }: AnalyticsOverviewProps) {
  if (!overview) {
    return null
  }

  const metrics = [
    overview.metrics.followers,
    overview.metrics.engagement,
    overview.metrics.shares,
    overview.metrics.impressions,
  ]

  const getIcon = (metric: MetricCard) => {
    switch (metric.title) {
      case "Total Followers":
        return Users
      case "Engagement Rate":
        return MessageSquare
      case "Total Shares":
        return Share2
      case "Total Impressions":
        return Eye
      default:
        return Users
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = getIcon(metric)
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.trend === "up" ? "text-green-500" : "text-red-500"} flex items-center`}>
                  {metric.trend === "up" ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audience Growth</CardTitle>
          <CardDescription>Follower growth across all your connected platforms over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleLineChart
            data={overview.audienceGrowth}
            height={300}
            xAxisKey="name"
            series={[
              { key: "facebook", name: "Facebook", color: "#4267B2" },
              { key: "instagram", name: "Instagram", color: "#E1306C" },
              { key: "linkedin", name: "LinkedIn", color: "#0077B5" },
              { key: "twitter", name: "Twitter", color: "#1DA1F2" },
              { key: "youtube", name: "YouTube", color: "#FF0000" },
              { key: "tiktok", name: "TikTok", color: "#000000" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

