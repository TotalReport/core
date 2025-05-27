"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { CollapsibleButton } from "@/components/ui/collapsible-button";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    active?: boolean;
    href?: string;
  }[];
  bottomLinks?: {
    title: string;
    label?: string;
    icon: LucideIcon;
    active?: boolean;
    href?: string;
  }[];
}

export const Nav = ({ links, bottomLinks, isCollapsed }: NavProps) => {
  const [currentLinks, setCurrentLinks] = useState(links);
  const [currentBottomLinks, setCurrentBottomLinks] = useState(bottomLinks);
  const pathname = usePathname(); // Use Next.js pathname hook to detect route changes

  // Update active state based on current URL
  useEffect(() => {
    // Extract the first segment of the path (e.g., "/tests/123" -> "tests")
    const currentSection = pathname.split("/")[1] || "";

    // Update links with active state based on pathname
    const updatedLinks = links.map((link) => {
      // Extract the first segment from href (e.g., "/reports" -> "reports")
      const linkSection = (link.href || "").split("/")[1] || "";

      return {
        ...link,
        active: linkSection === currentSection,
      };
    });

    setCurrentLinks(updatedLinks);

    // Update bottom links if they exist
    if (bottomLinks) {
      const updatedBottomLinks = bottomLinks.map((link) => {
        const linkSection = (link.href || "").split("/")[1] || "";

        return {
          ...link,
          active: linkSection === currentSection,
        };
      });
      setCurrentBottomLinks(updatedBottomLinks);
    }
  }, [pathname, links, bottomLinks]); // Re-run effect when pathname changes

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col h-full py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1.5 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 group-[[data-collapsed=true]]:gap-1.5">
        {currentLinks.map((link, index) => (
          <CollapsibleButton
            key={index}
            isCollapsed={isCollapsed}
            title={link.title}
            icon={link.icon}
            label={link.label}
            isActive={link.active}
            href={link.href || "#"}
            tooltipSide="right"
          />
        ))}
      </nav>

      {currentBottomLinks && (
        <nav className="mt-auto grid gap-1.5 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 group-[[data-collapsed=true]]:gap-1.5">
          <div>
            <ModeToggle isCollapsed={isCollapsed} />
          </div>
          {currentBottomLinks.map((link, index) => (
            <CollapsibleButton
              key={index}
              isCollapsed={isCollapsed}
              title={link.title}
              icon={link.icon}
              label={link.label}
              isActive={link.active}
              href={link.href || "#"}
              tooltipSide="right"
            />
          ))}
        </nav>
      )}
    </div>
  );
};
