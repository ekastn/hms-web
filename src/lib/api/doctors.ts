import type { Doctor } from "../../types/doctor";
import { generateId } from "../utils";

// Mock data
const mockDoctors: Doctor[] = [
    {
        id: "d1",
        name: "Dr. Jane Smith",
        specialty: "Cardiology",
        email: "jane.smith@hospital.com",
        phone: "(555) 123-4567",
        availability: ["Monday", "Wednesday", "Friday"],
        patients: 42,
    },
    {
        id: "d2",
        name: "Dr. John Johnson",
        specialty: "Neurology",
        email: "john.johnson@hospital.com",
        phone: "(555) 234-5678",
        availability: ["Tuesday", "Thursday"],
        patients: 38,
    },
    {
        id: "d3",
        name: "Dr. Emily Williams",
        specialty: "Pediatrics",
        email: "emily.williams@hospital.com",
        phone: "(555) 345-6789",
        availability: ["Monday", "Tuesday", "Thursday"],
        patients: 56,
    },
    {
        id: "d4",
        name: "Dr. Michael Brown",
        specialty: "Orthopedics",
        email: "michael.brown@hospital.com",
        phone: "(555) 456-7890",
        availability: ["Wednesday", "Friday"],
        patients: 31,
    },
    {
        id: "d5",
        name: "Dr. Sarah Miller",
        specialty: "Dermatology",
        email: "sarah.miller@hospital.com",
        phone: "(555) 567-8901",
        availability: ["Monday", "Wednesday", "Friday"],
        patients: 45,
    },
];

// Get all doctors
export const getDoctors = (): Promise<Doctor[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockDoctors]);
        }, 500);
    });
};

// Get doctor by ID
export const getDoctorById = (id: string): Promise<Doctor | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const doctor = mockDoctors.find((d) => d.id === id);
            resolve(doctor ? { ...doctor } : undefined);
        }, 500);
    });
};

// Add new doctor
export const addDoctor = (doctor: Omit<Doctor, "id">): Promise<Doctor> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newDoctor = {
                ...doctor,
                id: generateId(),
            };
            mockDoctors.push(newDoctor);
            resolve({ ...newDoctor });
        }, 500);
    });
};

// Update doctor
export const updateDoctor = (id: string, updates: Partial<Doctor>): Promise<Doctor | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockDoctors.findIndex((d) => d.id === id);
            if (index !== -1) {
                mockDoctors[index] = { ...mockDoctors[index], ...updates };
                resolve({ ...mockDoctors[index] });
            } else {
                resolve(undefined);
            }
        }, 500);
    });
};

// Delete doctor
export const deleteDoctor = (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockDoctors.findIndex((d) => d.id === id);
            if (index !== -1) {
                mockDoctors.splice(index, 1);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
};
