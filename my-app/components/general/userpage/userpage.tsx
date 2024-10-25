<<<<<<< Updated upstream
=======
import React, { useState } from "react"; // Add React to the import
>>>>>>> Stashed changes
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Navi } from "../head/navi"
import { Separator } from "@/components/ui/separator"
<<<<<<< Updated upstream
import { useState } from "react"; // Import useState

export function User_page() {
  // State to manage edit mode and input values
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
=======
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Import your Dialog component
import { createWorker, OEM, LoggerMessage } from 'tesseract.js'; // Updated import for enums and types

interface PersonalInfo {
  fullName: string;
  dob: string;
  license: string;
  nationality: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  username: string;
}

interface ExtractedInfo {
  fullName: string;
  license: string;
  expirationDate: string;
}

export function User_page() {
  // State to manage edit mode and input values
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
>>>>>>> Stashed changes
    fullName: "John Doe",
    dob: "1985-06-15",
    license: "ABC123456",
    nationality: "United States",
<<<<<<< Updated upstream
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
=======
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    username: "jdoe",
  });

  // New state to manage extracted license information
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({
    fullName: "",
    license: "",
    expirationDate: "",
  });

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
>>>>>>> Stashed changes
  };
  

  const handleScanClick = () => {
    setIsDialogOpen(true); // Open the dialog when Scan button is clicked
  };

<<<<<<< Updated upstream
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
=======
  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  // Handler for file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create and initialize the worker with proper parameters
    const worker = await createWorker(
      'eng', // Language(s) to use
      OEM.DEFAULT, // OCR Engine Mode
      {
        logger: (m: LoggerMessage) => console.log(m), // Logger function
      }
    );

    try {
      await worker.load(); // Load the Tesseract core
      await worker.loadLanguage('eng'); // Load the English language
      await worker.initialize('eng'); // Initialize the worker with English

      const { data: { text } } = await worker.recognize(file);
      
      console.log('Extracted Text:', text); // Debugging: Check extracted text

      // Parse the extracted text to find required fields
      const parsedInfo = parseLicenseText(text);
      console.log('Parsed Info:', parsedInfo); // Debugging: Check parsed info

      setExtractedInfo(parsedInfo);
      setPersonalInfo((prev) => ({
        ...prev,
        fullName: parsedInfo.fullName || prev.fullName,
        license: parsedInfo.license || prev.license,
      }));
      setContactInfo((prev) => ({
        ...prev,
        // Update other contact info if needed
      }));
      setIsEditing(true); // Enable edit mode to show extracted info
    } catch (error) {
      console.error('Error during OCR:', error);
      // Handle the error (e.g., show an error message to the user)
    } finally {
      await worker.terminate(); // Terminate the worker to free up resources
    }
  };

  // Function to parse the OCR text and extract required fields
  const parseLicenseText = (text: string) => {
    // Simple regex patterns (you may need to adjust these based on the license format)
    const nameMatch = text.match(/Name:\s*([A-Za-z\s]+)/i);
    const licenseMatch = text.match(/License\s*#?:?\s*(\w+)/i);
    const expirationMatch = text.match(/Exp\s*Date:\s*(\d{4}-\d{2}-\d{2})/i);

    return {
      fullName: nameMatch ? nameMatch[1].trim() : "",
      license: licenseMatch ? licenseMatch[1].trim() : "",
      expirationDate: expirationMatch ? expirationMatch[1].trim() : "",
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
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
          <div className="max-w-screen mx-auto grid grid-rows-1 gap-6">
            <Card className="bg-muted text-black">
              <CardHeader>
                <CardTitle className="text-black">Personal & Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row w-full justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
                  <div className="grid gap-2">
                    <Label className="text-black">Full Name</Label>
                    {isEditing ? (
                      <input
                        aria-label="Full Name"
                        value={personalInfo.fullName || extractedInfo.fullName} // Show extracted name if available
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.fullName || extractedInfo.fullName}</div> // Show extracted name if available
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Date of Birth</Label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={personalInfo.dob}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.dob}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Driver&apos;s License:</Label>
                    {isEditing ? (
                      <input
                        value={personalInfo.license || extractedInfo.license} // Show extracted license if available
                        onChange={(e) => setPersonalInfo({ ...personalInfo, license: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.license || extractedInfo.license}</div> // Show extracted license if available
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Nationality</Label>
                    {isEditing ? (
                      <input
                        value={personalInfo.nationality}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.nationality}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Email</Label>
                    {isEditing ? (
                      <input
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{contactInfo.email}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Phone</Label>
                    {isEditing ? (
                      <input
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{contactInfo.phone}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Username</Label>
                    {isEditing ? (
                      <input
                        value={contactInfo.username}
                        onChange={(e) => setContactInfo({ ...contactInfo, username: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{contactInfo.username}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Expiration Date</Label>
                    {isEditing ? (
                      <input
                        value={extractedInfo.expirationDate} // Display extracted expiration date
                        readOnly // Make it read-only since it should not be edited directly
                      />
                    ) : (
                      <div className="text-black">{extractedInfo.expirationDate}</div> // Show extracted expiration date
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-black hover:bg-customgrey hover:text-primary-foreground"
                    onClick={handleEditToggle} // Single button to toggle edit mode
                  >
                    {isEditing ? "Confirm" : "Edit"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-black hover:bg-customgrey hover:text-primary-foreground mt-2" 
                    onClick={handleScanClick} // Open the scan dialog
                  >
                    Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        {/* Dialog for scanning */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-background">
            <DialogHeader>
              <DialogTitle>Scan Options</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Card className="bg-muted text-black">
                <CardHeader>
                  <CardTitle>Upload Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="border rounded p-2"
                    onChange={handleFileUpload} // Handle file upload
                  />
                  {extractedInfo.fullName && (
                    <div className="mt-4">
                      <p><strong>Full Name:</strong> {extractedInfo.fullName}</p>
                      <p><strong>License ID:</strong> {extractedInfo.license}</p>
                      <p><strong>Expiration Date:</strong> {extractedInfo.expirationDate}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-muted text-black">
                <CardHeader>
                  <CardTitle>Open Camera</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Click the button below to open the camera.</p>
                  <Button variant="outline" className="mt-2">Open Camera</Button>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button className="hover:bg-muted" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="hover:bg-muted" variant="outline" onClick={() => setIsDialogOpen(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    );
>>>>>>> Stashed changes
}

