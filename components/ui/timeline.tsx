// components/ui/timeline.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Types for variant and colors
type TimelineVariant = "default" | "secondary" | "destructive" | "outline";
type TimelineOrientation = "vertical" | "horizontal";

// Context for sharing props
interface TimelineContextProps {
  variant?: TimelineVariant;
  orientation?: TimelineOrientation;
}

const TimelineContext = React.createContext<TimelineContextProps>({
  variant: "default",
  orientation: "vertical",
});

const useTimeline = () => {
  const context = React.useContext(TimelineContext);
  if (!context) {
    throw new Error("Timeline components must be used within a Timeline");
  }
  return context;
};

// Root Timeline component
export interface TimelineProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: TimelineVariant;
  orientation?: TimelineOrientation;
}

const Timeline = React.forwardRef<HTMLUListElement, TimelineProps>(
  ({ className, variant = "default", orientation = "vertical", children, ...props }, ref) => {
    return (
      <TimelineContext.Provider value={{ variant, orientation }}>
        <ul
          ref={ref}
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className
          )}
          {...props}
        >
          {children}
        </ul>
      </TimelineContext.Provider>
    );
  }
);
Timeline.displayName = "Timeline";

// Timeline Item
export interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> { }

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("relative flex flex-1", className)}
        {...props}
      />
    );
  }
);
TimelineItem.displayName = "TimelineItem";

// Timeline Header (contains separator and icon)
export interface TimelineHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useTimeline();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          orientation === "vertical" ? "flex-row" : "flex-col",
          className
        )}
        {...props}
      />
    );
  }
);
TimelineHeader.displayName = "TimelineHeader";

// Timeline Separator (the line)
export interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> { }

const TimelineSeparator = React.forwardRef<HTMLDivElement, TimelineSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { orientation, variant } = useTimeline();

    const variantStyles = {
      default: "bg-primary/20",
      secondary: "bg-secondary/20",
      destructive: "bg-destructive/20",
      outline: "bg-border",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          orientation === "vertical"
            ? "flex-col w-6"
            : "flex-row h-6",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            orientation === "vertical" ? "w-0.5 h-full" : "w-full h-0.5",
            "rounded-full"
          )}
        />
      </div>
    );
  }
);
TimelineSeparator.displayName = "TimelineSeparator";

// Timeline Icon
export type TimelineIconProps = React.HTMLAttributes<HTMLDivElement>

const TimelineIcon = React.forwardRef<HTMLDivElement, TimelineIconProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useTimeline();

    const variantStyles = {
      default: "bg-primary/10 border-primary/20 text-primary",
      secondary: "bg-secondary/10 border-secondary/20 text-secondary",
      destructive: "bg-destructive/10 border-destructive/20 text-destructive",
      outline: "bg-background border-border text-foreground",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TimelineIcon.displayName = "TimelineIcon";

// Timeline Body (content area)
export interface TimelineBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useTimeline();

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 px-4",
          orientation === "vertical" ? "pb-8" : "",
          className
        )}
        {...props}
      />
    );
  }
);
TimelineBody.displayName = "TimelineBody";

// Timeline Title
export interface TimelineTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-sm font-medium leading-none", className)}
        {...props}
      />
    );
  }
);
TimelineTitle.displayName = "TimelineTitle";

// Timeline Description
export interface TimelineDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

const TimelineDescription = React.forwardRef<HTMLParagraphElement, TimelineDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
TimelineDescription.displayName = "TimelineDescription";

export {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineSeparator,
  TimelineIcon,
  TimelineBody,
  TimelineTitle,
  TimelineDescription,
};