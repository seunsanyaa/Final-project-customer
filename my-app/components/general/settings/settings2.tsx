'use client'

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Navi } from "../head/navi"
import { Footer } from "../head/footer";
import { useUser, useClerk, useSignIn } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef, useCallback } from "react";
import { clerkClient } from "@clerk/nextjs/server";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

type PaymentMethod = {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

export function Settings2() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { user } = useUser();
  const saveSettings = useMutation(api.settings.saveSettings);
  const userSettings = useQuery(api.settings.fetchSettings, { 
    userId: user?.id ?? "" 
  });
  const clerk = useClerk();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [code, setCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState<any>(null);
  const [showSocialDialog, setShowSocialDialog] = useState(false);
  const [pendingSocialEmail, setPendingSocialEmail] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);
  const [isDeletingPaymentMethod, setIsDeletingPaymentMethod] = useState<string | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    booking: true,
    promotion: true,
    payment: true,
    rewards: true,
    reminder: true,
  });
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const [hasLoadedPaymentMethods, setHasLoadedPaymentMethods] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const deleteUser = useMutation(api.users.deleteUser);
  const deleteCustomer = useMutation(api.customers.deleteCustomer);
  const rewardPoints = useQuery(api.customers.getRewardPointsByUserId, { 
    userId: user?.id ?? "" 
  });

  useEffect(() => {
    if (userSettings) {
      setDarkMode(userSettings.darkMode);
      setLanguage(userSettings.language);
      if (userSettings.notificationPreferences) {
        setNotificationPreferences(userSettings.notificationPreferences);
      }
    }
  }, [userSettings]); 
  const handleDarkModeToggle = async (checked: boolean) => {
    const newSettings = { darkMode: checked, language: language };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    setDarkMode(checked);
  if (user?.id) {
    await saveSettings({
      userId: user.id,
      darkMode: checked,
      language: language
    });
  }
}
const handleLanguageChange = async (newLanguage: string) => {
  try {
    setIsProcessing(true);
    // Update settings in database
    if (user?.id) {
      await saveSettings({
        userId: user.id,
        darkMode: darkMode,
        language: newLanguage
      });
    }

    // Update local storage
    const newSettings = { darkMode: darkMode, language: newLanguage };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    setLanguage(newLanguage);

    toast({
      title: "Success",
      description: "Language settings updated successfully. Page will refresh to apply changes.",
    });

    // Use URL parameter to trigger language change on reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLanguage);
    window.location.href = url.toString();

  } catch (error) {
    console.error('Error changing language:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update language settings. Please try again.",
    });
  } finally {
    setIsProcessing(false);
  }
};
  const userData = useQuery(api.users.getFullUser, { userId: user?.id ?? "" });
  const customerData = useQuery(api.customers.getCustomerByUserId, { userId: user?.id ?? "" });
  const upsertCustomer = useMutation(api.customers.upsertCustomer);
  const editUser = useMutation(api.users.editUser);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dob: "",
    license: "",
    nationality: "",
    address: "",
    expirationDate: "",
  });

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (userData && typeof userData !== 'string' && customerData) {
      setPersonalInfo({
        fullName: `${userData.firstName} ${userData.lastName}`,
        dob: customerData.dateOfBirth ?? "",
        license: customerData.licenseNumber ?? "",
        nationality: customerData.nationality ?? "",
        address: customerData.address ?? "",
        expirationDate: customerData.expirationDate ?? "",
      });
      setContactInfo({
        email: userData.email ?? "",
        phone: customerData.phoneNumber ?? "",
      });
    }
  }, [userData, customerData]);

  const handlePersonalInfoSave = async () => {
    if (!user?.id) return;
    
    const [firstName, ...lastNameParts] = personalInfo.fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    try {
      await editUser({
        userId: user.id,
        firstName,
        lastName,
        email: contactInfo.email,
      });

      await upsertCustomer({
        userId: user.id,
        nationality: personalInfo.nationality,
        licenseNumber: personalInfo.license,
        address: personalInfo.address,
        dateOfBirth: personalInfo.dob,
        expirationDate: personalInfo.expirationDate,
      });
    } catch (error) {
      console.error('Error updating personal info:', error);
    }
  };

  const handleContactInfoSave = async () => {
    if (!user?.id) return;

    try {
      await upsertCustomer({
        userId: user.id,
        phoneNumber: contactInfo.phone,
      });
      
      toast({
        title: "Success",
        description: "Phone number updated successfully!",
      });
    } catch (error) {
      console.error('Error updating contact info:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contact information. Please try again.",
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!pendingEmail) {
        throw new Error("No pending email verification");
      }

      await pendingEmail.attemptVerification({ code });
      
      await clerk.user?.update({
        primaryEmailAddressId: pendingEmail.id
      });
      
      setVerifyDialog(false);
      setPendingEmail(null);
      
      toast({
        title: "Success",
        description: "Email updated successfully!",
      });

      if (user?.id) {
        await editUser({
          userId: user.id,
          email: contactInfo.email,
        });

        await upsertCustomer({
          userId: user.id,
          phoneNumber: contactInfo.phone,
        });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify email. Please try again.",
      });
    }
  };

  const handleConnectSocial = async () => {
    if (!isSignInLoaded) return;
    
    try {
      if (pendingSocialEmail === 'google') {
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/settings",
        });
      } else if (pendingSocialEmail === 'microsoft') {
        await signIn.authenticateWithRedirect({
          strategy: "oauth_microsoft",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/settings",
        });
      }
    } catch (error) {
      console.error('Error connecting social account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect social account. Please try again.",
      });
      setShowSocialDialog(false);
      setVerifyDialog(true);
    }
  };

  useEffect(() => {
    if (!user) return;

    const searchParams = new URLSearchParams(window.location.search);
    const oauthStatus = searchParams.get('oauth_status');
    const oauthError = searchParams.get('oauth_error');
    
    if (oauthStatus === 'complete') {
      toast({
        title: "Success",
        description: "Social account connected successfully!",
      });
      setVerifyDialog(true);
      window.history.replaceState({}, '', '/settings');
    } else if (oauthError || oauthStatus === 'error') {
      toast({
        variant: "destructive",
        title: "Error",
        description: oauthError || "Failed to connect social account. Please try again.",
      });
      setVerifyDialog(true);
      window.history.replaceState({}, '', '/settings');
    }
  }, [toast, user]);

  const fetchPaymentMethods = useCallback(async () => {
    if (!user?.id || hasLoadedPaymentMethods) return;
    
    try {
      setIsLoadingPaymentMethods(true);
      const response = await fetch(`/api/payment-methods?userId=${user?.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setPaymentMethods(data.paymentMethods);
        setHasLoadedPaymentMethods(true);
      } else {
        console.error('Error fetching payment methods:', data.error);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  }, [user?.id, hasLoadedPaymentMethods]);

  useEffect(() => {
    if (!paymentMethodsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPaymentMethods();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(paymentMethodsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchPaymentMethods]);

  const removePaymentMethod = async (paymentMethodId: string) => {
    try {
      setIsDeletingPaymentMethod(paymentMethodId);
      const response = await fetch('/api/payment-methods', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          paymentMethodId,
        }),
      });

      if (response.ok) {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
        setHasLoadedPaymentMethods(false);
        toast({
          title: "Success",
          description: "Payment method removed successfully",
        });
      } else {
        throw new Error('Failed to remove payment method');
      }
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove payment method",
      });
    } finally {
      setIsDeletingPaymentMethod(null);
    }
  };

  const handleNotificationToggle = async (type: keyof typeof notificationPreferences) => {
    const newPreferences = {
      ...notificationPreferences,
      [type]: !notificationPreferences[type]
    };
    
    setNotificationPreferences(newPreferences);
    
    if (user?.id) {
      await saveSettings({
        userId: user.id,
        darkMode,
        language,
        notificationPreferences: newPreferences
      });

      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setIsProcessing(true);
      if (user?.id) {
        toast({
          title: "Account Deactivated",
          description: "Your account has been deactivated successfully. You will be signed out.",
        });
        
        await clerk.signOut();
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate account. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setShowDeactivateDialog(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsProcessing(true);
      if (!user?.id) {
        throw new Error("User ID not found");
      }

      // Step 1: Delete customer data
      try {
        const customerResult = await deleteCustomer({ userId: user.id });
        console.log('Customer deletion result:', customerResult);
      } catch (error) {
        console.error('Error deleting customer:', error);
        throw new Error('Failed to delete customer data');
      }

      // Step 2: Delete user data
      try {
        await deleteUser({ userId: user.id });
        console.log('User data deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user data');
      }

      // Step 3: Delete Clerk account
      try {
        await clerk.user?.delete();
        console.log('Clerk account deleted successfully');
      } catch (error) {
        console.error('Error deleting Clerk account:', error);
        throw new Error('Failed to delete Clerk account');
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted. You will be signed out.",
      });

      // Step 4: Sign out
      await clerk.signOut();
    } catch (error) {
      console.error('Error in deletion process:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Navi/>
      <Separator/>
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob"
                    type="date"
                    value={personalInfo.dob ? personalInfo.dob.split('.').reverse().join('-') : ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      const [year, month, day] = date.split('-');
                      setPersonalInfo(prev => ({ 
                        ...prev, 
                        dob: `${day}.${month}.${year}`
                      }));
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="license">Driver License</Label>
                  <Input 
                    id="license"
                    value={personalInfo.license}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, license: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry">License Expiry Date</Label>
                  <Input 
                    id="expiry"
                    type="date"
                    value={personalInfo.expirationDate ? personalInfo.expirationDate.split('.').reverse().join('-') : ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      const [year, month, day] = date.split('-');
                      setPersonalInfo(prev => ({ 
                        ...prev, 
                        expirationDate: `${day}.${month}.${year}`
                      }));
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input 
                    id="nationality"
                    value={personalInfo.nationality}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, nationality: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address"
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline">Cancel</Button>
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" onClick={handlePersonalInfoSave}>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline">Cancel</Button>
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" onClick={handleContactInfoSave}>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Booking Updates</div>
                    <div className="text-muted-foreground text-sm">
                      Get notified about your booking status and changes.
                    </div>
                  </div>
                  <Switch 
                    id="booking-notifications" 
                    checked={notificationPreferences.booking}
                    onCheckedChange={() => handleNotificationToggle('booking')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Promotions</div>
                    <div className="text-muted-foreground text-sm">
                      Receive notifications about new offers and deals.
                    </div>
                  </div>
                  <Switch 
                    id="promotion-notifications" 
                    checked={notificationPreferences.promotion}
                    onCheckedChange={() => handleNotificationToggle('promotion')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Updates</div>
                    <div className="text-muted-foreground text-sm">
                      Get notified about payments and billing information.
                    </div>
                  </div>
                  <Switch 
                    id="payment-notifications" 
                    checked={notificationPreferences.payment}
                    onCheckedChange={() => handleNotificationToggle('payment')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Rewards Updates</div>
                    <div className="text-muted-foreground text-sm">
                      Receive updates about your rewards points and benefits.
                    </div>
                  </div>
                  <Switch 
                    id="rewards-notifications" 
                    checked={notificationPreferences.rewards}
                    onCheckedChange={() => handleNotificationToggle('rewards')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Reminders</div>
                    <div className="text-muted-foreground text-sm">
                      Get reminded about upcoming bookings and deadlines.
                    </div>
                  </div>
                  <Switch 
                    id="reminder-notifications" 
                    checked={notificationPreferences.reminder}
                    onCheckedChange={() => handleNotificationToggle('reminder')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline">Cancel</Button>
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" onClick={() => handleNotificationToggle('booking')}>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>Select your preferred language.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={language} 
                onValueChange={setLanguage}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-white" style={{ backgroundColor: "#fff" }}>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="turkish">Turkish</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                style={{ border: "none" }} 
                variant="outline"
                onClick={() => {
                  setLanguage(userSettings?.language ?? 'english');
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                onClick={() => handleLanguageChange(language)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
            <CardHeader>
              <CardTitle>Membership Rewards</CardTitle>
              <CardDescription>View and manage your membership rewards.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Current Points</div>
                    <div className="text-muted-foreground text-sm">
                      Use your points for discounts on rentals.
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{rewardPoints ?? 0}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Points Rate</div>
                    <div className="text-muted-foreground text-sm">
                      Earn 0.1 points for every $1 spent
                    </div>
                  </div>
                  <Link href="/User_Account/User_Promotions">
                    <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline">
                      View History
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline">Cancel</Button>
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }} >
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button 
                  className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-xl" 
                  style={{ border: "none" }} 
                  variant="outline"
                  onClick={() => setShowDeactivateDialog(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deactivate Account"}
                </Button>
                <Button 
                  className="px-6 py-3 text-lg font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors hover:bg-muted shadow-xl" 
                  style={{ border: "none" }} 
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Account"}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }} ref={paymentMethodsRef}>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {isLoadingPaymentMethods ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium capitalize">
                          {method.card.brand} •••• {method.card.last4}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Expires {method.card.exp_month}/{method.card.exp_year}
                        </div>
                      </div>
                      <Button 
                        className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" 
                        variant="outline" 
                        onClick={() => removePaymentMethod(method.id)}
                        disabled={isDeletingPaymentMethod === method.id}
                      >
                        {isDeletingPaymentMethod === method.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Remove'
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No payment methods saved.</p>
                )}
                <Link href="/User_Account/add-payment-method">
                  <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" variant="outline" style={{ border: "none" }}>
                    Add New Payment Method
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }} >
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Choose between light and dark mode.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Dark Mode</div>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }} variant="outline">Cancel</Button>
              <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl">Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Separator />
      <Footer/>
      
      <Dialog open={verifyDialog} onOpenChange={setVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" onClick={handleVerifyCode}>Verify Email</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showSocialDialog} onOpenChange={setShowSocialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Your Account</DialogTitle>
            <DialogDescription>
              We noticed you&apos;re using a {pendingSocialEmail === 'google' ? 'Gmail' : 'Microsoft'} email. 
              Would you like to connect your {pendingSocialEmail === 'google' ? 'Google' : 'Microsoft'} account for easier login?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" onClick={handleConnectSocial}>
              {pendingSocialEmail === 'google' ? 'Connect Google Account' : 'Connect Microsoft Account'}
            </Button>
            <Button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" variant="outline" onClick={() => {
              setShowSocialDialog(false);
              setVerifyDialog(true);
            }}>
              Skip for now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent className="bg-white" style={{ backgroundColor: "#fff" }}>
          <DialogHeader>
            <DialogTitle>Deactivate Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate your account? You can reactivate it later by signing in again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button 
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }}
              variant="outline" 
              onClick={() => setShowDeactivateDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              className="px-6 py-3 text-lg font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }}
              variant="destructive"
              onClick={handleDeactivateAccount}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deactivate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white" style={{ backgroundColor: "#fff" }}>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button 
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }}
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              className="px-6 py-3 text-lg font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors hover:bg-muted shadow-2xl" style={{ border: "none" }}
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Permanently"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
