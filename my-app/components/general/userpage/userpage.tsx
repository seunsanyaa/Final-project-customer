import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Navi } from "../head/navi"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"; // Import useState

export function User_page() {
  // State to manage edit mode and input values
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "John Doe",
    dob: "1985-06-15",
    license: "ABC123456",
    nationality: "United States",
  });
  const [contactInfo, setContactInfo] = useState({
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    username: "jdoe",
  });

  const handleEditPersonal = () => {
    console.log("isEditingPersonal before toggle:", isEditingPersonal);
    setIsEditingPersonal((prev) => !prev);
    console.log("isEditingPersonal after toggle:", !isEditingPersonal);
  };
  

  const handleEditContact = () => {
    setIsEditingContact(!isEditingContact);
  };

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
                  <Label className={`text-primary-foreground ${isEditingPersonal ? 'text-black' : 'text-white'}`}>Full Name</Label>
                  {isEditingPersonal ? (
                    <input
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    />
                  ) : (
                    <div className={isEditingPersonal ? 'text-black' : 'text-black'}>{personalInfo.fullName}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className={`text-primary-foreground ${isEditingPersonal ? 'text-black' : 'text-white'}`}>Date of Birth</Label>
                  {isEditingPersonal ? (
                    <input
                      type="date"
                      value={personalInfo.dob}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                    />
                  ) : (
                    <div className={isEditingPersonal ? 'text-black' : 'text-black'}>{personalInfo.dob}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className={`text-primary-foreground ${isEditingPersonal ? 'text-black' : 'text-white'}`}>Driver&apos;s License:</Label>
                  {isEditingPersonal ? (
                    <input
                      value={personalInfo.license}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, license: e.target.value })}
                    />
                  ) : (
                    <div className={isEditingPersonal ? 'text-black' : 'text-black'}>{personalInfo.license}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className={`text-primary-foreground ${isEditingPersonal ? 'text-black' : 'text-white'}`}>Nationality</Label>
                  {isEditingPersonal ? (
                    <input
                      value={personalInfo.nationality}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                    />
                  ) : (
                    <div className={isEditingPersonal ? 'text-black' : 'text-black'}>{personalInfo.nationality}</div>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-secondary-foreground text-white color:#0000 ml-3 hover:bg-customgrey hover:text-primary-foreground" 
                onClick={handleEditPersonal} // Toggle edit mode for personal info
              >
                {isEditingPersonal ? "Confirm" : "Edit"}
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
                  {isEditingContact ? (
                    <input
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    />
                  ) : (
                    <div>{contactInfo.email}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className="text-secondary-foreground">Phone</Label>
                  {isEditingContact ? (
                    <input
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    />
                  ) : (
                    <div>{contactInfo.phone}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className="text-secondary-foreground">Username</Label>
                  {isEditingContact ? (
                    <input
                      value={contactInfo.username}
                      onChange={(e) => setContactInfo({ ...contactInfo, username: e.target.value })}
                    />
                  ) : (
                    <div>{contactInfo.username}</div>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-customgrey hover:text-primary-foreground ml-3"
                onClick={handleEditContact} // Toggle edit mode for contact info
              >
                {isEditingContact ? "Confirm" : "Edit"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </div>)
  );
}

