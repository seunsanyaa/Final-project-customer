import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

// Define the Separator component using React.forwardRef for ref forwarding
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { 
      className, 
      orientation = "horizontal", 
      decorative = true, 
      ...props 
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // Base styles
        "shrink-0",
        // Dynamic color styles based on light/dark mode
        "bg-slate-200 dark:bg-slate-800",
        // Dynamic sizing based on orientation
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        // Allow custom classes to be added
        className
      )}
      {...props}
    />
  )
)

// Set the display name for better debugging
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
