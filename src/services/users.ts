import { api } from "../lib/api";
import type { ApiResponse } from "@/lib/types";
import type { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from "./types/user";

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>("/users");
    return response.data;
};

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>("/users", userData);
    return response.data;
};

export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<void> => {
    await api.put<ApiResponse<void>>(`/users/${id}`, userData);
};

export const changePassword = async (id: string, passwordData: ChangePasswordRequest): Promise<void> => {
    await api.put<ApiResponse<void>>(`/users/${id}/password`, passwordData);
};

export const deactivateUser = async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/users/${id}`);
};
