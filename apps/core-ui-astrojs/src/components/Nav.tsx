import type { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";

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

  // Update active state based on current URL
  useEffect(() => {
    const updateActiveLinks = () => {
      // Get the current pathname
      const pathname = window.location.pathname;

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
    };

    // Update active state immediately
    updateActiveLinks();

    // Listen for URL changes
    window.addEventListener("urlchange", updateActiveLinks);
    window.addEventListener("popstate", updateActiveLinks);

    return () => {
      window.removeEventListener("urlchange", updateActiveLinks);
      window.removeEventListener("popstate", updateActiveLinks);
    };
  }, [links, bottomLinks]);

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col h-full py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {currentLinks.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <a
                  href={link.href || "#"}
                  className={cn(
                    buttonVariants({
                      variant: link.active ? "default" : "ghost",
                      size: "icon",
                    }),
                    "h-9 w-9",
                    link.active === true &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <a
              key={index}
              href={link.href || "#"}
              className={cn(
                buttonVariants({
                  variant: link.active ? "default" : "ghost",
                  size: "sm",
                }),
                link.active === true &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.active === true && "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </a>
          )
        )}
      </nav>

      {currentBottomLinks && (
        <nav className="mt-auto grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          <div>
            <ModeToggle isCollapsed={isCollapsed} />
          </div>
          {currentBottomLinks.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href={link.href || "#"}
                    className={cn(
                      buttonVariants({
                        variant: link.active ? "default" : "ghost",
                        size: "icon",
                      }),
                      "h-9 w-9",
                      link.active === true &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}
                  {link.label && (
                    <span className="ml-auto text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <a
                key={index}
                href={link.href || "#"}
                className={cn(
                  buttonVariants({
                    variant: link.active ? "default" : "ghost",
                    size: "sm",
                  }),
                  link.active === true &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start"
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.active === true && "text-background dark:text-white"
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </a>
            )
          )}
        </nav>
      )}
    </div>
  );
};
