export interface Booking {
  _id: string;
  customerId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  paidAmount: number;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  reviewId?: string;
  paymentType?: string;
  installmentPlan?: {
    frequency: string;
    totalInstallments: number;
    amountPerInstallment: number;
    remainingInstallments: number;
    nextInstallmentDate: string;
  };
  extras?: {
    insurance: boolean;
    insuranceCost: number;
    gps: boolean;
    childSeat: boolean;
    chauffer: boolean;
    travelKit: boolean;
  };
}
