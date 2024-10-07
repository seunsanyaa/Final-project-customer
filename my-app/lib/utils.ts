import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names or class objects into a single string.
 * This function merges Tailwind CSS classes efficiently, removing conflicts.
 * 
 * @param inputs - An array of class values (strings, objects, or arrays)
 * @returns A string of merged and deduplicated class names
 */
export function cn(...inputs: ClassValue[]): string {
  // Use clsx to merge class names and objects
  const mergedClasses = clsx(inputs);
  
  // Use twMerge to handle Tailwind-specific class conflicts
  return twMerge(mergedClasses);
}
