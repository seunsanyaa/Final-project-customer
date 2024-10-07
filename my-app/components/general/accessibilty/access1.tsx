"use client"
import React from 'react';

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';

// Define types for better type safety
type AccessibilityFeature = string;
type Vehicle = {
  id: number;
  make: string;
  model: string;
  features: AccessibilityFeature[];
  price: number;
  image: string;
};

type Filters = {
  accessibility: AccessibilityFeature[];
  make: string;
  model: string;
  location: string;
};

export  function Access1() {
  // State for filters
  const [filters, setFilters] = useState<Filters>({
    accessibility: [],
    make: "",
    model: "",
    location: "",
  })

  // Mock data for accessible vehicles
  const accessibleVehicles: Vehicle[] = [
    {
      id: 1,
      make: "Toyota",
      model: "Sienna",
      features: ["Wheelchair accessible", "Hand controls"],
      price: 59.99,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      make: "Honda",
      model: "Odyssey",
      features: ["Wheelchair accessible", "Hearing impaired features"],
      price: 64.99,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      make: "Dodge",
      model: "Grand Caravan",
      features: ["Wheelchair accessible", "Visually impaired features"],
      price: 54.99,
      image: "/placeholder.svg",
    },
    {
      id: 4,
      make: "Ford",
      model: "Explorer",
      features: ["Hand controls"],
      price: 49.99,
      image: "/placeholder.svg",
    },
    {
      id: 5,
      make: "Chrysler",
      model: "Pacifica",
      features: ["Wheelchair accessible", "Hearing impaired features", "Visually impaired features"],
      price: 69.99,
      image: "/placeholder.svg",
    },
    {
      id: 6,
      make: "Volkswagen",
      model: "Caddy",
      features: ["Wheelchair accessible", "Hand controls", "Hearing impaired features"],
      price: 57.99,
      image: "/placeholder.svg",
    },
    {
      id: 7,
      make: "Mercedes-Benz",
      model: "V-Class",
      features: ["Wheelchair accessible", "Visually impaired features", "Hand controls"],
      price: 79.99,
      image: "/placeholder.svg",
    },
    {
      id: 8,
      make: "Kia",
      model: "Carnival",
      features: ["Wheelchair accessible", "Hearing impaired features"],
      price: 61.99,
      image: "/placeholder.svg",
    },
    {
      id: 9,
      make: "Chevrolet",
      model: "Traverse",
      features: ["Hand controls", "Visually impaired features"],
      price: 53.99,
      image: "/placeholder.svg",
    },
    {
      id: 10,
      make: "Renault",
      model: "Trafic",
      features: ["Wheelchair accessible", "Hearing impaired features", "Hand controls"],
      price: 59.99,
      image: "/placeholder.svg",
    },
  ]

  // Filter vehicles based on selected filters
  const filteredVehicles = useMemo(() => {
    return accessibleVehicles.filter((vehicle) => {
      // Check if all selected accessibility features are present in the vehicle
      if (
        filters.accessibility.length > 0 &&
        !filters.accessibility.every((feature) => vehicle.features.includes(feature))
      ) {
        return false
      }
      // Filter by make
      if (filters.make && vehicle.make !== filters.make) {
        return false
      }
      // Filter by model
      if (filters.model && vehicle.model !== filters.model) {
        return false
      }
      // Filter by location (if location property exists)
      if (filters.location && 'location' in vehicle && vehicle.location !== filters.location) {
        return false
      }
      return true
    })
  }, [filters])

  // Handle filter changes
  const handleFilterChange = (type: keyof Filters, value: string | AccessibilityFeature[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }))
  }

  // Handle checkbox changes for accessibility features
  const handleAccessibilityChange = (feature: AccessibilityFeature, checked: boolean) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      accessibility: checked
        ? [...prevFilters.accessibility, feature]
        : prevFilters.accessibility.filter((f) => f !== feature),
    }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navi/>
      <main className="flex-1 bg-background text-foreground py-8 px-6">
        <div className="container mx-auto">
          {/* Vehicle Browse Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Accessible Vehicle Browse</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-card rounded-lg shadow-md overflow-hidden">
                  {/* Vehicle image */}
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                    style={{ aspectRatio: "300/200", objectFit: "cover" }}
                  />
                  <div className="p-4">
                    {/* Vehicle details */}
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

          {/* Filter and Search Section */}
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
          </section>
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
  )
}