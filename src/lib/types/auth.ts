export type Role = "Admin" | "Doctor" | "Nurse" | "Receptionist" | "Management";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}
