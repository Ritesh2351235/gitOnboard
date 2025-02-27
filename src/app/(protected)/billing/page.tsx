"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { CreditCard, User, Zap } from "lucide-react"
import { UserProfile } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BillingPage() {
  const { user } = useUser()
  const { theme } = useTheme()

  // Mock data - replace with actual usage data from your backend
  const usage = {
    credits: 20,
    maxCredits: 50,
    plan: "Free",
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Billing & Usage
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and monitor your usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Card - Adjusted padding and width */}
        <div className={cn(
          "rounded-2xl md:rounded-3xl p-6",
          "border w-full max-w-3xl",
          "flex flex-col gap-1.5",
          "bg-brand-white dark:bg-brand-medium-black",
          "border-brand-neutrals-100 dark:border-brand-neutrals-800",
          "shadow-[0px_51px_20px_rgba(186,186,186,0.01),0px_29px_17px_rgba(186,186,186,0.05),0px_13px_13px_rgba(186,186,186,0.09),0px_3px_7px_rgba(186,186,186,0.1)]",
          "dark:shadow-none"
        )}>
          <div className="flex h-10 justify-between gap-2">
            <h2 className="pt-0.5 text-xl/[1.375rem] font-semibold -tracking-4 md:text-2xl/[1.875rem]">
              Basic Information
            </h2>
            <Avatar className="aspect-square size-10 rounded-full">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName || ''}
                className="aspect-square size-10 rounded-full"
              />
              <AvatarFallback className="text-sm">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm/[1.5rem] font-semibold -tracking-4 md:text-base/[1.125rem]">
                Name
              </p>
              <p className="whitespace-pre-line text-base/[1.5rem] text-brand-gray-400">
                {user?.fullName}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm/[1.5rem] font-semibold -tracking-4 md:text-base/[1.125rem]">
                Email
              </p>
              <p className="whitespace-pre-line text-base/[1.5rem] text-brand-gray-400">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Card */}
        <div className={cn(
          "rounded-2xl md:rounded-3xl p-6",
          "border w-full max-w-3xl",
          "flex flex-col gap-1.5",
          "bg-brand-white dark:bg-brand-medium-black",
          "border-brand-neutrals-100 dark:border-brand-neutrals-800",
          "shadow-[0px_51px_20px_rgba(186,186,186,0.01),0px_29px_17px_rgba(186,186,186,0.05),0px_13px_13px_rgba(186,186,186,0.09),0px_3px_7px_rgba(186,186,186,0.1)]",
          "dark:shadow-none"
        )}>
          <h2 className="pt-0.5 text-xl/[1.375rem] font-semibold -tracking-4 md:text-2xl/[1.875rem]">
            Usage
          </h2>

          <div className="flex flex-col gap-4">
            <div className={cn(
              "rounded-lg border p-4",
              "border-brand-borders dark:border-brand-neutrals-800",
              "bg-brand-background dark:bg-brand-medium-black"
            )}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="whitespace-pre-line text-base/[1.5rem] flex items-center gap-1 dark:text-white">
                    Available Credits
                  </span>
                  <span className="whitespace-pre-line font-mono text-sm/[0.875rem] tracking-4 md:text-sm/[1.25rem] dark:text-white">
                    20 / 50
                  </span>
                </div>
                <div className={cn(
                  "h-2 w-full overflow-hidden rounded-full",
                  "bg-brand-borders dark:bg-brand-neutrals-800"
                )}>
                  <div
                    className="h-full bg-brand-green-400"
                    style={{ width: '40%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <Card className={cn(
          "shadow-xl border-0 md:col-span-2",
          "bg-gradient-to-br",
          theme === "dark"
            ? "from-zinc-900/50 to-zinc-800/50 shadow-zinc-900/20"
            : "from-card to-muted shadow-zinc-200/20"
        )}>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5" />
              Subscription Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className={cn(
                "rounded-lg p-6",
                "border border-border",
                theme === "dark" ? "bg-zinc-900/50" : "bg-background/50"
              )}>
                <h3 className="text-lg font-semibold text-foreground">Free</h3>
                <p className="text-3xl font-bold mt-2 text-foreground">$0<span className="text-sm text-muted-foreground">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• 50 Credits per month</li>
                  <li>• Basic support</li>
                  <li>• Community access</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Current Plan</Button>
              </div>

              {/* Pro Plan */}
              <div className={cn(
                "rounded-lg p-6",
                "border border-border",
                theme === "dark" ? "bg-zinc-900/50" : "bg-background/50"
              )}>
                <h3 className="text-lg font-semibold text-foreground">Pro</h3>
                <p className="text-3xl font-bold mt-2 text-foreground">$19<span className="text-sm text-muted-foreground">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• 500 Credits per month</li>
                  <li>• Priority support</li>
                  <li>• Advanced features</li>
                </ul>
                <Button className="w-full mt-6">Upgrade to Pro</Button>
              </div>

              {/* Business Plan */}
              <div className={cn(
                "rounded-lg p-6",
                "border border-border",
                theme === "dark" ? "bg-zinc-900/50" : "bg-background/50"
              )}>
                <h3 className="text-lg font-semibold text-foreground">Business</h3>
                <p className="text-3xl font-bold mt-2 text-foreground">$49<span className="text-sm text-muted-foreground">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Unlimited Credits</li>
                  <li>• 24/7 support</li>
                  <li>• Custom features</li>
                </ul>
                <Button className="w-full mt-6">Upgrade to Business</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
