import type { Appointment } from "../../types/appointment";
import { generateId } from "../utils";

// Mock data
const mockAppointments: Appointment[] = [
    {
        id: "a1",
        patientId: "p1",
        patientName: "John Smith",
        doctorId: "d1",
        doctorName: "Dr. Jane Smith",
        date: "2023-05-15",
        time: "10:00 AM",
        type: "Check-up",
        status: "Completed",
        location: "Main Clinic, Room 101",
        notes: "Annual physical examination",
        patientHistory: "Patient has a history of hypertension and type 2 diabetes.",
    },
    {
        id: "a2",
        patientId: "p1",
        patientName: "John Smith",
        doctorId: "d2",
        doctorName: "Dr. John Johnson",
        date: "2023-06-10",
        time: "2:30 PM",
        type: "Follow-up",
        status: "Scheduled",
        location: "Main Clinic, Room 203",
        notes: "Follow-up on medication adjustment",
        patientHistory: "Patient has a history of hypertension and type 2 diabetes.",
    },
    {
        id: "a3",
        patientId: "p2",
        patientName: "Sarah Johnson",
        doctorId: "d3",
        doctorName: "Dr. Emily Williams",
        date: "2023-04-28",
        time: "9:15 AM",
        type: "Consultation",
        status: "Completed",
        location: "Main Clinic, Room 105",
        notes: "Initial consultation for asthma symptoms",
        patientHistory: "Patient has a history of mild asthma.",
    },
    {
        id: "a4",
        patientId: "p3",
        patientName: "Michael Brown",
        doctorId: "d4",
        doctorName: "Dr. Michael Brown",
        date: "2023-06-15",
        time: "11:30 AM",
        type: "Physical Therapy",
        status: "Confirmed",
        location: "Physical Therapy Center, Room 3",
        notes: "Continuing therapy for arthritis",
        patientHistory: "Patient has arthritis affecting knees and hands.",
    },
];

// Get all appointments
export const getAppointments = (): Promise<Appointment[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockAppointments]);
        }, 500);
    });
};

// Get appointment by ID
export const getAppointmentById = (id: string): Promise<Appointment | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const appointment = mockAppointments.find((a) => a.id === id);
            resolve(appointment ? { ...appointment } : undefined);
        }, 500);
    });
};

// Add new appointment
export const addAppointment = (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newAppointment = {
                ...appointment,
                id: generateId(),
            };
            mockAppointments.push(newAppointment);
            resolve({ ...newAppointment });
        }, 500);
    });
};

// Update appointment
export const updateAppointment = (
    id: string,
    updates: Partial<Appointment>
): Promise<Appointment | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockAppointments.findIndex((a) => a.id === id);
            if (index !== -1) {
                mockAppointments[index] = { ...mockAppointments[index], ...updates };
                resolve({ ...mockAppointments[index] });
            } else {
                resolve(undefined);
            }
        }, 500);
    });
};

// Update appointment status
export const updateAppointmentStatus = (
    id: string,
    status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled"
): Promise<Appointment | undefined> => {
    return updateAppointment(id, { status });
};

// Delete appointment
export const deleteAppointment = (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockAppointments.findIndex((a) => a.id === id);
            if (index !== -1) {
                mockAppointments.splice(index, 1);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
};
