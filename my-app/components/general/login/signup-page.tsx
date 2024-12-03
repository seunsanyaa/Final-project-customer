'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Car } from "lucide-react"
import Link from 'next/link'

export function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [driverLicense, setDriverLicense] = useState('')

  const handleSubmit = (e:any) => {
    e.preventDefault()
    // Here you would typically handle the signup logic
    console.log('Signup attempt with:', { firstName, lastName, email, password, driverLicense })
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Car className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign up for CarRent</CardTitle>
          <CardDescription className="text-center">
            Create an account to start renting cars today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    type="text" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverLicense">Driver&apos;s License Number</Label>
                <Input 
                  id="driverLicense" 
                  type="text" 
                  required
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-500 hover:underline">
                    terms and conditions
                  </Link>
                </label>
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center">
          <div className="text-sm">
            Already have an account?{" "}
            <Link href="/Login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
