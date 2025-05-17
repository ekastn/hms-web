export interface MedicalRecord {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: string;
    recordType: string;
    description: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
}
