"use client";

import { ModeToggle } from "@/components/navigation/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="space-y-6 max-w-md">
        <div className="flex flex-col items-center">
          <div className="text-9xl font-bold text-primary mb-2">404</div>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
        </div>

        <p className="text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>

        <div className="pt-6 flex flex-col gap-3">
          <Button asChild>
            <Link href="/">Return to Dashboard</Link>
          </Button>

          <div className="flex items-center justify-center mt-4">
            <span className="mr-2 text-sm text-muted-foreground">
              Toggle theme:
            </span>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
