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
  const newSettings = { darkMode: darkMode, language: newLanguage };
  localStorage.setItem('userSettings', JSON.stringify(newSettings));
  setLanguage(newLanguage);
  if (user?.id) {
    await saveSettings({
      userId: user.id,
      darkMode: darkMode,
      language: newLanguage
    });
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
                    value={personalInfo.dob}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dob: e.target.value }))}
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
                    value={personalInfo.expirationDate}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, expirationDate: e.target.value }))}
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
              <Button variant="outline">Cancel</Button>
              <Button onClick={handlePersonalInfoSave}>Save Changes</Button>
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
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleContactInfoSave}>Save Changes</Button>
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
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>Select your preferred language.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="turkish">Turkish</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
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
                    <div className="text-muted-foreground text-sm">You have 2,500 points.</div>
                  </div>
                  <div className="font-medium">2,500</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Upcoming Rewards</div>
                    <div className="text-muted-foreground text-sm">Redeem your points for free rentals or upgrades.</div>
                  </div>
                  <Button variant="outline">View Rewards</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }} >
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button variant="outline">Deactivate Account</Button>
                <Button variant="outline">Delete Account</Button>
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
                  <Button variant="outline" className="w-full">
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
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
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
            <Button onClick={handleVerifyCode}>Verify Email</Button>
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
            <Button onClick={handleConnectSocial}>
              {pendingSocialEmail === 'google' ? 'Connect Google Account' : 'Connect Microsoft Account'}
            </Button>
            <Button variant="outline" onClick={() => {
              setShowSocialDialog(false);
              setVerifyDialog(true);
            }}>
              Skip for now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
