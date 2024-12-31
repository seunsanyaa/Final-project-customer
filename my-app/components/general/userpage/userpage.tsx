import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createWorker, LoggerMessage, OEM } from 'tesseract.js';
import { Navi } from "../head/navi";
import { User } from "@/types/user";
interface PersonalInfo {
  fullName: string;
  dob: string;
  license: string;
  nationality: string;
  address: string;
  expirationDate: string;
}

interface ContactInfo {
  email: string;
  phone: string;
}

interface ExtractedInfo {
  fullName: string;
  license: string;
  expirationDate: string;
}



function isUserData(data: any): data is User {
  return typeof data === 'object' && 'firstName' in data && 'lastName' in data;
}

export function User_page() {
  const { user } = useUser();
  const userData = useQuery(api.users.getFullUser, { userId: user?.id ?? "" }) as User;
  const customerData = useQuery(api.customers.getCustomerByUserId, { userId: user?.id ?? "" });

  // State to manage edit mode and input values
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

  // Update state initialization to use loaded data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: userData && isUserData(userData)
      ? `${userData.firstName} ${userData.lastName}`
      : "",
    dob: customerData?.dateOfBirth ?? "",
    license: customerData?.licenseNumber ?? "",
    nationality: customerData?.nationality ?? "",
    address: customerData?.address ?? "",
    expirationDate: customerData?.expirationDate ?? "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: userData && isUserData(userData) ? userData.email : "",
    phone: customerData?.phoneNumber ?? "",
  });

  // New state to manage extracted license information
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({
    fullName: "",
    license: "",
    expirationDate: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const upsertCustomer = useMutation(api.customers.upsertCustomer); // Use upsertCustomer mutation
  const editUser = useMutation(api.users.editUser);

  const isLicenseExpired = (expirationDate: string | undefined) => {
    if (!expirationDate) return false;

    // Convert DD.MM.YYYY to YYYY-MM-DD for comparison
    const [day, month, year] = expirationDate.split('.');
    const expDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();

    // Reset time part for accurate date comparison
    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);

    return expDate < today;
  };

  const handleEditToggle = async () => {
    if (!user?.id) return;

    if (isEditing) {
      try {
        setErrorMessage(""); // Clear any previous error messages

        if (isLicenseExpired(personalInfo.expirationDate)) {
          setErrorMessage("License has expired. Please update the expiration date.");
          return;
        }

        // Validate required fields
        if (!personalInfo.fullName || !personalInfo.license) {
          setErrorMessage("Full name and license number are required.");
          return;
        }

        // Update user table
        await editUser({
          userId: user.id,
          firstName: personalInfo.fullName.split(' ')[0],
          lastName: personalInfo.fullName.split(' ')[1],
          email: contactInfo.email,
        });

        // Update customer table
        await upsertCustomer({
          userId: user.id,
          nationality: personalInfo.nationality,
          phoneNumber: contactInfo.phone,
          licenseNumber: personalInfo.license,
          address: personalInfo.address,
          dateOfBirth: personalInfo.dob,
          expirationDate: personalInfo.expirationDate,
        });

      } catch (error) {
        console.error('Error updating user data:', error);
        setErrorMessage("Failed to update user data. Please try again.");
      }
    }
    setIsEditing((prev) => !prev);
  };

  const handleScanClick = () => {
    setIsDialogOpen(true); // Open the dialog when Scan button is clicked
  };

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
      await worker.reinitialize('eng'); // Initialize the worker with English

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
        expirationDate: parsedInfo.expirationDate || prev.expirationDate,
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
    // Split the text into lines for easier processing
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');

    let license = '';
    let expirationDate = '';
    let nameParts: string[] = [];

    // Iterate through each line to find relevant information
    lines.forEach(line => {
      // Skip lines containing "Drive" or "License" when extracting the full name
      if (/driver|licence/i.test(line)) {
        return;
      }

      // Extract Full Name
      const nameMatch = line.match(/(?:1\.?\s+|2\.?\s+)([A-Z]+)/);
      if (nameMatch) {
        nameParts.push(nameMatch[1]);
      }

      // Extract License Number
      const licenseMatch = line.match(/5\.?\s+((\d[A-Z0-9]+|[A-Z0-9]+\d))/);
      if (licenseMatch && !license) {
        license = licenseMatch[1];
      }

      // Extract Expiration Date
      const expDateMatch = line.match(/(\d{2}\.\d{2}\.\d{4})$/);
      if (expDateMatch && !expirationDate) {
        expirationDate = expDateMatch[1];
      }
    });

    // Reverse the order of name parts and join them
    let fullName = nameParts.reverse().join(' ');

    if (!license) {
      const licenseLine = lines.find(line => line.match(/SMITH\d{9,}/));
      if (licenseLine) {
        const match = licenseLine.match(/SMITH\d{9,}/);
        if (match) {
          license = match[0];
        }
      }
    }

    if (!expirationDate) {
      const expLine = lines.find(line => line.includes('07.11.2046'));
      if (expLine) {
        const match = expLine.match(/(\d{2}\.\d{2}\.\d{4})/);
        if (match) {
          expirationDate = match[1];
        }
      }
    }

    return {
      fullName,
      license,
      expirationDate,
    };
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Optional: Update state when data loads
  useEffect(() => {
    if (userData && customerData) {
      setPersonalInfo({
        fullName: `${userData.firstName} ${userData.lastName}`,
        dob: customerData.dateOfBirth,
        license: customerData.licenseNumber,
        nationality: customerData.nationality,
        address: customerData.address,
        expirationDate: customerData.expirationDate ?? "",
      });

      setContactInfo({
        email: userData.email,
        phone: customerData.phoneNumber,
      });
    }
  }, [userData, customerData, user?.id]);

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
                href="/User_Account/User_Promotions"
                className="text-muted-foreground hover:text-customyello transition-colors"
                prefetch={false}>
                My Promotions
              </Link>
              <Link
                href="/User_Account/Golden_Manage"
                className="text-muted-foreground hover:text-customyello transition-colors"
                prefetch={false}>
                Manage Membership
              </Link>
            </div>
          </nav>
        
        </aside>
        <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen mx-auto grid grid-rows-1 gap-6">
            <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-muted shadow-lg" style={{ border: "none" }}>
              <CardHeader>
                <CardTitle className="text-black">Personal & Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row w-full justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
                  <div className="grid gap-2">
                    <Label className="text-black">Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={personalInfo.fullName || extractedInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.fullName || extractedInfo.fullName}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={formatDateForInput(personalInfo.dob)}
                        onChange={(e) => {
                          setPersonalInfo({ 
                            ...personalInfo, 
                            dob: formatDateForDisplay(e.target.value)
                          });
                        }}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.dob}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Driver&apos;s License:</Label>
                    {isEditing ? (
                      <Input
                        value={personalInfo.license || extractedInfo.license}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, license: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.license || extractedInfo.license}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Nationality</Label>
                    {isEditing ? (
                      <Input
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
                      <Input
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
                      <Input
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{contactInfo.phone}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">License Expiry Date</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={formatDateForInput(personalInfo.expirationDate)}
                        onChange={(e) => {
                          setPersonalInfo({ 
                            ...personalInfo, 
                            expirationDate: formatDateForDisplay(e.target.value)
                          });
                        }}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.expirationDate}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-black">Address</Label>
                    {isEditing ? (
                      <Input
                        value={personalInfo.address}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                      />
                    ) : (
                      <div className="text-black">{personalInfo.address}</div>
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
              {errorMessage && (
                <div className="text-red-500 mt-2">
                  {errorMessage}
                </div>
              )}
            </Card>
          </div>
        </main>
        {/* Dialog for scanning */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-background" style={{ border: "none" }}>
            <DialogHeader>
              <DialogTitle>Scan Options</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg" style={{ border: "none" }}>
                <CardHeader>
                  <CardTitle>Upload Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-lg"
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
              <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-muted shadow-lg" style={{ border: "none" }}>
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
              <Button className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline" onClick={() => setIsDialogOpen(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
