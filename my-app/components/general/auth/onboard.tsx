import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSignUp } from "@clerk/nextjs";

export default function OnboardComponent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const createUser = useMutation(api.users.createUser);
  const createCustomer = useMutation(api.customers.createCustomer);
  const getCustomer = useQuery(api.customers.getCustomerByUserId, { userId: user?.id ?? "" });
  const { signUp } = useSignUp();

  const [isChecking, setIsChecking] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    dateOfBirth: "",
    phoneNumber: "",
    licenseNumber: "",
    address: "",
    expirationDate: "",
    confirmEmail: "",
    confirmPassword: "",
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

  useEffect(() => {
    // Check for pending signup data
    const pendingSignup = sessionStorage.getItem('pendingSignup');
    if (!pendingSignup) {
      router.push('/create-account');
      return;
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || '{}');
    if (!pendingSignup.email || !pendingSignup.password) {
      router.push('/create-account');
      return;
    }

    if (formData.confirmEmail !== pendingSignup.email) {
      toast({
        title: "Error",
        description: "Email addresses do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.confirmPassword !== pendingSignup.password) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create the Clerk account
      const signUpAttempt = await signUp?.create({
        emailAddress: pendingSignup.email,
        password: pendingSignup.password,
      });

      // Prepare email verification
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });

      // Create user in your DB
      await createUser({
        userId: signUpAttempt?.createdUserId || '',
        email: pendingSignup.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        staff: false,
        password: pendingSignup.password,
      });

      // Create customer record
      await createCustomer({
        userId: signUpAttempt?.createdUserId || '',
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
        expirationDate: formData.expirationDate,
      });

      // Prepare email verification
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });

      // Clear the pending signup data
      sessionStorage.removeItem('pendingSignup');

      toast({
        title: "Success!",
        description: "Please verify your email address.",
      });

      router.push("/verify-email");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded) {
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

          <div className="space-y-2">
            <Label htmlFor="confirmEmail">Confirm Email</Label>
            <Input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              required
              onChange={handleChange}
              value={formData.confirmEmail}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              onChange={handleChange}
              value={formData.confirmPassword}
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
