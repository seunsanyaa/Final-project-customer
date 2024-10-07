/**
 * Represents a lead in the system.
 */
export type Lead = {
  /** URL or path to the lead's avatar image */
  avatar: string;
  /** Full name of the lead */
  name: string;
  /** Email address of the lead */
  email: string;
  /** Name or identifier of the associated project */
  project: string;
  /** Duration of the project or engagement in days */
  duration: number;
  /** Current status of the lead (e.g., "active", "inactive", "converted") */
  status: LeadStatus;
};

/**
 * Possible status values for a lead.
 */
export type LeadStatus = "active" | "inactive" | "converted" | "lost";
