export interface Activity {
    id: string;
    type: string; // e.g., "APPOINTMENT", "MEDICAL_RECORD"
    title: string;
    description: string;
    timestamp: string;
}

export interface UpcomingAppointment {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    status: string;
}

export interface DashboardStats {
    patientsCount: number;
    doctorsCount: number;
    appointmentsCount: number;
    medicalRecordsCount: number;
}

export interface DashboardResponse {
    stats: DashboardStats;
    recentActivities: Activity[];
    upcomingAppointments: UpcomingAppointment[];
}