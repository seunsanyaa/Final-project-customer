import { FAQ } from "./faq";

export type FaqItem = {
  // The index of the currently active (expanded) FAQ item
  // null if no item is active
  active: number | null;

  // Function to toggle the active state of an FAQ item
  // Takes the index of the item to toggle
  handleToggle: (index: number) => void;

  // The FAQ data, likely containing question and answer
  faq: FAQ;

  // Optional: Add an 'id' field for better identification
  id?: string | number;
};
