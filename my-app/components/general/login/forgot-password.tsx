'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, ArrowLeft } from "lucide-react"
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Component for handling the forgot password functionality
export function ForgotPassword() {
  // State for email input and form submission status
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulating an API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Password reset requested for:', email)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error requesting password reset:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <Car className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            // Password reset request form
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Reset Password'}
                </Button>
              </div>
            </form>
          ) : (
            // Success message after form submission
            <Alert>
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription>
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* Back to login link */}
          <Link href="/login" className="text-sm text-blue-500 hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
