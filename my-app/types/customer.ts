// Rental-related types
type RentalStatus = "active" | "returned" | "overdue";

type RentalHistoryEntry = {
  rentalId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
};

// Payment-related types
type PaymentHistoryEntry = {
  paymentId: string;
  paymentMethod: string;
  paymentDate: string;
  amount: number;
};

// Account-related types
type AccountStatus = "active" | "banned" | "suspended";

// Main Customer type
type Customer = {
  // Personal Information
  customerId: string; // Unique identifier for each customer
  fullName: string; // First and last name
  email: string; // Customer's email address
  phoneNumber: string; // Contact number
  address: string; // Residential or billing address
  driversLicenseNumber: string; // Driver's license for validation

  // Rental Information
  rentalHistory: RentalHistoryEntry[]; // Summary of past rentals
  currentRentals: RentalStatus[]; // Status of ongoing rentals
  totalRentals: number; // Total number of rentals by the customer

  // Payment Information
  paymentHistory: PaymentHistoryEntry[]; // List of previous payments

  // Account Information
  accountCreationDate: string; // Date of customer registration
  status: AccountStatus; // Account status (active, banned, suspended)
};
