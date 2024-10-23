import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { Navi } from "../head/navi";
import { Separator } from "@/components/ui/separator";
export function User_page() {
  const { user } = useUser(); // Access Clerk's user data

  // State to manage edit modes and input values
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.firstName || "Jane ",
    // Random placeholder data
    occupation: "Software Developer",
    address: "1234 Elm Street, Springfield",
  });

  const [contactInfo, setContactInfo] = useState({
    email: user?.emailAddresses[0].emailAddress || "jane.smith@example.com",
    // Random placeholder data
    phone: "+1 (555) 987-6543",
    socialMedia: "@janesmith",
    password: "", // Password field (cannot fetch from Clerk)
  });

  const handleEditPersonal = () => {
    setIsEditingPersonal((prev) => !prev);
  };

  const handleEditContact = () => {
    setIsEditingContact(!isEditingContact);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navi />
      <Separator />
      <div className="flex flex-row h-[92vh]">
        <aside className="flex flex-col items-left justify-between w-fit px-4 md:px-6 border-b bg-primary text-primary-foreground py-2 md:py-12">
          <nav className="flex flex-col items-left justify-between h-fit w-fit gap-4 sm:gap-6">
            <div className="flex flex-col md:flex items-left gap-4 w-fit">
              <Link
                href="#"
                className="text-background drop-shadow-glow hover:text-customyello transition-colors"
                prefetch={false}
              >
                Account Details
              </Link>
              <Link
                href="/User_Account/User_Rev"
                className="text-muted-foreground hover:text-customyello transition-colors"
                prefetch={false}
              >
                My Ratings & Reviews
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-customyello transition-colors"
                prefetch={false}
              >
                Previous Bookings
              </Link>
            </div>
          </nav>
        </aside>
        <main className="flex-1 bg-background py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen mx-auto grid grid-rows-2 sm:grid-rows-2 gap-6">
            {/* Personal Information Card */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row w-full justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
                  <div className="grid gap-2">
                    <Label className="text-primary-foreground">
                      Full Name
                    </Label>
                    {isEditingPersonal ? (
                      <input
                        value={personalInfo.fullName}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            fullName: e.target.value,
                          })
                        }
                        className="input-class" // Add your input styling here
                      />
                    ) : (
                      <div className="text-black">{personalInfo.fullName}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-primary-foreground">
                      Occupation
                    </Label>
                    {isEditingPersonal ? (
                      <input
                        value={personalInfo.occupation}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            occupation: e.target.value,
                          })
                        }
                        className="input-class"
                      />
                    ) : (
                      <div className="text-black">{personalInfo.occupation}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-primary-foreground">
                      Address
                    </Label>
                    {isEditingPersonal ? (
                      <input
                        value={personalInfo.address}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            address: e.target.value,
                          })
                        }
                        className="input-class"
                      />
                    ) : (
                      <div className="text-black">{personalInfo.address}</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-secondary-foreground text-white ml-3 hover:bg-customgrey hover:text-primary-foreground"
                  onClick={handleEditPersonal} // Toggle edit mode for personal info
                >
                  {isEditingPersonal ? "Confirm" : "Edit"}
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="bg-muted text-secondary-foreground">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row w-full justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
                  <div className="grid gap-2">
                    <Label className="text-secondary-foreground">Email</Label>
                    {isEditingContact ? (
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            email: e.target.value,
                          })
                        }
                        className="input-class"
                      />
                    ) : (
                      <div>{contactInfo.email}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-secondary-foreground">Phone</Label>
                    {isEditingContact ? (
                      <input
                        value={contactInfo.phone}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            phone: e.target.value,
                          })
                        }
                        className="input-class"
                      />
                    ) : (
                      <div>{contactInfo.phone}</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-secondary-foreground">Social Media</Label>
                    {isEditingContact ? (
                      <input
                        value={contactInfo.socialMedia}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            socialMedia: e.target.value,
                          })
                        }
                        className="input-class"
                      />
                    ) : (
                      <div>{contactInfo.socialMedia}</div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-2">
                    <Label className="text-secondary-foreground">Password</Label>
                    {isEditingContact ? (
                      <div className="relative">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          value={contactInfo.password}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              password: e.target.value,
                            })
                          }
                          className="input-class pr-10" // Add padding to make space for the icon
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        >
                          {isPasswordVisible ? (
                            // Hide Icon (e.g., Eye Off)
                            <svg
                              className="h-5 w-5 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.707 3.707a1 1 0 00-1.414-1.414l12 12a1 1 0 001.414-1.414l-12-12z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            // Show Icon (e.g., Eye)
                            <svg
                              className="h-5 w-5 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 3C5 3 1.73 7.11 1.73 7.11S5 11.22 10 11.22s8.27-4.11 8.27-4.11S15 3 10 3z" />
                              <path d="M10 13.22c-2.66 0-5.12-1.3-6.46-3.22 1.34-1.92 3.8-3.22 6.46-3.22s5.12 1.3 6.46 3.22c-1.34 1.92-3.8 3.22-6.46 3.22z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div>********</div> // Password is hidden by default
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-customgrey hover:text-primary-foreground ml-3"
                  onClick={handleEditContact} // Toggle edit mode for contact info
                >
                  {isEditingContact ? "Confirm" : "Edit"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
