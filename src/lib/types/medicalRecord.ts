export type MedicalRecordType = 'checkup' | 'followup' | 'procedure' | 'emergency';

export interface MedicalRecord {
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    recordType: MedicalRecordType;
    description: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMedicalRecordRequest {
    patientId: string;
    doctorId: string;
    recordType: MedicalRecordType;
    description: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
}

export interface UpdateMedicalRecordRequest {
    recordType?: MedicalRecordType;
    description?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
}
