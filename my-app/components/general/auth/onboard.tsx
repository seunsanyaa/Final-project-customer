import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createWorker, OEM, LoggerMessage } from 'tesseract.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExtractedInfo {
  fullName: string;
  license: string;
  expirationDate: string;
  address?: string;
}

export default function OnboardComponent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const createUser = useMutation(api.users.createUser);
  const createCustomer = useMutation(api.customers.createCustomer);
  const getCustomer = useQuery(api.customers.getCustomerByUserId, { userId: user?.id ?? "" });

  const [isChecking, setIsChecking] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({
    fullName: "",
    license: "",
    expirationDate: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    dateOfBirth: "",
    phoneNumber: "",
    licenseNumber: "",
    address: "",
    expirationDate: "",
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoaded && isSignedIn) {
      timeoutId = setTimeout(() => {
        // Check if getCustomer is explicitly null or undefined
        if (getCustomer === null) {
          console.log("No customer profile found, showing form");
          setIsChecking(false); // Show the form
        } else if (getCustomer !== undefined) {
          console.log("Redirecting to user account");
          router.push("/user-account");
        }
      }, 2000); // 2 second delay
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoaded, isSignedIn, getCustomer, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      // Create user if not already created
      await createUser({
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: formData.firstName,
        lastName: formData.lastName,
        staff: false,
      });

      // Create customer record
      await createCustomer({
        userId: user.id,
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
        expirationDate: formData.expirationDate,
      });

      toast({
        title: "Success!",
        description: "Your profile has been created successfully.",
      });

      router.push("/vehicles");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const worker = await createWorker(
      'eng',
      OEM.DEFAULT,
      {
        logger: (m: LoggerMessage) => console.log(m),
      }
    );

    try {
      await worker.load();
      await worker.reinitialize('eng');

      const { data: { text } } = await worker.recognize(file);
      
      console.log('Extracted Text:', text);

      const parsedInfo = parseLicenseText(text);
      console.log('Parsed Info:', parsedInfo);

      setExtractedInfo(parsedInfo);
      
      // Update form data with extracted info
      if (parsedInfo.fullName) {
        const [firstName, ...lastNameParts] = parsedInfo.fullName.split(' ');
        setFormData(prev => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastNameParts.join(' ') || prev.lastName,
          licenseNumber: parsedInfo.license || prev.licenseNumber,
          expirationDate: parsedInfo.expirationDate || prev.expirationDate,
          address: parsedInfo.address || prev.address,
        }));
      }

      toast({
        title: "Success",
        description: "License information extracted successfully.",
      });
    } catch (error) {
      console.error('Error during OCR:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to extract license information. Please try manual entry.",
      });
    } finally {
      await worker.terminate();
    }
  };

  const parseLicenseText = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');

    let license = '';
    let expirationDate = '';
    let nameParts: string[] = [];
    let address = '';

    lines.forEach(line => {
      if (/driver|licence/i.test(line)) {
        return;
      }

      const nameMatch = line.match(/(?:1\.?\s+|2\.?\s+)([A-Z]+)/);
      if (nameMatch) {
        nameParts.push(nameMatch[1]);
      }

      const licenseMatch = line.match(/5\.?\s+((\d[A-Z0-9]+|[A-Z0-9]+\d))/);
      if (licenseMatch && !license) {
        license = licenseMatch[1];
      }

      const expDateMatch = line.match(/(\d{2}\.\d{2}\.\d{4})$/);
      if (expDateMatch && !expirationDate) {
        expirationDate = expDateMatch[1];
      }

      // Try to find address
      if (line.includes('Address') || line.match(/\d+\s+[A-Za-z]+\s+(?:Street|Road|Ave|Avenue)/i)) {
        address = line.replace(/Address:?\s*/i, '').trim();
      }
    });

    let fullName = nameParts.reverse().join(' ');

    if (!license) {
      const licenseLine = lines.find(line => line.match(/[A-Z]\d{9,}/));
      if (licenseLine) {
        const match = licenseLine.match(/[A-Z]\d{9,}/);
        if (match) {
          license = match[0];
        }
      }
    }

    return {
      fullName,
      license,
      expirationDate,
      address,
    };
  };

  if (!isLoaded || !isSignedIn || isChecking) {
    return <div>Loading...</div>;
  }

  if (getCustomer === null) {
    return (
      <div className="flex flex-col items-center justify-center px-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Please provide your details to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 text-sm"
            >
              Scan License
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth ? formData.dateOfBirth.split('.').reverse().join('-') : ''}
              onChange={(e) => {
                const date = e.target.value;
                const [year, month, day] = date.split('-');
                setFormData(prev => ({
                  ...prev,
                  dateOfBirth: `${day}.${month}.${year}`
                }));
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDate">License Expiration Date</Label>
            <Input
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={formData.expirationDate ? formData.expirationDate.split('.').reverse().join('-') : ''}
              onChange={(e) => {
                const date = e.target.value;
                const [year, month, day] = date.split('-');
                setFormData(prev => ({
                  ...prev,
                  expirationDate: `${day}.${month}.${year}`
                }));
              }}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </form>

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
                    onChange={handleFileUpload}
                  />
                  {extractedInfo.fullName && (
                    <div className="mt-4">
                      <p><strong>Full Name:</strong> {extractedInfo.fullName}</p>
                      <p><strong>License ID:</strong> {extractedInfo.license}</p>
                      <p><strong>Expiration Date:</strong> {extractedInfo.expirationDate}</p>
                      {extractedInfo.address && (
                        <p><strong>Address:</strong> {extractedInfo.address}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button 
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                style={{ border: "none" }} 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null; // This will be reached if the user is being redirected
}
