import type { MedicalRecord } from "../types/medicalRecord";
import { generateId } from "../utils";

// Mock data
const mockMedicalRecords: MedicalRecord[] = [
    {
        id: "mr1",
        patientId: "p1",
        patientName: "John Smith",
        doctorId: "d1",
        doctorName: "Dr. Jane Smith",
        date: "2023-05-15",
        recordType: "Physical Examination",
        description: "Annual physical examination",
        diagnosis: "Hypertension, well-controlled",
        treatment: "Continue current medication regimen",
        notes: "Patient reports feeling well overall",
    },
    {
        id: "mr2",
        patientId: "p2",
        patientName: "Sarah Johnson",
        doctorId: "d3",
        doctorName: "Dr. Emily Williams",
        date: "2023-04-28",
        recordType: "Consultation",
        description: "Initial consultation for asthma symptoms",
        diagnosis: "Mild persistent asthma",
        treatment: "Prescribed albuterol inhaler for as-needed use",
        notes: "Patient to return in 3 months for follow-up",
    },
    {
        id: "mr3",
        patientId: "p3",
        patientName: "Michael Brown",
        doctorId: "d4",
        doctorName: "Dr. Michael Brown",
        date: "2023-02-10",
        recordType: "Physical Therapy Assessment",
        description: "Assessment for arthritis management",
        diagnosis: "Osteoarthritis of the knees and hands",
        treatment: "Physical therapy twice weekly for 6 weeks",
        notes: "Patient reports increased pain in right knee",
    },
];

// Get all medical records
export const getMedicalRecords = (): Promise<MedicalRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockMedicalRecords]);
        }, 500);
    });
};

// Get medical record by ID
export const getMedicalRecordById = (id: string): Promise<MedicalRecord | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const record = mockMedicalRecords.find((r) => r.id === id);
            resolve(record ? { ...record } : undefined);
        }, 500);
    });
};

// Add new medical record
export const addMedicalRecord = (record: Omit<MedicalRecord, "id">): Promise<MedicalRecord> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newRecord = {
                ...record,
                id: generateId(),
            };
            mockMedicalRecords.push(newRecord);
            resolve({ ...newRecord });
        }, 500);
    });
};

// Update medical record
export const updateMedicalRecord = (
    id: string,
    updates: Partial<MedicalRecord>
): Promise<MedicalRecord | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockMedicalRecords.findIndex((r) => r.id === id);
            if (index !== -1) {
                mockMedicalRecords[index] = { ...mockMedicalRecords[index], ...updates };
                resolve({ ...mockMedicalRecords[index] });
            } else {
                resolve(undefined);
            }
        }, 500);
    });
};

// Delete medical record
export const deleteMedicalRecord = (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockMedicalRecords.findIndex((r) => r.id === id);
            if (index !== -1) {
                mockMedicalRecords.splice(index, 1);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
};
