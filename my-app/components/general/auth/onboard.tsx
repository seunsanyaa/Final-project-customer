import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function OnboardComponent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const createUser = useMutation(api.users.createUser);
  const createCustomer = useMutation(api.customers.createCustomer);
  const getCustomer = useQuery(api.customers.getCustomerByUserId, { userId: user?.id ?? "" });

  const [isChecking, setIsChecking] = useState(true);

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

  if (!isLoaded || !isSignedIn || isChecking) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
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
            <Label htmlFor="dateOfBirth">Date of Birth (DD.MM.YYYY)</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              placeholder="DD.MM.YYYY"
              value={formData.dateOfBirth}
              onChange={handleChange}
              pattern="\d{2}\.\d{2}\.\d{4}"
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
            <Label htmlFor="expirationDate">License Expiration Date (DD.MM.YYYY)</Label>
            <Input
              id="expirationDate"
              name="expirationDate"
              placeholder="DD.MM.YYYY"
              value={formData.expirationDate}
              onChange={handleChange}
              pattern="\d{2}\.\d{2}\.\d{4}"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </form>
      </div>
    );
  }

  return null; // This will be reached if the user is being redirected
}
