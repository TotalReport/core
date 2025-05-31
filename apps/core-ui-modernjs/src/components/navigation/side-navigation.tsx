import React from "react";
import { Link } from "@modern-js/runtime/router";
import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.js";
import { cn } from "../../lib/utils.js";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href: string;
  }[];
  bottomLinks?: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href: string;
  }[];
}

export function Nav({ links, bottomLinks, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 h-full data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <NavItem key={index} link={link} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {bottomLinks && bottomLinks.length > 0 && (
        <nav className="mt-auto grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {bottomLinks.map((link, index) => (
            <NavItem key={index} link={link} isCollapsed={isCollapsed} />
          ))}
        </nav>
      )}
    </div>
  );
}

interface NavItemProps {
  link: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href: string;
  };
  isCollapsed: boolean;
}

function NavItem({ link, isCollapsed }: NavItemProps) {
  const Icon = link.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant="ghost"
          className={cn(
            "gap-2 h-10 w-full justify-start text-base",
            isCollapsed && "flex h-10 w-10 justify-center p-0"
          )}
        >
          <Link to={link.href}>
            <Icon className="h-5 w-5" />
            {!isCollapsed && <span>{link.title}</span>}
            {!isCollapsed && link.label && (
              <span className="ml-auto text-muted-foreground text-sm py-0.5 px-1.5 rounded-md bg-muted">
                {link.label}
              </span>
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" sideOffset={12}>
          {link.title}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
