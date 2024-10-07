export type Chat = {
  /** URL or path to the user's avatar image */
  avatar: string;

  /** Display name of the user */
  name: string;

  /** Content of the chat message */
  text: string;

  /** Timestamp of when the message was sent (in milliseconds since epoch) */
  timestamp: number;

  /** Number of characters in the message */
  messageLength: number;

  /** 
   * Indicates the status or type of the message
   * 0: Normal message
   * 1: Unread message
   * 2: Urgent message
   * (Add more status codes as needed)
   */
  status: number;
};
