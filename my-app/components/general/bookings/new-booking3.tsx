import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
export function NewBooking3() {

  return (
    <>
      <Navi/>

      <Separator />

      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid md:grid-cols-[1fr_300px] gap-8 md:gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
            <p className="text-muted-foreground">Choose your extras, and complete your booking.</p>
          </div>
          <div className="space-y-6">

            <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="pickup-date">Pickup Date & Time</Label>
              <Input type="datetime-local" id="pickup-date" className="mt-1 w-full" />
            </div>
            <div>
              <Label htmlFor="dropoff-date">Drop-off Date & Time</Label>
              <Input type="datetime-local" id="dropoff-date" className="mt-1 w-full" />
            </div>
            <div>
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input id="pickup" placeholder="Enter location" />
            </div>
            <div>
              <Label htmlFor="dropoff">Drop-off Location</Label>
              <Input id="dropoff" placeholder="Enter location" />
            </div>
            </div>
            </div>
            <div>
            <div>
              <h2 className="text-2xl font-semibold">Choose Extras</h2>
              <div className="grid gap-4">
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Insurance</h3>
                        <p className="text-muted-foreground">Protect your rental with our comprehensive coverage.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$10/day</p>
                        <Checkbox />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">GPS</h3>
                        <p className="text-muted-foreground">Never get lost with our built-in navigation.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$5/day</p>
                        <Checkbox />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Child Seat</h3>
                        <p className="text-muted-foreground">Keep your little ones safe and secure.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$8/day</p>
                        <Checkbox />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p>Car Rental</p>
                  <p className="font-semibold">$50/day</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Insurance</p>
                  <p className="font-semibold">$10/day</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>GPS</p>
                  <p className="font-semibold">$5/day</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Child Seat</p>
                  <p className="font-semibold">$8/day</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">$73/day</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button variant="outline" className="border-2 hover:bg-muted">
                  Go Back
                </Button>
                <Link href="/Newbooking/payment"><Button className="border-2 hover:bg-muted">Continue</Button></Link>
              </div>
            </CardFooter>
          </Card>
          
        </div>
      </div>
    </div>
    <div>  {/* MAKE THIS MODULAR SO THAT WHEN A USER IS BOOKING FROM PROMOTIONS HE CAN SELECT CAR OTHERWISE THE CAR HE CHOSE IS SPECIFIED INSTEAD */}
              <h2 className="text-2xl font-semibold">Similar Cars</h2>
              <div className="flex overflow-x-auto gap-4">  {/* Changed to flex and added overflow-x-auto for horizontal scrolling */}
                <Card className="group min-w-[300px]">  {/* Added min-width to ensure cards maintain size */}
                  <CardContent>
                    <img
                      src="/placeholder.svg"
                      width={300}
                      height={200}
                      alt="Car"
                      className="rounded-lg object-cover aspect-video" />
                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold">Toyota Corolla</h3>
                      <p className="text-muted-foreground">Compact</p>
                      <p className="font-semibold">$50/day</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full hover:bg-muted">
                      Select
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="group min-w-[300px]">  {/* Added min-width to ensure cards maintain size */}
                  <CardContent>
                    <img
                      src="/placeholder.svg"
                      width={300}
                      height={200}
                      alt="Car"
                      className="rounded-lg object-cover aspect-video" />
                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold">Honda Civic</h3>
                      <p className="text-muted-foreground">Compact</p>
                      <p className="font-semibold">$55/day</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full hover:bg-muted">
                      Select
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="group min-w-[300px]">  {/* Added min-width to ensure cards maintain size */}
                  <CardContent>
                    <img
                      src="/placeholder.svg"
                      width={300}
                      height={200}
                      alt="Car"
                      className="rounded-lg object-cover aspect-video" />
                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold">Ford Mustang</h3>
                      <p className="text-muted-foreground">Midsize</p>
                      <p className="font-semibold">$75/day</p>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button variant="outline" className="w-full hover:bg-muted">
                      Select
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="group min-w-[300px]">  {/* Added min-width to ensure cards maintain size */}
                  <CardContent>
                    <img
                      src="/placeholder.svg"
                      width={300}
                      height={200}
                      alt="Car"
                      className="rounded-lg object-cover aspect-video" />
                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold">Kia Sportage</h3>
                      <p className="text-muted-foreground">Midsize</p>
                      <p className="font-semibold">$65/day</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full hover:bg-muted">
                      Select
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="group min-w-[300px]">  {/* Added min-width to ensure cards maintain size */}
                  <CardContent>
                    <img
                      src="/placeholder.svg"
                      width={300}
                      height={200}
                      alt="Car"
                      className="rounded-lg object-cover aspect-video" />
                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold">Kia Sportage</h3>
                      <p className="text-muted-foreground">Midsize</p>
                      <p className="font-semibold">$65/day</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full hover:bg-muted">
                      Select
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="group min-w-[300px]">  {/* Added min-width to ensure cards maintain size */}
                  <CardContent>
                    <img
                      src="/placeholder.svg"
                      width={300}
                      height={200}
                      alt="Car"
                      className="rounded-lg object-cover aspect-video" />
                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-semibold">Kia Sportage</h3>
                      <p className="text-muted-foreground">Midsize</p>
                      <p className="font-semibold">$65/day</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full hover:bg-muted">
                      Select
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="mt-6 flex justify-between items-center">
                {/* <div className="flex items-center gap-2">
                  <Label htmlFor="filter">Filter by:</Label>
                  <Select name="filter">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="size">Size</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="duration">Rental Duration:</Label>
                  <Select name="duration">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
    <Separator />

<Footer/>
</>
);
}
