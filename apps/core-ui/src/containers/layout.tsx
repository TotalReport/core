import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable.js";
import { cn } from "../lib/utils.js";
import { ChartLine, ListChecks, Rocket, Settings } from "lucide-react";
import { Nav } from "../components/navigation/side-navigation.js";
import { TooltipProvider } from "../components/ui/tooltip.js";

interface LayoutProps {
  navCollapsedSize?: number;
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  children?: React.ReactNode;
}

export const Layout = ({
  children,
  defaultLayout = [20],
  defaultCollapsed = true,
  navCollapsedSize = 3,
}: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border items-stretch"
      >        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onResize={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Launches",
                icon: Rocket,
                href: "/launches",
              },
              {
                title: "Tests",
                icon: ListChecks,
                href: "/tests",
              },
            ]}
            bottomLinks={[
              {
                title: "Settings",
                icon: Settings,
                href: "/settings",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};
