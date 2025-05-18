import type React from "react";
import { useState, useEffect } from "react";
import { FormField } from "../../molecules/FormField";
import { 
    createMedicalRecord,
    getMedicalRecordsByPatientId 
} from "../../../lib/api/medicalRecords";
import { getPatients } from "../../../lib/api/patients";
import { getDoctors } from "../../../lib/api/doctors";
import type { 
    MedicalRecord, 
    CreateMedicalRecordRequest,
    MedicalRecordType
} from "../../../types/medicalRecord";
import type { Patient } from "../../../types/patient";
import type { Doctor } from "../../../types/doctor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

interface AddMedicalRecordFormProps {
    onSuccess: (record: MedicalRecord) => void;
    onCancel: () => void;
}

export const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<CreateMedicalRecordRequest>({
        patientId: "",
        doctorId: "",
        recordType: "checkup",
        description: "",
        diagnosis: "",
        treatment: "",
        notes: "",
    });
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [patientsData, doctorsData] = await Promise.all([
                    getPatients(),
                    getDoctors()
                ]);
                setPatients(patientsData);
                setDoctors(doctorsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load required data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.patientId) {
            newErrors.patientId = "Patient is required";
        }

        if (!formData.doctorId) {
            newErrors.doctorId = "Doctor is required";
        }

        if (!formData.recordType) {
            newErrors.recordType = "Record type is required";
        } else if (!['checkup', 'followup', 'procedure', 'emergency'].includes(formData.recordType)) {
            newErrors.recordType = "Invalid record type";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        if (!formData.diagnosis.trim()) {
            newErrors.diagnosis = "Diagnosis is required";
        }

        if (!formData.treatment.trim()) {
            newErrors.treatment = "Treatment is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const newRecord = await createMedicalRecord({
                ...formData,
                recordType: formData.recordType
            });
            
            toast.success('Medical record created successfully');
            onSuccess(newRecord);
        } catch (error) {
            console.error('Error creating medical record:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create medical record';
            toast.error(errorMessage);
            setErrors(prev => ({
                ...prev,
                submit: errorMessage
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="patientId" className="text-sm font-medium">
                    Patient <span className="text-destructive">*</span>
                </label>
                <Select
                    value={formData.patientId}
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, patientId: value }))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                        {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.patientId && (
                    <p className="text-sm text-destructive">{errors.patientId}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="doctorId" className="text-sm font-medium">
                    Doctor <span className="text-destructive">*</span>
                </label>
                <Select
                    value={formData.doctorId}
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, doctorId: value }))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                        {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.doctorId && (
                    <p className="text-sm text-destructive">{errors.doctorId}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="recordType" className="text-sm font-medium">
                    Record Type <span className="text-destructive">*</span>
                </label>
                <Select
                    value={formData.recordType}
                    onValueChange={(value: MedicalRecordType) => setFormData(prev => ({ ...prev, recordType: value }))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a record type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="checkup">Checkup</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                </Select>
                {errors.recordType && (
                    <p className="text-sm text-destructive">{errors.recordType}</p>
                )}
            </div>

            <FormField
                id="description"
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Annual physical examination"
                error={errors.description}
                required
            />

            <FormField
                id="diagnosis"
                name="diagnosis"
                label="Diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Hypertension, well-controlled"
                error={errors.diagnosis}
                required
            />

            <FormField
                id="treatment"
                name="treatment"
                label="Treatment"
                value={formData.treatment}
                onChange={handleChange}
                placeholder="Continue current medication regimen"
                error={errors.treatment}
                required
            />

            <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes about the medical record"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                />
            </div>

            {errors.submit && <p className="text-destructive text-sm">{errors.submit}</p>}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Medical Record"}
                </Button>
            </div>
        </form>
    );
};
