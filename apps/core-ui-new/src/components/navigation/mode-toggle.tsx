"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  isCollapsed?: boolean;
}

export function ModeToggle({ isCollapsed }: ModeToggleProps = {}) {
  const { setTheme } = useTheme();

  // Common dropdown menu content for theme options
  const dropdownMenuItems = (
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => setTheme("light")}>
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {
            //TODO use collapsible button below
          }
          {isCollapsed ? (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <div className="relative h-4 w-4">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="false" />
                <Moon className="absolute top-0 left-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="false" />
              </div>
              <span className="sr-only">Toggle theme</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="justify-start w-full h-8"
            >
              <div className="flex items-center w-full">
                <div className="relative h-4 w-4">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
                  <Moon className="absolute top-0 left-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
                </div>
                <span className={cn("ml-4")}>Theme</span>
              </div>
            </Button>
          )}
        </DropdownMenuTrigger>
        {dropdownMenuItems}
      </DropdownMenu>
    </div>
  );
}
