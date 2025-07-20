import type { 
    MedicalRecord, 
    CreateMedicalRecordRequest, 
    UpdateMedicalRecordRequest,
    ApiResponse
} from "@/lib/types";
import { api } from "../lib/api";

/**
 * Get all medical records
 * @returns Promise with array of medical records
 */
export const getMedicalRecords = async (): Promise<MedicalRecord[]> => {
    try {
        const response = await api.get<ApiResponse<MedicalRecord[]>>('/records');
        return response.data;
    } catch (error) {
        console.error('Error fetching medical records:', error);
        throw new Error('Failed to fetch medical records');
    }
};

/**
 * Get medical record by ID
 * @param id Record ID
 * @returns Promise with the medical record or undefined if not found
 */
export const getMedicalRecordById = async (id: string): Promise<MedicalRecord> => {
    try {
        const response = await api.get<ApiResponse<MedicalRecord>>(`/records/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching medical record ${id}:`, error);
        throw new Error('Failed to fetch medical record');
    }
};

/**
 * Get medical records by patient ID
 * @param patientId Patient ID
 * @returns Promise with array of medical records for the patient
 */
export const getMedicalRecordsByPatientId = async (patientId: string): Promise<MedicalRecord[]> => {
    try {
        const response = await api.get<ApiResponse<MedicalRecord[]>>(`/records/patient/${patientId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching medical records for patient ${patientId}:`, error);
        throw new Error('Failed to fetch patient medical records');
    }
};

/**
 * Create a new medical record
 * @param record Medical record data without ID
 * @returns Promise with the created medical record
 */
export const createMedicalRecord = async (
    record: CreateMedicalRecordRequest
): Promise<void> => {
    try {
        await api.post('/records', record);
    } catch (error) {
        console.error('Error creating medical record:', error);
        throw new Error('Failed to create medical record');
    }
};

/**
 * Update a medical record
 * @param id Record ID
 * @param updates Updated fields
 * @returns Promise with the updated medical record
 */
export const updateMedicalRecord = async (
    id: string,
    updates: UpdateMedicalRecordRequest
): Promise<void> => {
    try {
        await api.put<ApiResponse<MedicalRecord>>(`/records/${id}`, updates);
    } catch (error) {
        console.error(`Error updating medical record ${id}:`, error);
        throw new Error('Failed to update medical record');
    }
};

/**
 * Delete a medical record
 * @param id Record ID
 * @returns Promise that resolves to true if deleted successfully
 */
export const deleteMedicalRecord = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/records/${id}`);
        return true;
    } catch (error) {
        console.error(`Error deleting medical record ${id}:`, error);
        throw new Error('Failed to delete medical record');
    }
};

/**
 * Get medical records by date range
 * @param startDate Start date in ISO string format
 * @param endDate End date in ISO string format
 * @returns Promise with array of medical records in the date range
 */
export const getMedicalRecordsByDateRange = async (
    startDate: string,
    endDate: string
): Promise<MedicalRecord[]> => {
    try {
        const response = await api.get<ApiResponse<MedicalRecord[]>>(
            `/records/date-range?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching medical records by date range:', error);
        throw new Error('Failed to fetch medical records by date range');
    }
};
