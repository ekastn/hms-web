export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    email: string;
    phone: string;
    address: string;
    lastVisit: string;
    appointments?: {
        id: string;
        doctorName: string;
        type: string;
        date: string;
        time: string;
        status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
    }[];
    medicalHistory?: {
        condition: string;
        diagnosedDate: string;
        notes: string;
    }[];
}
