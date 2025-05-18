interface DashboardStats {
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    totalMedicalRecords: number;
    recentActivity: {
        type: "appointment" | "patient" | "doctor" | "record";
        description: string;
        time: string;
    }[];
    upcomingAppointments: {
        patientName: string;
        doctorName: string;
        time: string;
    }[];
}

export function getDashboardStats(): DashboardStats {
    return {
        totalPatients: 1248,
        totalDoctors: 36,
        totalAppointments: 328,
        totalMedicalRecords: 892,
        recentActivity: [
            {
                type: "appointment",
                description: "New appointment scheduled with Dr. Smith",
                time: "10 minutes ago",
            },
            {
                type: "patient",
                description: "New patient John Doe registered",
                time: "1 hour ago",
            },
            {
                type: "doctor",
                description: "Dr. Johnson updated availability",
                time: "2 hours ago",
            },
            {
                type: "record",
                description: "Medical record updated for patient #12345",
                time: "3 hours ago",
            },
            {
                type: "appointment",
                description: "Appointment rescheduled for Jane Smith",
                time: "5 hours ago",
            },
        ],
        upcomingAppointments: [
            {
                patientName: "Jane Smith",
                doctorName: "Dr. Johnson (Cardiology)",
                time: "Today, 2:00 PM",
            },
            {
                patientName: "Robert Brown",
                doctorName: "Dr. Williams (Neurology)",
                time: "Today, 3:30 PM",
            },
            {
                patientName: "Emily Davis",
                doctorName: "Dr. Miller (Pediatrics)",
                time: "Tomorrow, 10:00 AM",
            },
            {
                patientName: "Michael Wilson",
                doctorName: "Dr. Taylor (Orthopedics)",
                time: "Tomorrow, 1:15 PM",
            },
        ],
    };
}
