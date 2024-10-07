import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Booking } from '../../types/booking';

const BookingsPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<Booking, 'bookingId'>>({
    customerId: '',
    carId: '',
    startDate: '',
    endDate: '',
    totalCost: 0,
    paidAmount: 0,
    status: '',
    pickupLocation: '',
    dropoffLocation: '',
    customerInsurancetype: '',
    customerInsuranceNumber: '',
  });

  const createBooking = useMutation(api.bookings.createBooking);
  const bookings = useQuery(api.bookings.getAllBookings);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCost' || name === 'paidAmount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBooking({
        ...formData,
        bookingId: Date.now().toString(), // Simple way to generate a unique ID
      });
      // Reset form after successful submission
      setFormData({
        customerId: '',
        carId: '',
        startDate: '',
        endDate: '',
        totalCost: 0,
        paidAmount: 0,
        status: '',
        pickupLocation: '',
        dropoffLocation: '',
        customerInsurancetype: '',
        customerInsuranceNumber: '',
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="customerId"
            value={formData.customerId}
            onChange={handleInputChange}
            placeholder="Customer ID"
            className="border p-2"
            required
          />
          <input
            type="text"
            name="carId"
            value={formData.carId}
            onChange={handleInputChange}
            placeholder="Car ID"
            className="border p-2"
            required
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border p-2"
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border p-2"
            required
          />
          <input
            type="number"
            name="totalCost"
            value={formData.totalCost}
            onChange={handleInputChange}
            placeholder="Total Cost"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleInputChange}
            placeholder="Paid Amount"
            className="border p-2"
            required
          />
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            placeholder="Status"
            className="border p-2"
            required
          />
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleInputChange}
            placeholder="Pickup Location"
            className="border p-2"
            required
          />
          <input
            type="text"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleInputChange}
            placeholder="Dropoff Location"
            className="border p-2"
            required
          />
          <input
            type="text"
            name="customerInsurancetype"
            value={formData.customerInsurancetype}
            onChange={handleInputChange}
            placeholder="Customer Insurance Type"
            className="border p-2"
            required
          />
          <input
            type="text"
            name="customerInsuranceNumber"
            value={formData.customerInsuranceNumber}
            onChange={handleInputChange}
            placeholder="Customer Insurance Number"
            className="border p-2"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Create Booking
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Bookings List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border p-2">Booking ID</th>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Car ID</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Total Cost</th>
              <th className="border p-2">Paid Amount</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Pickup Location</th>
              <th className="border p-2">Dropoff Location</th>
              <th className="border p-2">Insurance Type</th>
              <th className="border p-2">Insurance Number</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => (
              <tr key={booking.bookingId}>
                <td className="border p-2">{booking.bookingId}</td>
                <td className="border p-2">{booking.customerId}</td>
                <td className="border p-2">{booking.carId}</td>
                <td className="border p-2">{booking.startDate}</td>
                <td className="border p-2">{booking.endDate}</td>
                <td className="border p-2">{booking.totalCost}</td>
                <td className="border p-2">{booking.paidAmount}</td>
                <td className="border p-2">{booking.status}</td>
                <td className="border p-2">{booking.pickupLocation}</td>
                <td className="border p-2">{booking.dropoffLocation}</td>
                <td className="border p-2">{booking.customerInsurancetype}</td>
                <td className="border p-2">{booking.customerInsuranceNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;


