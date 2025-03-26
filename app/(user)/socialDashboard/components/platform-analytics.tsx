"use client"

import { type JSX, useEffect, useState, useCallback } from "react"
import { Facebook, Instagram, Linkedin, Twitter, Youtube, TwitterIcon as TikTok, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleBarChart } from "./chart"
import type { SocialPlatform, PlatformAnalyticsData } from "@/lib/types"
import { fetchPlatformAnalytics, fetchComparisonData } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function PlatformAnalytics() {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all")
  const [platformData, setPlatformData] = useState<Record<string, PlatformAnalyticsData | null>>({})
  const [comparisonData, setComparisonData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedPlatforms, setLoadedPlatforms] = useState<Set<string>>(new Set())

  // Platform information
  const platformInfo = {
    facebook: {
      icon: <Facebook className="h-5 w-5 text-blue-600" />,
      name: "Facebook",
      color: "#4267B2",
    },
    instagram: {
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
      name: "Instagram",
      color: "#E1306C",
    },
    linkedin: {
      icon: <Linkedin className="h-5 w-5 text-blue-700" />,
      name: "LinkedIn",
      color: "#0077B5",
    },

    youtube: {
      icon: <Youtube className="h-5 w-5 text-red-600" />,
      name: "YouTube",
      color: "#FF0000",
    },
    tiktok: {
      icon: <TikTok className="h-5 w-5 text-black" />,
      name: "TikTok",
      color: "#000000",
    },
  }

  const platformsList = Object.keys(platformInfo) as SocialPlatform[]

  // Load comparison data only once when component mounts
  useEffect(() => {
    const loadComparisonData = async () => {
      if (comparisonData !== null) return

      try {
        setLoading(true)
        const data = await fetchComparisonData()
        setComparisonData(data)
      } catch (err) {
        setError("Failed to load comparison data")
        console.error("Error loading comparison data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadComparisonData()
  }, [comparisonData])

  // Load data for the selected platform
  useEffect(() => {
    const loadPlatformData = async () => {
      if (selectedPlatform === "all" || loadedPlatforms.has(selectedPlatform)) {
        return
      }

      try {
        setLoading(true)
        const data = await fetchPlatformAnalytics(selectedPlatform)

        setPlatformData((prev) => ({
          ...prev,
          [selectedPlatform]: data ?? null,
        }))

        setLoadedPlatforms((prev) => {
          const newSet = new Set(prev)
          newSet.add(selectedPlatform)
          return newSet
        })
      } catch (err) {
        console.error(`Error loading ${selectedPlatform} analytics:`, err)
        // Don't set error state here to avoid UI disruption
      } finally {
        setLoading(false)
      }
    }

    loadPlatformData()
  }, [selectedPlatform, loadedPlatforms])

  // Memoized function to load platform data
  const loadPlatformData = useCallback(
    async (platform: SocialPlatform) => {
      if (loadedPlatforms.has(platform)) return

      try {
        const data = await fetchPlatformAnalytics(platform)
        setPlatformData((prev) => ({
          ...prev,
          [platform]: data ?? null,
        }))

        setLoadedPlatforms((prev) => {
          const newSet = new Set(prev)
          newSet.add(platform)
          return newSet
        })
      } catch (err) {
        console.error(`Error loading ${platform} analytics:`, err)
        // Set platform data to null to indicate it failed to load
        setPlatformData((prev) => ({
          ...prev,
          [platform]: null,
        }))
      }
    },
    [loadedPlatforms],
  )

  if (loading && !comparisonData && selectedPlatform === "all") {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Platform Analytics</CardTitle>
            <CardDescription>Detailed analytics for each of your connected social platforms.</CardDescription>
          </div>
          <Tabs
            value={selectedPlatform}
            onValueChange={(value) => setSelectedPlatform(value as SocialPlatform | "all")}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {platformsList.map((p) => (
                <TabsTrigger key={p} value={p} className="flex items-center gap-1">
                  {platformInfo[p].icon}
                  <span className="hidden sm:inline">{platformInfo[p].name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {selectedPlatform === "all" ? (
            <>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {platformsList.map((p) => (
                  <PlatformCard
                    key={p}
                    platform={p}
                    icon={platformInfo[p].icon}
                    name={platformInfo[p].name}
                    data={platformData[p]}
                    onLoadData={() => loadPlatformData(p)}
                    isLoaded={loadedPlatforms.has(p)}
                  />
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Post Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  {comparisonData ? (
                    <SimpleBarChart
                      data={comparisonData}
                      height={300}
                      xAxisKey="name"
                      series={platformsList
                        .filter((p) => loadedPlatforms.has(p) && platformData[p] !== null)
                        .map((p) => ({
                          key: p,
                          name: platformInfo[p].name,
                          color: platformInfo[p].color,
                        }))}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <SinglePlatformAnalytics
              platform={selectedPlatform}
              data={platformData[selectedPlatform]}
              color={platformInfo[selectedPlatform].color}
              icon={platformInfo[selectedPlatform].icon}
              loading={loading && !loadedPlatforms.has(selectedPlatform)}
              onLoadData={() => loadPlatformData(selectedPlatform)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PlatformCard({
  platform,
  icon,
  name,
  data,
  onLoadData,
  isLoaded,
}: {
  platform: SocialPlatform
  icon: JSX.Element
  name: string
  data: PlatformAnalyticsData | null | undefined
  onLoadData: () => void
  isLoaded: boolean
}) {
  // Only load data once when the component mounts
  useEffect(() => {
    if (!isLoaded) {
      onLoadData()
    }
  }, [isLoaded, onLoadData])

  // Loading state
  if (!isLoaded) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  // Not connected state
  if (data === null) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-600 text-sm">Connect your {name} account to see analytics.</p>
        </CardContent>
      </Card>
    )
  }

  // Connected state with data
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Followers</p>
            <p className="text-lg font-bold">{data?.metrics.followers || "0"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="text-lg font-bold">{data?.metrics.engagement || "0%"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Posts</p>
            <p className="text-lg font-bold">{data?.metrics.posts || "0"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reach</p>
            <p className="text-lg font-bold">{data?.metrics.reach || "0"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SinglePlatformAnalytics({
  platform,
  data,
  color,
  icon,
  loading,
  onLoadData,
}: {
  platform: SocialPlatform
  data: PlatformAnalyticsData | null | undefined
  color: string
  icon: JSX.Element
  loading: boolean
  onLoadData: () => void
}) {
  useEffect(() => {
    if (data === undefined && !loading) {
      onLoadData()
    }
  }, [data, loading, onLoadData])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show "Connect Account" prompt if data is null (account not connected)
  if (data === null) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium text-gray-600">
          Connect your {platform.charAt(0).toUpperCase() + platform.slice(1)} account to see analytics.
        </p>
        <Button className="mt-4" onClick={() => alert(`Redirecting to connect ${platform} account...`)}>
          Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Followers</p>
          <p className="text-2xl font-bold">{data.metrics.followers}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
          <p className="text-2xl font-bold">{data.metrics.engagement}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold">{data.metrics.posts}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
          <p className="text-2xl font-bold">{data.metrics.reach}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Post Performance (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleBarChart
            data={data.postPerformance}
            height={300}
            xAxisKey="name"
            series={[{ key: "value", name: "Engagement", color: color }]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topContent.map((content) => (
                <div key={content.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">{icon}</div>
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {content.likes} likes • {content.comments} comments
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Age Groups</p>
                <div className="mt-2 space-y-2">
                  {data.demographics.ageGroups.map((age) => (
                    <div key={age.range} className="flex items-center gap-2">
                      <div className="text-xs w-10">{age.range}</div>
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${age.percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      <div className="text-xs">{age.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Gender</p>
                <div className="mt-2 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm">Male ({data.demographics.gender.male}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#9CA3AF" }} />
                    <span className="text-sm">Female ({data.demographics.gender.female}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

