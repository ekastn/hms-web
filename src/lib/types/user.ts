export enum Role {
    Admin = "Admin",
    Doctor = "Doctor",
    Nurse = "Nurse",
    Receptionist = "Receptionist",
    Management = "Management",
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password?: string;
    role: Role;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
    isActive?: boolean;
}

export interface ChangePasswordRequest {
    newPassword: string;
    confirmPassword: string;
}