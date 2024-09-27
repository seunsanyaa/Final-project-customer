
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Search, Car } from "lucide-react";  // Import Car icon
import Image from "next/image";
import { Separator } from "@/components/ui/separator"; // Ensure Separator is imported
import { Navi } from "../head/navi"
import { Footer } from "../head/footer";
export default function AllVehicles() {
  // Initialize state for menu open/close status

  const searchResults = [
    { id: 1, make: "Toyota", model: "Camry", year: 2022, image: "/placeholder.svg" },
    { id: 2, make: "Honda", model: "Civic", year: 2021, image: "/placeholder.svg" },
    { id: 3, make: "Ford", model: "Mustang", year: 2023, image: "/placeholder.svg" },
    { id: 4, make: "Tesla", model: "Model 3", year: 2022, image: "/placeholder.svg" },
  ];

  return (
    <>
      <Navi/>
      <Separator />
      <main className="flex flex-col items-center gap-4 p-4 md:p-8">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Rental Car</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input placeholder="Make" />
          <Input placeholder="Model" />
          <Input placeholder="Year" type="number" min="1990" max="2024" />
        </div>
        <div className="flex justify-center items-center mb-4 mx-auto">
  <Button className="w-full md:w-auto mr-2">
    <Search className="w-4 h-4 mr-2" />
    Search
  </Button>
  <Button size="icon" className="rounded-s-lg">
    <Mic className="w-4 h-4" />
    <span className="sr-only">Voice Search</span>
  </Button>
</div>

        <div className="text-center">
          <Button variant="link" className="text-blue-500 hover:text-blue-700">
            Advanced Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <Image
              src={car.image}
              alt={`${car.make} ${car.model}`}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{car.make} {car.model}</h2>
              <p className="text-muted-foreground mb-4">Year: {car.year}</p>
              <Link href="/carinfo"><Button className="w-full">Book Now</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </main>
    <Separator />
    <Footer/>
    </>
  );
}
