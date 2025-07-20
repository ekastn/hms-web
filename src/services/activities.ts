import { api } from "../lib/api";
import type { ApiResponse, Activity } from "@/lib/types";

export const getActivities = async (): Promise<Activity[]> => {
    const response = await api.get<ApiResponse<Activity[]>>("/activities");
    return response.data;
};
