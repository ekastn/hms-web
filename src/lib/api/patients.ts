import type { 
  Patient, 
  CreatePatientRequest, 
  UpdatePatientRequest,
  PatientDetailResponse 
} from "@/types/patient";
import { api } from "./client";

// Get all patients
export const getPatients = async (): Promise<Patient[]> => {
  return api.get<Patient[]>('/patients');
};

// Get patient by ID
export const getPatientById = async (id: string): Promise<Patient> => {
  return api.get<Patient>(`/patients/${id}`);
};

// Get detailed patient information
export const getPatientDetail = async (id: string): Promise<PatientDetailResponse> => {
  return api.get<PatientDetailResponse>(`/patients/${id}/detail`);
};

// Create new patient
export const createPatient = async (
  patient: CreatePatientRequest
): Promise<Patient> => {
  return api.post<Patient>('/patients', patient);
};

// Update patient
export const updatePatient = async (
  id: string,
  updates: UpdatePatientRequest
): Promise<Patient> => {
  return api.put<Patient>(`/patients/${id}`, updates);
};

// Delete patient
export const deletePatient = async (id: string): Promise<void> => {
  await api.delete(`/patients/${id}`);
};
