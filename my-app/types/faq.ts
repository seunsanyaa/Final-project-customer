export type FAQ = {
  /** The title or question of the FAQ item */
  header: string;

  /** Unique identifier for the FAQ item */
  id: number;

  /** The content or answer of the FAQ item */
  text: string;

  /** Optional date when the FAQ was last updated */
  lastUpdated?: Date;
};
