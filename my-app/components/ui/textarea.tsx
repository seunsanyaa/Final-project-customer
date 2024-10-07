import * as React from "react"

import { cn } from "@/lib/utils"

// Define the props interface for the Textarea component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Create a forwardRef component for the Textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[80px] w-full rounded-md border text-sm",
          // Light mode styles
          "border-slate-200 bg-white text-slate-900",
          "placeholder:text-slate-500",
          // Focus styles
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          // Disabled styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Dark mode styles
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          "dark:placeholder:text-slate-400",
          "dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950",
          // Padding
          "px-3 py-2",
          // Custom className
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

// Set a display name for the component (useful for debugging)
Textarea.displayName = "Textarea"

export { Textarea }
