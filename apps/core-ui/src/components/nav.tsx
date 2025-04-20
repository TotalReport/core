import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-4 px-0 justify-items-center w-max">
        {links.map((link, index) => (
          <div key={index} className="flex flex-col items-center">
            <Link
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: "icon" }),
                "flex items-center"
              )}
            >
              <link.icon className="h-6 w-6" />
            </Link>
            <span className="text-xs mt-1">{link.title}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}