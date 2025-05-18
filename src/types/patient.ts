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

export interface UpdatePatientRequest extends Omit<CreatePatientRequest, 'age'> {
  id: string;
  age?: number;
}

// Define a minimal appointment type to avoid circular dependency
type BasicAppointment = {
  id: string;
  dateTime: string;
  type: string;
  status: string;
};

export interface PatientDetailResponse {
  patient: Patient;
  recentAppointments: BasicAppointment[];
  medicalHistory: any[]; // TODO: Add MedicalRecord type when available
}

// API Response types
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  status: string;
  message: string;
  data: T[];
}
