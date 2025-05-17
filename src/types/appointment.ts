export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: string;
    time: string;
    type: string;
    status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
    location: string;
    notes?: string;
    patientHistory?: string;
}
