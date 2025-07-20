import type { Patient } from "./patient";

export interface TimeSlot {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string;
    endTime: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    availability: TimeSlot[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateDoctorRequest {
    name: string;
    specialty: string;
    phone: string;
    email: string;
    availability?: TimeSlot[];
}

export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> {}

export interface DoctorDetailResponse {
    doctor: Doctor;
    recentPatients: Patient[];
}
