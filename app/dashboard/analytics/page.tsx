import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Instagram } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">View detailed analytics for your social media accounts</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="facebook">
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram">
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Facebook: 8,123</span>
                  <span>•</span>
                  <span>Instagram: 4,111</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.3%</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Facebook: 3.8%</span>
                  <span>•</span>
                  <span>Instagram: 5.2%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Post Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.2K</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Facebook: 28.7K</span>
                  <span>•</span>
                  <span>Instagram: 16.5K</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">123.4K</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Facebook: 78.9K</span>
                  <span>•</span>
                  <span>Instagram: 44.5K</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Combined Performance</CardTitle>
              <CardDescription>Performance across all connected platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Combined analytics chart will appear here once you connect your accounts
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Facebook className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Facebook Analytics</CardTitle>
                <CardDescription>Detailed analytics for your Facebook page</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Facebook analytics will appear here once you connect your account
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instagram" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center gap-4">
              <div className="bg-pink-100 p-2 rounded-full">
                <Instagram className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <CardTitle>Instagram Analytics</CardTitle>
                <CardDescription>Detailed analytics for your Instagram profile</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Instagram analytics will appear here once you connect your account
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

