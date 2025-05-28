"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { ButtonProps, Button, buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CollapsibleButtonProps extends Omit<ButtonProps, 'children'> {
  icon: LucideIcon
  title: string
  label?: string
  isCollapsed?: boolean
  tooltipSide?: "top" | "right" | "bottom" | "left"
  isActive?: boolean
  href?: string
  children?: React.ReactNode | ((props: { icon: React.ReactNode }) => React.ReactNode)
}

export function CollapsibleButton({
  icon: Icon,
  title,
  label,
  isCollapsed = false,
  tooltipSide = "right",
  isActive = false,
  href,
  className,
  variant = "ghost",
  onClick,
  children,
  ...props
}: CollapsibleButtonProps) {
  
  // Common button configuration for buttonVariants
  const buttonConfigVariants = {
    variant: isActive ? "default" : variant,
    size: isCollapsed ? "icon" as const : "sm" as const,
    className: cn(
      isCollapsed ? "h-8 w-8" : "justify-start w-full h-8",
      isActive === true && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
      className
    )
  }
  
  // Separate config for Button props
  const buttonProps: ButtonProps = {
    variant: isActive ? "default" : variant,
    size: isCollapsed ? "icon" : "sm",
    className: cn(
      isCollapsed ? "h-8 w-8" : "justify-start w-full h-8",
      isActive === true && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
      className
    ),
    onClick,
    ...props
  }

  // Common content for expanded button (or tooltip content)
  const contentDisplay = (
    <>
      {title}
      {label && (
        <span className={cn(
          "ml-auto", 
          isActive === true && !isCollapsed && "text-background dark:text-white",
          isCollapsed && "text-muted-foreground"
        )}>
          {label}
        </span>
      )}
    </>
  )

  // Render the button based on collapsed state
  const renderButton = () => {
    // If an href is provided, use an anchor tag
    if (href) {
      return (
        <a 
          href={href} 
          className={cn(
            buttonVariants(buttonConfigVariants)
          )}
        >
          {isCollapsed ? (
            <Icon className="h-3.5 w-3.5" aria-hidden="false" />
          ) : (
            <>
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              {contentDisplay}
            </>
          )}
          {isCollapsed && <span className="sr-only">{title}</span>}
        </a>
      );
    }

    // Regular button implementation
    return (
      <Button {...buttonProps}>
        {isCollapsed ? (
          <>
            <Icon className="h-3.5 w-3.5" />
            <span className="sr-only">{title}</span>
          </>
        ) : (
          <>
            {typeof children === 'function' ? (
              (children as (props: { icon: React.ReactNode }) => React.ReactNode)({ 
                icon: <Icon className="mr-2 h-4 w-4" /> 
              })
            ) : (
                <div className="flex items-center">
                  {children || (
                    <>
                      <Icon className="mr-2 h-4 w-4" />
                      {contentDisplay}
                    </>
                  )}
                </div>
            )}
          </>
        )}
      </Button>
    );
  };

  // Wrap in tooltip if collapsed
  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {renderButton()}
        </TooltipTrigger>
        <TooltipContent side={tooltipSide} className="flex items-center gap-4">
          {contentDisplay}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Return regular button if not collapsed
  return renderButton();
}
