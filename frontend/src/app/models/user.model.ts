export interface User {
  _id?: string;
  name: string;
  last_name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  cart?: string;
}
