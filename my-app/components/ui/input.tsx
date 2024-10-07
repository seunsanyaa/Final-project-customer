import * as React from "react"

import { cn } from "@/lib/utils"

// Define the InputProps interface, extending React's input HTML attributes
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Create a forwardRef component for the Input
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
          // Ring and focus styles
          "ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950",
          // Placeholder and disabled styles
          "placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50",
          // Dark mode styles
          "dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          // Allow custom className to override or extend default styles
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

// Set a display name for the component (useful for debugging)
Input.displayName = "Input"

export { Input }
