import { api } from "../lib/api";
import type { AuthResponse, ApiResponse } from "@/lib/types";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
        email,
        password,
    });
    return response.data;
};