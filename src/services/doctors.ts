import type { 
  Doctor, 
  CreateDoctorRequest, 
  UpdateDoctorRequest,
  DoctorDetailResponse,
  ApiResponse
} from "@/lib/types";
import { api } from "../lib/api";

// Get all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<ApiResponse<Doctor[]>>('/doctors');
  return response.data;
};

// Get doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor> => {
  const response = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
  return response.data;
};

// Get doctor detail with recent patients
export const getDoctorDetail = async (id: string): Promise<DoctorDetailResponse> => {
  const response = await api.get<ApiResponse<DoctorDetailResponse>>(`/doctors/${id}/detail`);
  return response.data;
};

// Create new doctor
export const createDoctor = async (doctor: CreateDoctorRequest): Promise<Doctor> => {
  const response = await api.post<ApiResponse<Doctor>>('/doctors', doctor);
  return response.data;
};

// Update doctor
export const updateDoctor = async (
  id: string,
  updates: UpdateDoctorRequest
): Promise<Doctor> => {
  const response = await api.put<ApiResponse<Doctor>>(`/doctors/${id}`, updates);
  return response.data;
};

// Delete doctor
export const deleteDoctor = async (id: string): Promise<void> => {
  await api.delete(`/doctors/${id}`);
};
