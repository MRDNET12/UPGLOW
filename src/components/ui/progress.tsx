"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, 'value'> {
  value?: number;
  indicatorColor?: string;
}

function Progress({
  className,
  value,
  indicatorColor,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          !indicatorColor && "bg-primary"
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: indicatorColor || undefined
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
