
"use client"
import React from 'react';
import Link from 'next/link'; 

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';

export function Access1() {
  // Define ref3 and inView3 if they are not defined elsewhere
  const ref3 = React.useRef(null); // Example definition
  const inView3 = true; 

  return (
    <div className="flex flex-col min-h-screen">
      <Navi/>
      <main className="flex-1 bg-background text-foreground py-8 px-6">
        <div className="container mx-auto">
          <section className="flex justify-between items-center mb-8">
            <div className="text-left">
              <p className="text-4xl md:text-4xl lg:text-6xl font-bold">
              Driving with Confidence, Accessible Rentals for Everyone
              </p>
            </div>
            <img
              src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/2024_Chevrolet_Traverse_Premier_xnqy7b.avif"
              alt="Dodge Grand Caravan"
              width={400}
              height={300}
              className="w-[600px] h-[500px] object-cover"

            />
          </section>
          <section ref={ref3} className={`relative w-full h-auto overflow-hidden bg-gradient-to-b from-gray-200 to-white ${ 
            inView3 ? 'animate-fadeInUp' : "opacity-0"}`} > 
            <div className="max-w-full mx-auto h-full"> 
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-20 pl-4 pr-4 mb-20"> 
                <div className="flex flex-col items-center justify-center gap-4 p-6"> 
                  <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/Chrysler_Pacifica_Touring_L_keo0y6.avif" alt="Sedan" className="w-[300px] h-[220px] rounded-lg" /> 
                  <div className="text-center">
                    <h3 className="text-4xl font-semibold text-black mt-0">Chrysler Pacifica Touring L</h3>
                    <p className="text-black font-semibold">Accessible, Spacious, Family-Friendly</p> 
                    <p className="text-black">Starting from $120/day</p> 
                  </div>
                  <Link href="/Search">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted" variant="outline">Rent Now</Button> 
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6"> 
                  <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/2024_Toyota_Sienna_XLE_Hybrid_hgyrst.avif" alt="SUV" className="w-[300px] h-[220px] rounded-lg" /> 
                  <div className="text-center">
                    <h3 className="text-4xl font-semibold text-black">Toyota Sienna XLE Hybrid</h3>
                    <p className="text-black font-semibold">Hybrid, Comfortable, Efficient</p> 
                    <p className="text-black">Starting from $110/day</p> 
                  </div>
                  <Link href="/Search">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted" variant="outline">Rent Now</Button> 
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6"> 
                  <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/2024_Ford_Explorer_Limited_uwimkr.avif" alt="Luxury" className="w-[300px] h-[220px] rounded-lg" /> 
                  <div className="text-center">
                    <h3 className="text-4xl font-semibold text-black mt-1">Ford Explorer Limited</h3>
                    <p className="text-black font-semibold">Rugged, Spacious, Tech-Savvy</p> 
                    <p className="text-black">Starting from $100/day</p> 
                  </div>
                  <Link href="/Search">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted" variant="outline">Rent Now</Button> 
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6"> 
                  <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730143352/2024_Chevrolet_Traverse_Premier_xnqy7b.avif" alt="Van" className="w-[300px] h-[220px] rounded-lg" /> 
                  <div className="text-center mb-0 mt-0">
                    <h3 className="text-4xl font-semibold text-black">Chevrolet Traverse Premier</h3>
                    <p className="text-black font-semibold mb-0">Roomy, Family-Oriented, Versatile</p> 
                    <p className="text-black">Starting from $100/day</p> 
                  </div>
                  <Link href="/Search">
                    <Button className="hover:bg-blue-500 hover:shadow-lg  hover:bg-muted transition-all duration-300 rounded-lg mt-0" variant="outline">Rent Now</Button> 
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6"> 
                  <img src="https://res.cloudinary.com/dihvudxbt/image/upload/v1729200173/JKAR_22_Compact_Cargo_Van_AngularFront_US_ENG_280x210_wsqbrx.avif" alt="Van" className="w-[300px] h-[220px] rounded-lg" /> 
                  <div className="text-center mb-0 mt-0">
                    <h3 className="text-4xl font-semibold text-black">Ford Compact Cargo Van</h3>
                    <p className="text-black font-semibold mb-0">Practical, Efficient, Functional</p> 
                    <p className="text-black">Starting from $70/day</p> 
                  </div>
                  <Link href="/Search">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg mt-0 hover:bg-muted" variant="outline">Rent Now</Button> 
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 p-6 "> 
                  <img src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1730144513/2024_GMC_Yukon_XL_SLT_ydl8yb.jpg" alt="Van" className="w-[300px] h-[220px] rounded-lg" /> 
                  <div className="text-center mb-0 mt-0">
                    <h3 className="text-4xl font-semibold text-black">GMC Yukon XL SLT</h3>
                    <p className="text-black font-semibold mb-0">Luxurious, Spacious, Strong</p> 
                    <p className="text-black">Starting from $150/day</p> 
                  </div>
                  <Link href="/Search">
                    <Button className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg mt-0 hover:bg-muted" variant="outline">Rent Now</Button> 
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Driver Accessibility Features Section
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Accessible Vehicle Browse</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-card rounded-lg shadow-md overflow-hidden">
                  <img
                    src="/placeholder.svg"
                    alt={`${vehicle.make} ${vehicle.model}`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                    style={{ aspectRatio: "300/200", objectFit: "cover" }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vehicle.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">${vehicle.price}/day</span>
                      <Button>Reserve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Accessible Vehicle Filter and Search</h2>
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="accessibility" className="block font-bold mb-2">
                    Accessibility Features
                  </label>
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <Checkbox value="Wheelchair accessible">Wheelchair accessible</Checkbox>
                      <Checkbox value="Hand controls">Hand controls</Checkbox>
                      <Checkbox value="Hearing impaired features">Hearing impaired features</Checkbox>
                      <Checkbox value="Visually impaired features">Visually impaired features</Checkbox>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="make" className="block font-bold mb-2">
                    Make
                  </label>
                  <Select name="make" value={filters.make} onValueChange={(value) => handleFilterChange("make", value)}>
                    <SelectTrigger  className="w-full">
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Dodge">Dodge</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                      <SelectItem value="Chrysler">Chrysler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="model" className="block font-bold mb-2">
                    Model
                  </label>
                  <Select
                    name="model"
                    value={filters.model}
                    onValueChange={(value) => handleFilterChange("model", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sienna">Sienna</SelectItem>
                      <SelectItem value="Odyssey">Odyssey</SelectItem>
                      <SelectItem value="Grand Caravan">Grand Caravan</SelectItem>
                      <SelectItem value="Explorer">Explorer</SelectItem>
                      <SelectItem value="Pacifica">Pacifica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="location" className="block font-bold mb-2">
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Accessible Vehicle Deals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg shadow-md overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Accessible Vehicle Deal"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">Wheelchair Accessible Van</h3>
                  <p className="text-muted-foreground mb-4">Save 20% on our wheelchair accessible van rental.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">$47.99/day</span>
                    <Button>Reserve</Button>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-md overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Accessible Vehicle Deal"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">Hand Controlled Car</h3>
                  <p className="text-muted-foreground mb-4">Get 15% off our hand controlled car rental.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">$42.49/day</span>
                    <Button>Reserve</Button>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-md overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Accessible Vehicle Deal"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">Visually Impaired Features</h3>
                  <p className="text-muted-foreground mb-4">
                    Save 10% on our vehicles with visually impaired features.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">$44.99/day</span>
                    <Button>Reserve</Button>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Accessibility Information</h2>
            <div className="bg-card rounded-lg shadow-md p-6">
              <p className="text-muted-foreground mb-4">
                At Accessible Rentals, we are committed to providing a seamless and inclusive experience for all our
                customers. Our fleet of vehicles is equipped with a variety of accessibility features, catering to the
                diverse needs of individuals with disabilities.
              </p>
              <p className="text-muted-foreground mb-4">
                Whether you require a wheelchair-accessible van, a car with hand controls, or a vehicle with specialized
                features for the visually or hearing impaired, we have you covered. Our knowledgeable staff is dedicated
                to assisting you in finding the perfect vehicle to meet your needs and ensuring a comfortable and
                stress-free rental experience.
              </p>
              <p className="text-muted-foreground">
                If you have any questions or need additional support, please don't hesitate to contact our accessibility
                team. We are here to help you every step of the way.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
