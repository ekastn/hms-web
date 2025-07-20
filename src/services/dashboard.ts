import type { DashboardResponse, ApiResponse } from "@/lib/types";
import { api } from "../lib/api";

export const getDashboardStats = async (): Promise<DashboardResponse> => {
    try {
        const response = await api.get<ApiResponse<DashboardResponse>>('/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        return {
            stats: {
                patientsCount: 0,
                doctorsCount: 0,
                appointmentsCount: 0,
                medicalRecordsCount: 0
            },
            recentActivities: [],
            upcomingAppointments: []
        };
    }
};
