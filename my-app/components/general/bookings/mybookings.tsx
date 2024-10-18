"use client"
import Link from "next/link"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import { api } from "@/convex/_generated/api"; // Import the API for fetching bookings
import axios from 'axios';

// Define the Booking interface
interface Booking {
  id: number;
  make: string;
  model: string;
  color: string;
  startDate: string;
  endDate: string;
  totalCost: number;
}

const API_BASE_URL = 'https://third-elk-244.convex.cloud/api';

export function Mybookings() {
  const [bookings, setBookings] = useState<Booking[]>([]); // Initialize bookings state
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]); // Initialize filtered bookings state
  const [filterStartDate, setFilterStartDate] = useState<string | null>(null)
  const [filterEndDate, setFilterEndDate] = useState<string | null>(null)  // Ensure filterEndDate can be string or null
  const [filterMake, setFilterMake] = useState("")
  const [filterModel, setFilterModel] = useState("")
  const [filterColor, setFilterColor] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [customerId, setCustomerId] = useState<string | null>(null); // Initialize customerId state
  const [loading, setLoading] = useState(false); // Add loading state if needed
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchCustomerId = async () => {
        const response = await axios.post(`${API_BASE_URL}/query`, {
            path: "customers:getCustomerByUserId", // Create this query to fetch customer ID
            args: { userId: 'user123' } // Replace with the actual userId
        });
        if (response.data && response.data.value) {
            setCustomerId(response.data.value._id); // Set the valid customer ID
        } else {
            console.error('Customer not found');
            setError('Customer not found.'); // Handle error
        }
    };
    fetchCustomerId();
  }, []); // Fetch customer ID on component mount

  useEffect(() => {
    if (customerId) {
        const fetchBookings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post(`${API_BASE_URL}/query`, {
                    path: "bookings:getBookingsByCustomer",
                    args: { customerId } // Use the valid customerId
                });
                
                console.log('API Response:', response.data); // Log the entire response data
                console.log('Fetching bookings for customerId:', customerId); // Log the customerId

                // Check if the response has the expected structure
                if (response.data && Array.isArray(response.data.value)) {
                    if (response.data.value.length > 0) {
                        setBookings(response.data.value); // Set fetched bookings to state
                    } else {
                        console.error('No bookings found in response');
                        setError('No bookings found.'); // Set error message if no bookings
                    }
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setError('Unexpected response structure.'); // Handle unexpected response
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to fetch bookings. Please try again.'); // Set error message
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }
  }, [customerId]); // Fetch bookings when customerId is available

  useEffect(() => {
    setFilteredBookings(bookings || []); // Ensure filteredBookings is always an array
  }, [bookings]);

  const handleFilterChange = () => {
    let filtered = bookings
    if (filterStartDate) {
      filtered = filtered.filter((booking) => new Date(booking.startDate) >= new Date(filterStartDate))
    }
    if (filterEndDate) {
      filtered = filtered.filter((booking) => new Date(booking.endDate) <= new Date(filterEndDate))
    }
    if (filterMake) {
      filtered = filtered.filter((booking) => booking.make === filterMake)
    }
    if (filterModel) {
      filtered = filtered.filter((booking) => booking.model === filterModel)
    }
    if (filterColor) {
      filtered = filtered.filter((booking) => booking.color === filterColor)
    }
    setFilteredBookings(filtered)
  }
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
  }

  // Determine the most recent booking
  const currentBooking = bookings && bookings.find(booking => new Date(booking.startDate) >= new Date()); // Find current booking
  const pastBookings = bookings && bookings.filter(booking => new Date(booking.startDate) < new Date()); // Filter past bookings

  return (
    <>
      <Navi />  {/* Ensure Navi is rendered correctly */}

      <Separator />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Your Car Bookings</h1>
        <Link href="bookings/currentbooking" className='hover:cursor-pointer'>
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Current Booking</h2>
                {currentBooking ? ( // Display current booking details
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
                <p>Toyota Camry</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">License Plate</h3>
                <p>ABC 123</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pickup Location</h3>
                <p>123 Main St, Anytown USA</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Return Location</h3>
                <p>123 Main St, Anytown USA</p>
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
                  onChange={(e) => setFilterEndDate(e.target.value || null)}  // Ensure null is set if empty
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
                  id="Lorem ipsum"
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
                <Card key={booking.id}>
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
                    <div>{selectedBooking?.make}</div>  // Use optional chaining to avoid errors
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
        {loading && <p>Loading...</p>} {/* Show loading state */}
        {error && <p className="text-red-500">{error}</p>} {/* Show error message */}
        {filteredBookings.length === 0 && !loading && <p>No bookings available.</p>} {/* Show message if no bookings */}
      </div>
      <Footer/>
    </>
  );
}
