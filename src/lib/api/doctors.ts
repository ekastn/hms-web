import type { 
  Doctor, 
  CreateDoctorRequest, 
  UpdateDoctorRequest,
  DoctorDetailResponse 
} from "../../types/doctor";
import { api } from "./client";

// Get all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
  return api.get<Doctor[]>('/doctors');
};

// Get doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor> => {
  return api.get<Doctor>(`/doctors/${id}`);
};

// Get doctor detail with recent patients
export const getDoctorDetail = async (id: string): Promise<DoctorDetailResponse> => {
  return api.get<DoctorDetailResponse>(`/doctors/${id}/detail`);
};

// Create new doctor
export const createDoctor = async (doctor: CreateDoctorRequest): Promise<Doctor> => {
  return api.post<Doctor>('/doctors', doctor);
};

// Update doctor
export const updateDoctor = async (
  id: string,
  updates: UpdateDoctorRequest
): Promise<Doctor> => {
  return api.put<Doctor>(`/doctors/${id}`, updates);
};

// Delete doctor
export const deleteDoctor = async (id: string): Promise<void> => {
  await api.delete(`/doctors/${id}`);
};
