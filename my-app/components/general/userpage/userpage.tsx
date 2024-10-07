import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Navi } from "../head/navi"
import { Separator } from "@/components/ui/separator"
export function User_page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation component */}
      <Navi />
      <Separator />
      
      <div className="flex flex-row h-[92vh]">
        {/* Sidebar navigation */}
        <aside className="flex flex-col items-left justify-between w-fit px-4 md:px-6 border-b bg-primary text-primary-foreground py-2 md:py-12">
          <nav className="flex flex-col items-left justify-between h-fit w-fit gap-4 sm:gap-6">
            <div className="flex flex-col md:flex items-left gap-4 w-fit">
              {/* TODO: Consider extracting these links into a separate component for better maintainability */}
              <Link
                href="#"
                className="text-background drop-shadow-glow hover:text-customyello transition-colors"
                prefetch={false}
              >
                Account Details
              </Link>
              {/* ... other links ... */}
            </div>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen mx-auto grid grid-rows-2 sm:grid-rows-2 gap-6">
            {/* Personal Information Card */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row w-full justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
                  {/* TODO: Consider creating a reusable InfoItem component for these repeated structures */}
                  <InfoItem label="Full Name" value="John Doe" />
                  <InfoItem label="Date of Birth" value="1985-06-15" />
                  <InfoItem label="Driver's License" value="ABC123456" />
                  <InfoItem label="Nationality" value="United States" />
                </div>
                <Button variant="outline" size="sm" className="text-secondary-foreground">
                  Edit
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="bg-muted text-secondary-foreground">
              {/* ... similar structure to Personal Information Card ... */}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper component for displaying information items
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <Label className="text-primary-foreground">{label}</Label>
      <div>{value}</div>
    </div>
  );
}
