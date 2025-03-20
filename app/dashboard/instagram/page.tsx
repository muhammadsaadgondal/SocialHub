import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"

export default function InstagramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instagram Integration</h1>
        <p className="text-muted-foreground">Connect and manage your Instagram account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect Instagram</CardTitle>
          <CardDescription>Link your Instagram account to view analytics and manage your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
              <Instagram className="h-10 w-10 text-pink-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Instagram Account</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Connect your Instagram account to view insights, post content, and manage your profile
            </p>
            <Button>
              <Instagram className="mr-2 h-4 w-4" />
              Connect Instagram
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>By connecting your account, you agree to our terms of service and privacy policy.</p>
            <p className="mt-2">We will only access the data necessary to provide analytics and management features.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What you can do with Instagram integration</CardTitle>
          <CardDescription>Features available after connecting your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">View Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track profile visits, engagement, and audience demographics
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Schedule Posts</h3>
              <p className="text-sm text-muted-foreground">
                Create and schedule Instagram posts directly from the dashboard
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Manage Comments</h3>
              <p className="text-sm text-muted-foreground">View and respond to comments on your posts</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Content Insights</h3>
              <p className="text-sm text-muted-foreground">Analyze which content performs best with your audience</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Hashtag Analytics</h3>
              <p className="text-sm text-muted-foreground">Track performance of hashtags and discover trending ones</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Story Management</h3>
              <p className="text-sm text-muted-foreground">Schedule and analyze performance of Instagram stories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

