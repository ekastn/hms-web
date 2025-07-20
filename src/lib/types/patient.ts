import { Appointment } from "./appointment";
import { MedicalRecord } from "./medicalRecord";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {}

export interface PatientDetailResponse {
  patient: Patient;
  recentAppointments: Appointment[];
  medicalHistory: MedicalRecord[];
}