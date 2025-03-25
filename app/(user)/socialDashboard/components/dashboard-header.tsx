import { UserButton } from "./user-button"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-xl font-semibold">Social Media Dashboard</h1>
      </div>
      <UserButton />
    </header>
  )
}

