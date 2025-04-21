import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { ChartLine, ListChecks, Rocket, Settings } from "lucide-react";
import React from "react";
import { Nav } from "./Nav";
import { TooltipProvider } from "./ui/tooltip";

interface LayoutProps {
  navCollapsedSize?: number;
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  children?: React.ReactNode;
}

export const Layout = ({
  defaultLayout = [20],
  defaultCollapsed = true, //FIXME this doesn't work
  navCollapsedSize = 3,
  children,
}: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border items-stretch"
      >
        <ResizablePanel
          defaultValue={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
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
                title: "Reports",
                icon: ChartLine,
                active: true,
              },
              {
                title: "Launches",
                icon: Rocket,
                active: false,
              },
              {
                title: "Tests",
                icon: ListChecks,
                active: false,
              },
            ]}
            bottomLinks={[
              {
                title: "Settings",
                icon: Settings,
                active: false,
              },
            ]}
          ></Nav>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};
