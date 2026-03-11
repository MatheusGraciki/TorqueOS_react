import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

type TooltipSide = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["side"];

type TooltipProps = {
  text: React.ReactNode;
  position?: TooltipSide;
  children: React.ReactNode;
  contentClassName?: string;
  delayDuration?: number;
  skipDelayDuration?: number;
  sideOffset?: number;
};

const Tooltip = (props: TooltipProps) => {
  const {
    text,
    position = "top",
    children,
    contentClassName,
    delayDuration = 0,
    skipDelayDuration = 0,
    sideOffset = 4,
  } = props;

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side={position}
          sideOffset={sideOffset}
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            contentClassName,
          )}
        >
          {text}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export { Tooltip };
