
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
    (<div className="flex flex-col min-h-screen">
      <Navi/>
      <Separator/>
      <div className="flex flex-row h-[92vh]">
      <aside
        className="flex flex-col items-left justify-between  w-fit px-4 md:px-6 border-b bg-primary text-primary-foreground py-2 md:py-12">
        <nav className="flex flex-col items-left justify-between h-fit w-fit  gap-4 sm:gap-6">
          <div className="flex flex-col md:flex items-left gap-4 w-fit">
            <Link
              href="#"
              className="text-background drop-shadow-glow hover:text-customyello transition-colors"
              prefetch={false}>
              Account Details
            </Link>
            <Link
              href="/User_Account/User_Rev"
              className="text-muted-foreground hover:text-customyello transition-colors"
              prefetch={false}>
              My Ratings & Reviews
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-customyello transition-colors"
              prefetch={false}>
              Previous Bookings
            </Link>
            
          </div>
        </nav>
      
      </aside>
      <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen mx-auto grid grid-rows-2 sm:grid-rows-2 gap-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row w-full justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
                <div className="grid gap-2">
                  <Label className="text-primary-foreground">Full Name</Label>
                  <div>John Doe</div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-primary-foreground">Date of Birth</Label>
                  <div>1985-06-15</div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-primary-foreground">Driver&apos;s License:</Label>
                  <div>ABC123456</div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-primary-foreground">Nationality</Label>
                  <div>United States</div>
                </div>
              </div><Button variant="outline" size="sm" className="text-secondary-foreground">
            Edit
          </Button>
            </CardContent>
          </Card>
          <Card className="bg-muted text-secondary-foreground">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row w-full justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
                <div className="grid gap-2">
                  <Label className="text-secondary-foreground">Email</Label>
                  <div>john.doe@example.com</div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-secondary-foreground">Phone</Label>
                  <div>+1 (555) 123-4567</div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-secondary-foreground">Username</Label>
                  <div>jdoe</div>
                </div>
              </div><Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-customgrey hover:text-primary-foreground ">
            Edit
          </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </div>)
  );
}
