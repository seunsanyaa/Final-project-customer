
export interface Booking {
  _id: string; // Use the Id type for the booking ID
  customerId: string; // Corresponds to customerId in the schema
  carId: string; // Corresponds to carId in the schema
  startDate: string; // Corresponds to startDate in the schema
  endDate: string; // Corresponds to endDate in the schema
  totalCost: number; // Corresponds to totalCost in the schema
  paidAmount: number; // Corresponds to paidAmount in the schema
  status: string; // Corresponds to status in the schema
  pickupLocation: string; // Corresponds to pickupLocation in the schema
  dropoffLocation: string; // Corresponds to dropoffLocation in the schema
  customerInsurancetype: string; // Corresponds to customerInsurancetype in the schema
  customerInsuranceNumber: string; // Corresponds to customerInsuranceNumber in the schema
  reviewId?: string; // Optional, corresponds to reviewId in the schema
}
