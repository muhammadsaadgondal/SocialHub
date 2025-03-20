import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"

export default function FacebookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facebook Integration</h1>
        <p className="text-muted-foreground">Connect and manage your Facebook account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect Facebook</CardTitle>
          <CardDescription>Link your Facebook account to view analytics and manage your page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Facebook className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Facebook Account</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Connect your Facebook account to view insights, post content, and manage your page
            </p>
            <Button>
              <Facebook className="mr-2 h-4 w-4" />
              Connect Facebook
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
          <CardTitle>What you can do with Facebook integration</CardTitle>
          <CardDescription>Features available after connecting your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Track page views, engagement, and audience demographics</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Schedule Posts</h3>
              <p className="text-sm text-muted-foreground">Create and schedule posts directly from the dashboard</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Manage Comments</h3>
              <p className="text-sm text-muted-foreground">View and respond to comments on your posts</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Audience Insights</h3>
              <p className="text-sm text-muted-foreground">Understand your audience with detailed demographic data</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Performance Reports</h3>
              <p className="text-sm text-muted-foreground">Generate detailed reports on your page performance</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Ad Management</h3>
              <p className="text-sm text-muted-foreground">View and manage your Facebook ad campaigns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

