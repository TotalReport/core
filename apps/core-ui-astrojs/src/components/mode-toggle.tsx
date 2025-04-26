import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ModeToggleProps {
  isCollapsed?: boolean;
}

export function ModeToggle({ isCollapsed }: ModeToggleProps = {}) {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("theme-light");

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);
  
  // Common dropdown menu content for both collapsed and expanded views
  const dropdownMenuItems = (
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setThemeState("theme-light")}>
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setThemeState("dark")}>
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setThemeState("system")}>
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  // Collapsed view with tooltip
  if (isCollapsed) {
    return (
      <div className="">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              {dropdownMenuItems}
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            Theme
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  // Expanded view
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="justify-start w-full">
            <div className="flex items-center">
              <div className="relative mr-2 h-4 w-4">
                <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute top-0 left-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </div>
              <span className="ml-auto">Theme</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        {dropdownMenuItems}
      </DropdownMenu>
    </div>
  );
}
