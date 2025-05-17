import type { Patient } from "@/types/patient";
import { generateId } from "../utils";

// Mock data
const mockPatients: Patient[] = [
    {
        id: "p1",
        name: "John Smith",
        age: 45,
        gender: "Male",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        address: "123 Main St, Anytown, USA",
        lastVisit: "2023-05-15",
        appointments: [
            {
                id: "a1",
                doctorName: "Dr. Jane Smith",
                type: "Check-up",
                date: "2023-05-15",
                time: "10:00 AM",
                status: "Completed",
            },
            {
                id: "a2",
                doctorName: "Dr. John Johnson",
                type: "Follow-up",
                date: "2023-06-10",
                time: "2:30 PM",
                status: "Scheduled",
            },
        ],
        medicalHistory: [
            {
                condition: "Hypertension",
                diagnosedDate: "2020-03-15",
                notes: "Controlled with medication",
            },
            {
                condition: "Type 2 Diabetes",
                diagnosedDate: "2019-07-22",
                notes: "Diet controlled",
            },
        ],
        billing: [
            {
                description: "Annual check-up",
                date: "2023-05-15",
                amount: 150.0,
                status: "Paid",
            },
            {
                description: "Blood work",
                date: "2023-05-15",
                amount: 75.5,
                status: "Pending",
            },
        ],
    },
    {
        id: "p2",
        name: "Sarah Johnson",
        age: 32,
        gender: "Female",
        email: "sarah.johnson@example.com",
        phone: "(555) 987-6543",
        address: "456 Oak Ave, Somewhere, USA",
        lastVisit: "2023-04-28",
        appointments: [
            {
                id: "a3",
                doctorName: "Dr. Emily Williams",
                type: "Consultation",
                date: "2023-04-28",
                time: "9:15 AM",
                status: "Completed",
            },
        ],
        medicalHistory: [
            {
                condition: "Asthma",
                diagnosedDate: "2015-11-03",
                notes: "Mild, controlled with inhaler",
            },
        ],
        billing: [
            {
                description: "Consultation",
                date: "2023-04-28",
                amount: 125.0,
                status: "Paid",
            },
        ],
    },
    {
        id: "p3",
        name: "Michael Brown",
        age: 58,
        gender: "Male",
        email: "michael.brown@example.com",
        phone: "(555) 456-7890",
        address: "789 Pine St, Elsewhere, USA",
        lastVisit: "2023-02-10",
        appointments: [],
        medicalHistory: [
            {
                condition: "Arthritis",
                diagnosedDate: "2018-05-17",
                notes: "Affecting knees and hands",
            },
            {
                condition: "High Cholesterol",
                diagnosedDate: "2017-09-12",
                notes: "On statin medication",
            },
        ],
        billing: [
            {
                description: "Physical therapy",
                date: "2023-02-10",
                amount: 200.0,
                status: "Paid",
            },
        ],
    },
];

export const getPatients = (): Promise<Patient[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockPatients]);
        }, 500);
    });
};

export const getPatientById = (id: string): Promise<Patient | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const patient = mockPatients.find((p) => p.id === id);
            resolve(patient ? { ...patient } : undefined);
        }, 500);
    });
};

export const addPatient = (patient: Omit<Patient, "id">): Promise<Patient> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newPatient = {
                ...patient,
                id: generateId(),
            };
            mockPatients.push(newPatient);
            resolve({ ...newPatient });
        }, 500);
    });
};

export const updatePatient = (
    id: string,
    updates: Partial<Patient>
): Promise<Patient | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockPatients.findIndex((p) => p.id === id);
            if (index !== -1) {
                mockPatients[index] = { ...mockPatients[index], ...updates };
                resolve({ ...mockPatients[index] });
            } else {
                resolve(undefined);
            }
        }, 500);
    });
};

export const deletePatient = (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockPatients.findIndex((p) => p.id === id);
            if (index !== -1) {
                mockPatients.splice(index, 1);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
};
