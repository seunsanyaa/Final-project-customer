"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import {useUser} from "@clerk/nextjs"
interface Booking {
  _id: string;
  make: string;
  model: string;
  color: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  licensePlate: string;
  pickupLocation: string;
  dropoffLocation: string;
  carId: string;
  trim: string; // Added trim field
}

export function Mybookings() {

  const {user} = useUser();
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [filterStartDate, setFilterStartDate] = useState<string | null>(null)
  const [filterEndDate, setFilterEndDate] = useState<string | null>(null)
  const [filterMake, setFilterMake] = useState("")
  const [filterModel, setFilterModel] = useState("")
  const [filterColor, setFilterColor] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
console.log(user)
  // Replace the customerId state with a hardcoded value or retrieve it from auth
  const customerId = user?.id || "";
if (customerId === "") {
  return <div>Please Login to View your Bookings</div>
}
  // Use Convex's query hook to fetch bookings
  const bookings = useQuery(api.bookings.getBookingsByCustomer, { customerId });

  useEffect(() => {
    if (bookings) {
      setFilteredBookings(bookings);
    }
  }, [bookings]);

  const handleFilterChange = () => {
    let filtered = bookings || [];
    if (filterStartDate) {
      filtered = filtered.filter((booking) => new Date(booking.startDate) >= new Date(filterStartDate))
    }
    if (filterEndDate) {
      filtered = filtered.filter((booking) => new Date(booking.endDate) <= new Date(filterEndDate))
    }
    if (filterMake) {
      filtered = filtered.filter((booking) => booking.make.toLowerCase().includes(filterMake.toLowerCase()))
    }
    if (filterModel) {
      filtered = filtered.filter((booking) => booking.model.toLowerCase().includes(filterModel.toLowerCase()))
    }
    if (filterColor) {
      filtered = filtered.filter((booking) => booking.color.toLowerCase().includes(filterColor.toLowerCase()))
    }
    setFilteredBookings(filtered)
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const currentBooking = bookings?.[0];
  const pastBookings = bookings?.filter(booking => new Date(booking.startDate) < new Date());

  const carDetails = useQuery(api.bookings.getCarByCarId, 
    currentBooking ? { carId: currentBooking.carId } : "skip"
  );

  return (
    <>
      <Navi />

      <Separator />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Your Car Bookings</h1>
        <Link href={`bookings/currentbooking?bookingId=${currentBooking?._id}`} className='hover:cursor-pointer'>
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Current Booking</h2>
                {currentBooking ? (
                  <p className="text-muted-foreground">Rental Dates: {currentBooking.startDate} - {currentBooking.endDate}</p>
                ) : (
                  <p className="text-muted-foreground">No current bookings</p>
                )}
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold">${currentBooking ? currentBooking.totalCost : 0}</h3>
                <p className="text-muted-foreground">Total Cost</p>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Car Model</h3>
                <p>{carDetails ? `${carDetails.maker} ${carDetails.model}` : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Trim</h3>
                <p>{carDetails ? carDetails.trim : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">License Plate</h3>
                <p>{carDetails ? `${carDetails.registrationNumber}` : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pickup Location</h3>
                <p>{currentBooking ? currentBooking.pickupLocation : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Return Location</h3>
                <p>{currentBooking ? currentBooking.dropoffLocation : 'N/A'}</p>
              </div>
            </div>
          </div>
        </Link>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-background rounded-lg shadow-md p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4">Filter Bookings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-muted-foreground">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={filterStartDate || ""}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-muted-foreground">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={filterEndDate || ""}
                  onChange={(e) => setFilterEndDate(e.target.value || null)}
                  className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label
                  htmlFor="make"
                  className="block text-sm font-medium text-muted-foreground">
                  Make
                </label>
                <input
                  type="text"
                  id="make"
                  value={filterMake}
                  onChange={(e) => setFilterMake(e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-muted-foreground">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-muted-foreground">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div className="mt-4 justify-self-end">
              <Button onClick={handleFilterChange} className="border-2 hover:bg-muted">Filter</Button>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <Card key={booking._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold">{booking.make}</div>
                      <div className="text-muted-foreground">{booking.model}</div>
                    </div>
                    <div className="text-muted-foreground">{booking.color}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-medium">Start Date</div>
                        <div>{booking.startDate}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">End Date</div>
                        <div>{booking.endDate}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Total Cost</div>
                        <div>${booking.totalCost.toFixed(2)}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={() => handleViewDetails(booking)} 
                      className="border-2 bg-transparent hover:bg-muted">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Separator/>
        {selectedBooking && (
          <Dialog
            open={!!selectedBooking}
            onOpenChange={(open) => setSelectedBooking(open ? selectedBooking : null)}>
            <DialogContent className="sm:max-w-[425px]" style={{ opacity: 1, backgroundColor: '#ffffff', zIndex: 50 }}>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium">Make</div>
                    <div>{selectedBooking?.make}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Model</div>
                    <div>{selectedBooking.model}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Color</div>
                    <div>{selectedBooking.color}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Start Date</div>
                    <div>{selectedBooking.startDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">End Date</div>
                    <div>{selectedBooking.endDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Total Cost</div>
                    <div>${selectedBooking.totalCost.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {!bookings && <p>Loading...</p>}
        {bookings && bookings.length === 0 && <p>No bookings available.</p>}
      </div>
      <Footer/>
    </>
  );
}
