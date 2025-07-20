import type { DashboardResponse } from "../types/dashboard";
import { api } from "./client";

export const getDashboardStats = async (): Promise<DashboardResponse> => {
    try {
        const response = await api.get<DashboardResponse>('/dashboard');
        const responseData = (response as any).data as DashboardResponse;
        
        if (!responseData) {
            throw new Error('No data received from the server');
        }
        
        // Map the response data to the DashboardResponse type
        const dashboardData: DashboardResponse = {
            stats: {
                patientsCount: responseData.stats?.patientsCount || 0,
                doctorsCount: responseData.stats?.doctorsCount || 0,
                appointmentsCount: responseData.stats?.appointmentsCount || 0,
                medicalRecordsCount: responseData.stats?.medicalRecordsCount || 0
            },
            recentActivities: Array.isArray(responseData.recentActivities) 
                ? responseData.recentActivities 
                : [],
            upcomingAppointments: Array.isArray(responseData.upcomingAppointments) 
                ? responseData.upcomingAppointments 
                : []
        };
        
        return dashboardData;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // Return a default response structure on error
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
