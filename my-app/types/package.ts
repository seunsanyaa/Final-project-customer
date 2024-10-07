/**
 * Represents a package in the system.
 */
export type Package = {
  /** The name of the package */
  name: string;

  /** The price of the package in the default currency (e.g., USD) */
  price: number;

  /** The date when the invoice was issued (ISO 8601 format: YYYY-MM-DD) */
  invoiceDate: string;

  /** The current status of the package (e.g., 'pending', 'shipped', 'delivered') */
  status: PackageStatus;
};

/**
 * Possible status values for a package.
 */
export type PackageStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
