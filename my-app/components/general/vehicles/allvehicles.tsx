import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"; // Ensure Separator is imported
import { useQuery } from "convex/react";
import { Search } from "lucide-react"; // Import Car icon
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Footer } from "../head/footer";
import { Navi } from "../head/navi";

export default function AllVehicles() {
  // Fetch cars from Convex
  const cars = useQuery(api.car.getAllCars);
  const [searchMake, setSearchMake] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [searchYear, setSearchYear] = useState<number | undefined>(undefined);

  // Filter cars based on search inputs
  const filteredCars = cars?.filter((car) => {
    return (
      (searchMake
        ? car.maker.toLowerCase().includes(searchMake.toLowerCase())
        : true) &&
      (searchModel
        ? car.model.toLowerCase().includes(searchModel.toLowerCase())
        : true) &&
      (searchYear ? car.year === searchYear : true)
    );
  });

  if (!cars) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navi/>
      <Separator />
      <main className="flex flex-col items-center gap-4 p-4 md:p-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-6">
              Find Your Perfect Rental Car
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Make"
                value={searchMake}
                onChange={(e) => setSearchMake(e.target.value)}
              />
              <Input
                placeholder="Model"
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
              />
              <div className="flex items-center"> 
                <Input
                  placeholder="Year"
                  type="number"
                  min="1990"
                  max="2024"
                  value={searchYear}
                  onChange={(e) =>
                    setSearchYear(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
                <Button className="md:w-auto border-2 ml-2 hover:bg-muted"> 
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button className="text-blue-500 hover:bg-muted border-2">
                Advanced Search
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredCars ?? []).map((car) => (
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
            {(filteredCars?.length ?? 0) === 0 && (
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
