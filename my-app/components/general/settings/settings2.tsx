
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
export function Settings2() {

  return (
    <>
      <Navi/>
      <Separator/>
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter your address" />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        <Card>
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
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Select your preferred language.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Arabic</SelectItem>
                <SelectItem value="es">Turkish</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        <Card>
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
        <Card>
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
    <Card>
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

    <Card>
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

    <Card>
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

    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>Choose between light and dark mode.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Dark Mode</div>
            <Switch id="dark-mode" />
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
