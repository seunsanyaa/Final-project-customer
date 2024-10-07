'use client'

import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Car } from "lucide-react"
import Link from 'next/link'

export function SignupPage() {
  // State management for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    driverLicense: '',
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement form validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match")
      return
    }
    // TODO: Implement API call for user registration
    console.log('Signup attempt with:', formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Logo */}
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
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    type="text" 
                    required 
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    type="text" 
                    required 
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {/* Password fields */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              {/* Driver's License field */}
              <div className="space-y-2">
                <Label htmlFor="driverLicense">Driver's License Number</Label>
                <Input 
                  id="driverLicense"
                  name="driverLicense"
                  type="text" 
                  required
                  value={formData.driverLicense}
                  onChange={handleInputChange}
                />
              </div>
              {/* Terms and conditions checkbox */}
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
              {/* Submit button */}
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
