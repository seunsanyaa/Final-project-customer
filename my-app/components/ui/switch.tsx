import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

// Define the Switch component using React.forwardRef for proper ref handling
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Base styles for the switch
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      // Focus styles
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      // Disabled styles
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Checked and unchecked styles for light and dark modes
      "data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-200",
      "dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950",
      "dark:data-[state=checked]:bg-slate-50 dark:data-[state=unchecked]:bg-slate-800",
      // Allow custom className to be applied
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // Base styles for the thumb
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
        // Position styles for checked and unchecked states
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        // Dark mode style
        "dark:bg-slate-950"
      )}
    />
  </SwitchPrimitives.Root>
))

// Set the display name for better debugging
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
