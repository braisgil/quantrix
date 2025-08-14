import Link from "next/link";
import { Check, Zap, Crown, Shield, Sparkles, Rocket, Bot, MessageSquare, FolderOpen } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const POLAR_INNER_CIRCLE_URL = process.env.POLAR_CHECKOUT_URL_INNER_CIRCLE ?? "";
const POLAR_SOCIAL_URL = process.env.POLAR_CHECKOUT_URL_SOCIAL ?? "";
const POLAR_CUSTOMER_PORTAL_URL = process.env.POLAR_CUSTOMER_PORTAL_URL ?? "";

const tiers = [
  {
    id: "free",
    name: "Free",
    tagline: "Get started and explore Quantrix",
    price: "$0",
    cta: { label: "Current plan", href: "/overview", disabled: false, variant: "outline" as const },
    highlight: false,
    icon: Sparkles,
    limits: { agents: 1, sessions: 1, conversations: 3 },
  },
  {
    id: "inner-circle",
    name: "Inner Circle",
    tagline: "Level up your personal workflow",
    price: "",
    priceNote: "Flexible pricing via Polar",
    cta: { label: "Upgrade with Polar", href: POLAR_INNER_CIRCLE_URL || "#", disabled: !POLAR_INNER_CIRCLE_URL, variant: "view" as const },
    highlight: true,
    icon: Crown,
    limits: { agents: 3, sessions: 3, conversations: 10 },
  },
  {
    id: "social",
    name: "Social",
    tagline: "Teams and power users",
    price: "",
    priceNote: "Flexible pricing via Polar",
    cta: { label: "Upgrade with Polar", href: POLAR_SOCIAL_URL || "#", disabled: !POLAR_SOCIAL_URL, variant: "call" as const },
    highlight: false,
    icon: Rocket,
    limits: { agents: 10, sessions: 10, conversations: 30 },
  },
];

export default function UpgradePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="relative overflow-hidden rounded-xl border matrix-border bg-background/70 p-8 md:p-10 matrix-glow">
        <div className="absolute -inset-40 -z-10 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 blur-3xl" />
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="size-4 text-primary" />
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary">Premium</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Unlock Quantrix Premium</h1>
            <p className="text-muted-foreground max-w-2xl">
              Upgrade to increase your limits and access a smoother experience. Payments are handled securely by Polar.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Shield className="size-4" /> Merchant of Record by Polar</div>
              <div className="flex items-center gap-2"><Crown className="size-4" /> Flexible subscriptions</div>
            </div>
          </div>
          {POLAR_CUSTOMER_PORTAL_URL && (
            <Button asChild variant="outline" className="h-10 matrix-border">
              <Link href={POLAR_CUSTOMER_PORTAL_URL}>Manage subscription</Link>
            </Button>
          )}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} className={`relative ${tier.highlight ? "matrix-glow" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <tier.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                </div>
                {tier.highlight && (
                  <Badge className="bg-primary text-primary-foreground">Most popular</Badge>
                )}
              </div>
              <CardDescription>{tier.tagline}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">{tier.price || ""}</span>
                  {tier.priceNote && (
                    <span className="text-xs text-muted-foreground">{tier.priceNote}</span>
                  )}
                </div>

                <Separator className="bg-primary/20" />

                <ul className="space-y-3">
                  <Feature label={`${tier.limits.agents} agents`} icon={Bot} />
                  <Feature label={`${tier.limits.sessions} sessions`} icon={FolderOpen} />
                  <Feature label={`${tier.limits.conversations} conversations`} icon={MessageSquare} />
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              {tier.id === "free" ? (
                <Button asChild variant={tier.cta.variant} className="w-full">
                  <Link href={tier.cta.href}>{tier.cta.label}</Link>
                </Button>
              ) : (
                <Button asChild variant={tier.cta.variant} className="w-full" disabled={tier.cta.disabled}>
                  {/* If checkout URL isn't configured yet, keep the button disabled */}
                  <Link href={tier.cta.href} prefetch={false}>
                    {tier.cta.disabled ? "Checkout link not configured" : tier.cta.label}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="rounded-xl border matrix-border bg-background/70 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">How Polar works here</h2>
            <p className="text-sm text-muted-foreground">Payments, taxes, and invoices are handled by Polar. You will be redirected to a secure checkout.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Need a different plan?</span>
            <Button asChild variant="link" className="px-0">
              <Link href="/overview">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <li className="flex items-center gap-3">
      <div className="rounded-md bg-primary/10 p-1.5">
        <Check className="size-3.5 text-primary" />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Icon className="size-4 text-muted-foreground" />
        <span>{label}</span>
      </div>
    </li>
  );
}

 
