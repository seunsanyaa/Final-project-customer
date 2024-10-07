/**
 * Represents a product in the e-commerce system.
 */
export type Product = {
  /** URL or path to the product image */
  image: string;

  /** Name of the product */
  name: string;

  /** Category the product belongs to */
  category: string;

  /** Price of the product in the smallest currency unit (e.g., cents) */
  price: number;

  /** Number of units sold */
  sold: number;

  /** Total profit generated from this product */
  profit: number;

  /** Unique identifier for the product */
  id: string;

  /** Date when the product was added to the inventory */
  dateAdded: Date;

  /** Current stock quantity */
  stockQuantity: number;
};
