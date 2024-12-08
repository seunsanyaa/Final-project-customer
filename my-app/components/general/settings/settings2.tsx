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
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { clerkClient } from "@clerk/nextjs/server";

export function Settings2() {
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
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
      await editUser({
        userId: user.id,
        email: contactInfo.email,
      });

      await upsertCustomer({
        userId: user.id,
        phoneNumber: contactInfo.phone,
      });
    } catch (error) {
      console.error('Error updating contact info:', error);
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
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
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
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter your current password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter your new password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Change Password</Button>
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
                    <div className="font-medium">New Rental Offers</div>
                    <div className="text-muted-foreground text-sm">Receive notifications about new rental offers.</div>
                  </div>
                  <Switch id="new-rental-offers" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Reservation Updates</div>
                    <div className="text-muted-foreground text-sm">Get notified about changes to your reservations.</div>
                  </div>
                  <Switch id="reservation-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Membership Rewards</div>
                    <div className="text-muted-foreground text-sm">Receive updates about your membership rewards.</div>
                  </div>
                  <Switch id="membership-rewards" />
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
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Customize your accessibility settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">High Contrast Mode</div>
                    <div className="text-muted-foreground text-sm">Increase the contrast for better visibility.</div>
                  </div>
                  <Switch id="high-contrast-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Screen Reader Support</div>
                    <div className="text-muted-foreground text-sm">
                      Enable screen reader support for better accessibility.
                    </div>
                  </div>
                  <Switch id="screen-reader-support" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Keyboard Navigation</div>
                    <div className="text-muted-foreground text-sm">Allow keyboard-only navigation through the app.</div>
                  </div>
                  <Switch id="keyboard-navigation" />
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
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Profile Visibility</div>
                    <div className="text-muted-foreground text-sm">Control who can see your profile.</div>
                  </div>
                  <Switch id="profile-visibility" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Activity Status</div>
                    <div className="text-muted-foreground text-sm">Show when you are online.</div>
                  </div>
                  <Switch id="activity-status" />
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
          <Card className="w-full mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }} >
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-muted-foreground text-sm">Visa ending in 1234</div>
                  </div>
                  <Button variant="outline">Remove</Button>
                </div>
                <Button variant="outline">Add New Payment Method</Button>
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
    </>
  );
}
