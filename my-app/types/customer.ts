type RentalStatus = "active" | "returned" | "overdue";
type AccountStatus = "active" | "banned" | "suspended";

type RentalHistoryEntry = {
  rentalId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
};

type PaymentHistoryEntry = {
  paymentId: string;
  paymentMethod: string;
  paymentDate: string;
  amount: number;
};

type Customer = {
  customerId: string; // Unique identifier for each customer
  fullName: string; // First and last name
  email: string; // Customer's email address
  phoneNumber: string; // Contact number
  address: string; // Residential or billing address
  driversLicenseNumber: string; // Driver's license for validation
  rentalHistory: RentalHistoryEntry[]; // Summary of past rentals
  currentRentals: RentalStatus; // Status of ongoing rentals
  totalRentals: number; // Total number of rentals by the customer
  paymentHistory: PaymentHistoryEntry[]; // List of previous payments
  accountCreationDate: string; // Date of customer registration
  status: AccountStatus; // Account status (active, banned, suspended)
};
