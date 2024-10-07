export type Country = {
  /** The full name of the country */
  name: string;

  /** The URL or emoji representation of the country's flag */
  flag: string;

  /** The percentage value associated with this country (e.g., population percentage) */
  percentage: number;

  /** ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'FR') */
  code: string;
};
