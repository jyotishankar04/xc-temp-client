"use client";

import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils/index";

interface ResizablePanelGroupProps {
  children?: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const ResizablePanelGroup = ({
  className,
  orientation = "horizontal",
  children,
  style,
  ...props
}: ResizablePanelGroupProps) => (
  <Group
    orientation={orientation}
    className={cn("flex h-full", className)}
    style={style}
    {...props}
  >
    {children}
  </Group>
);

interface ResizablePanelProps {
  children?: React.ReactNode;
  className?: string;
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const ResizablePanel = ({
  className,
  defaultSize,
  minSize,
  maxSize,
  children,
  style,
  ...props
}: ResizablePanelProps) => (
  <Panel
    defaultSize={defaultSize}
    minSize={minSize}
    maxSize={maxSize}
    className={cn("flex flex-col", className)}
    style={style}
    {...props}
  >
    {children}
  </Panel>
);

interface ResizableHandleProps {
  className?: string;
  withHandle?: boolean;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const ResizableHandle = ({
  className,
  withHandle,
  style,
  ...props
}: ResizableHandleProps) => (
  <Separator
    className={cn(
      "relative flex cursor-col-resize items-center justify-center",
      "bg-border transition-colors hover:bg-accent focus-visible:outline-none",
      "focus-visible:ring-1 focus-visible:ring-ring",
      className
    )}
    style={style}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-1 items-center justify-center rounded-[2px] bg-muted-foreground/30">
        <div className="h-[2px] w-1 rounded-full bg-muted-foreground/50" />
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
