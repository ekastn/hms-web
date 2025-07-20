import type { Patient } from "./patient";
import type { MedicalRecord } from "./medicalRecord";

// String enums for better type safety
export const AppointmentStatus = {
  Scheduled: 'Scheduled',
  Confirmed: 'Confirmed',
  Completed: 'Completed',
  Cancelled: 'Cancelled'
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export const AppointmentType = {
  CheckUp: 'check-up',
  FollowUp: 'follow-up',
  Consultation: 'consultation',
  Procedure: 'procedure',
  Emergency: 'emergency'
} as const;

export type AppointmentType = typeof AppointmentType[keyof typeof AppointmentType];

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  type: AppointmentType;
  dateTime: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  location: string;
  notes?: string;
  patientHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDetailResponse {
  appointment: Appointment;
  patient?: Patient;
  lastRecord?: MedicalRecord;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  type: AppointmentType;
  dateTime: string;
  duration: number;
  location: string;
  notes?: string;
  patientHistory?: string;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
  status?: AppointmentStatus;
}