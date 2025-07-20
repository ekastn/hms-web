export type ActivityType = "APPOINTMENT" | "MEDICAL_RECORD" | "PATIENT" | "DOCTOR";

export interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: string;
}