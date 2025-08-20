"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const UpgradeFooter = () => {
  return (
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
  );
};
