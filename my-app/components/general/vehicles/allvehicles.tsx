import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"; // Ensure Separator is imported
import { useQuery } from "convex/react";
import { Search } from "lucide-react"; // Import Car icon
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";

import { api } from "@/convex/_generated/api";
import { Footer } from "../head/footer";
import { Navi } from "../head/navi";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import loadingAnimation from "@/public/animations/loadingAnimation.json"; // Import your animation

export default function AllVehicles() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Declare all state variables first
  const [searchParams, setSearchParams] = useState({
    maker: "",
    model: "",
    year: undefined as number | undefined,
    engineType: "",
    engineCylinders: "",
    fuelType: "",
    transmission: "",
    drive: "",
    doors: "",
  });

  // Add a separate state for input values
  const [inputValues, setInputValues] = useState({
    maker: "",
    model: "",
    year: "",
    engineType: "",
    engineHorsepower: "",
    engineCylinders: "",
    fuelType: "",
    transmission: "",
    drive: "",
    doors: "",

  });

  // Then use them in the query
  const cars = useQuery(api.car.getFilteredCars, searchParams);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Optionally set speed after the component mounts
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.5);
      
    }
  }, []);

  // Add this handler for input changes
  const handleInputChange = (field: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add this handler for the search button
  const handleSearch = () => {
    setSearchParams({
      ...inputValues,
      year: inputValues.year ? parseInt(inputValues.year) : undefined,
    });
  };

  if (!cars) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie
          lottieRef={lottieRef}
          animationData={loadingAnimation}
          loop={true}
          className="w-48 h-48"
        />
      </div>
    );
  }

  return (
    <>
      <Navi />
      <Separator />
      <main className="flex flex-col items-center gap-4 p-4 md:p-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-6">Find Your Perfect Rental Car</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Make"
                value={inputValues.maker}
                onChange={(e) => handleInputChange('maker', e.target.value)}
              />
              <Input
                placeholder="Model"
                value={inputValues.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />
              <div className="flex items-center">
                <Input
                  placeholder="Year"
                  type="number"
                  min="1990"
                  max="2024"
                  value={inputValues.year}
                  onChange={(e) =>
                    handleInputChange('year', e.target.value)
                  }
                />
                <Button className="md:w-auto border-2 ml-2 hover:bg-muted" onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button 
                className="text-blue-500 hover:bg-muted border-2"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide Advanced Search' : 'Advanced Search'}
              </Button>
              
              {showAdvanced && (
                <div className="mt-4 border rounded-lg p-4 bg-background">
                  <h3 className="text-lg font-semibold mb-4">Advanced Search</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    

                    <div className="space-y-2">
                      <Label htmlFor="engineType">Engine Type</Label>
                      <Input
                        id="engineType"
                        value={inputValues.engineType}
                        onChange={(e) => handleInputChange('engineType', e.target.value)}
                        placeholder="e.g., V6, Inline-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engineHorsepower">Engine Horsepower</Label>
                      <Input
                        id="engineHorsepower"
                        value={inputValues.engineHorsepower}
                        onChange={(e) => handleInputChange('engineHorsepower', e.target.value)}
                        placeholder="e.g., 300, 400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cylinders">Cylinders</Label>
                      <Input
                        id="cylinders"
                        value={inputValues.engineCylinders}
                        onChange={(e) => handleInputChange('engineCylinders', e.target.value)}
                        placeholder="e.g., 4, 6, 8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fuelType">Fuel Type</Label>
                      <Input
                        id="fuelType"
                        value={inputValues.fuelType}
                        onChange={(e) => handleInputChange('fuelType', e.target.value)}
                        placeholder="e.g., Gasoline, Diesel"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Input
                        id="transmission"
                        value={inputValues.transmission}
                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                        placeholder="e.g., Automatic, Manual"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="drive">Drive</Label>
                      <Input
                        id="drive"
                        value={inputValues.drive}
                        onChange={(e) => handleInputChange('drive', e.target.value)}
                        placeholder="e.g., AWD, FWD, RWD"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doors">Doors</Label>
                      <Input
                        id="doors"
                        value={inputValues.doors}
                        onChange={(e) => handleInputChange('doors', e.target.value)}
                        placeholder="e.g., 2, 4"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSearch}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(cars ?? []).map((car) => (
              <Card key={car._id} className="overflow-hidden">
                <Image
                  src={car.pictures[0]}
                  alt={`${car.maker} ${car.model}`}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover "
                />
                <CardContent className="p-4 text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    {car.maker} {car.model}
                  </h2>
                  <p className="text-muted-foreground mb-4">Year: {car.year}</p>
                  <Link href={`/carinfo?id=${car.registrationNumber}`}>
                    <Button className="w-auto border-2 hover:bg-muted">Book Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {(cars?.length ?? 0) === 0 && (
              <p>No cars found matching your criteria.</p>
            )}
          </div>
        </div>
      </main>
      <Separator />
      <Footer />
    </>
  );
}
