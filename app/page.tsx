import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-xl font-bold">SocialDash</div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 space-y-8 md:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Manage your social presence in one place
            </h1>
            <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
              Connect your Facebook and Instagram accounts to analyze performance, track engagement, and grow your
              audience.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

