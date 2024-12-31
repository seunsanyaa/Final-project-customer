export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  staff?: boolean;
  password?: string;
}