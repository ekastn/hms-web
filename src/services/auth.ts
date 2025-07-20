import type { AuthResponse } from "@/lib/types";
import { api } from "../lib/api";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
    });
    return response.data;
};
