import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentDetailResponse,
  AppointmentStatus
} from "@/types/appointment";
import { api } from "./client";

// Get all appointments with pagination and filters
export const getAppointments = async (): Promise<Appointment[]> => {
  return api.get<Appointment[]>('/appointments');
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  return api.get<Appointment>(`/appointments/${id}`);
};

// Get detailed appointment information
export const getAppointmentDetail = async (id: string): Promise<AppointmentDetailResponse> => {
  return api.get<AppointmentDetailResponse>(`/appointments/${id}/detail`);
};

// Create new appointment
export const createAppointment = async (
  appointment: CreateAppointmentRequest
): Promise<Appointment> => {
  return api.post<Appointment>('/appointments', appointment);
};

// Update appointment
export const updateAppointment = async (
  id: string,
  updates: UpdateAppointmentRequest
): Promise<Appointment> => {
  return api.put<Appointment>(`/appointments/${id}`, updates);
};

// Update appointment status
export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus
): Promise<Appointment> => {
  return api.put<Appointment>(`/appointments/${id}/status`, { status });
};

// Delete appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  await api.delete(`/appointments/${id}`);
};
