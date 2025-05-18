export interface TimeSlot {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string | Date; // ISO time string or Date object
    endTime: string | Date;   // ISO time string or Date object
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

export interface UpdateDoctorRequest {
    name?: string;
    specialty?: string;
    phone?: string;
    email?: string;
    availability?: TimeSlot[];
}

export interface DoctorDetailResponse {
    id: string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    availability: TimeSlot[];
    recentPatients: Array<{
        id: string;
        name: string;
        lastVisit: string;
    }>;
    createdAt: string;
    updatedAt: string;
}
