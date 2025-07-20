import type { ChangePasswordRequest, CreateUserRequest, UpdateUserRequest, User } from "@/lib/types";
import { api } from "../lib/api";

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
};

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>("/users", userData);
    return response.data;
};

export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<void> => {
    await api.put<void>(`/users/${id}`, userData);
};

export const changePassword = async (id: string, passwordData: ChangePasswordRequest): Promise<void> => {
    await api.put<void>(`/users/${id}/password`, passwordData);
};

export const deactivateUser = async (id: string): Promise<void> => {
    await api.delete<void>(`/users/${id}`);
};
