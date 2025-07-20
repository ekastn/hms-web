import type { Activity } from "@/lib/types";
import { api } from "../lib/api";

export const getActivities = async (): Promise<Activity[]> => {
    const response = await api.get<Activity[]>("/activities");
    return response.data;
};
