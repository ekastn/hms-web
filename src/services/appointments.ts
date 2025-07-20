import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentDetailResponse,
  AppointmentStatus,
  ApiResponse
} from "@/lib/types";
import { api } from "../lib/api";

// Get all appointments with pagination and filters
export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<ApiResponse<Appointment[]>>('/appointments');
  return response.data;
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
  return response.data;
};

// Get detailed appointment information
export const getAppointmentDetail = async (id: string): Promise<AppointmentDetailResponse> => {
  const response = await api.get<ApiResponse<AppointmentDetailResponse>>(`/appointments/${id}/detail`);
  return response.data;
};

// Create new appointment
export const createAppointment = async (
  appointment: CreateAppointmentRequest
): Promise<Appointment> => {
  const response = await api.post<ApiResponse<Appointment>>('/appointments', appointment);
  return response.data;
};

// Update appointment
export const updateAppointment = async (
  id: string,
  updates: UpdateAppointmentRequest
): Promise<void> => {
  await api.put<ApiResponse<void>>(`/appointments/${id}`, updates);
};

// Update appointment status
export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus
): Promise<void> => {
  await api.put<ApiResponse<void>>(`/appointments/${id}/status`, { status });
};

// Delete appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  await api.delete(`/appointments/${id}`);
};
