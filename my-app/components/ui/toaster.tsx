import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "../../hooks/use-toast"

// Toaster component for displaying toast notifications
export function Toaster() {
  // Get the current toasts from the useToast hook
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {/* Map through each toast and render it */}
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {/* Render the title if it exists */}
            {title && <ToastTitle>{title}</ToastTitle>}
            {/* Render the description if it exists */}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {/* Render the action if it exists */}
          {action}
          <ToastClose />
        </Toast>
      ))}
      {/* Render the toast viewport */}
      <ToastViewport />
    </ToastProvider>
  )
}
