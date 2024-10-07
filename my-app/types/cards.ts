export type CardItemProps = {
  /** URL of the image to be displayed (e.g., profile picture) */
  imageSrc?: string;
  /** Name of the person or entity associated with the card */
  name?: string;
  /** Role or position of the person (if applicable) */
  role?: string;
  /** URL of the card's background image or icon */
  cardImageSrc?: string;
  /** Title of the card */
  cardTitle?: string;
  /** Main content or description of the card */
  cardContent?: string;
  /** Unique identifier for the card (recommended) */
  id?: string | number;
  /** Optional click handler for the card */
  onClick?: () => void;
};
