import type { 
  Patient, 
  CreatePatientRequest, 
  UpdatePatientRequest,
  PatientDetailResponse,
  ApiResponse
} from "@/lib/types";
import { api } from "../lib/api";

// Get all patients
export const getPatients = async (): Promise<Patient[]> => {
  const response = await api.get<ApiResponse<Patient[]>>('/patients');
  return response.data;
};

// Get patient by ID
export const getPatientById = async (id: string): Promise<Patient> => {
  const response = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
  return response.data;
};

// Get detailed patient information
export const getPatientDetail = async (id: string): Promise<PatientDetailResponse> => {
  const response = await api.get<ApiResponse<PatientDetailResponse>>(`/patients/${id}/detail`);
  return response.data;
};

// Create new patient
export const createPatient = async (
  patient: CreatePatientRequest
): Promise<Patient> => {
  const response = await api.post<ApiResponse<Patient>>('/patients', patient);
  return response.data;
};

// Update patient
export const updatePatient = async (
  id: string,
  updates: UpdatePatientRequest
): Promise<Patient> => {
  const response = await api.put<ApiResponse<Patient>>(`/patients/${id}`, updates);
  return response.data;
};

// Delete patient
export const deletePatient = async (id: string): Promise<void> => {
  await api.delete(`/patients/${id}`);
};
