import type React from "react";
import { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { addMedicalRecord } from "../../../lib/api/medicalRecords";
import type { MedicalRecord } from "../../../types/medicalRecord";
import { Button } from "@/components/ui/button";

interface AddMedicalRecordFormProps {
    onSuccess: (record: MedicalRecord) => void;
    onCancel: () => void;
}

export const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        doctorId: "",
        doctorName: "",
        recordType: "",
        description: "",
        diagnosis: "",
        treatment: "",
        notes: "",
    });
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.patientName.trim()) {
            newErrors.patientName = "Patient name is required";
        }

        if (!formData.doctorName.trim()) {
            newErrors.doctorName = "Doctor name is required";
        }

        if (!formData.recordType.trim()) {
            newErrors.recordType = "Record type is required";
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
            // In a real app, we would get the patient and doctor IDs from a dropdown selection
            const newRecord = await addMedicalRecord({
                ...formData,
                patientId: "p1", // TODO: Mock ID
                doctorId: "d1", // TODO: Mock ID for demo
                date: new Date().toISOString().split("T")[0],
            });
            onSuccess(newRecord);
        } catch (error) {
            setErrors({
                submit: "Failed to add medical record. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                id="patientName"
                name="patientName"
                label="Patient Name"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="John Smith"
                error={errors.patientName}
                required
            />

            <FormField
                id="doctorName"
                name="doctorName"
                label="Doctor Name"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Dr. Jane Smith"
                error={errors.doctorName}
                required
            />

            <FormField
                id="recordType"
                name="recordType"
                label="Record Type"
                value={formData.recordType}
                onChange={handleChange}
                placeholder="Physical Examination"
                error={errors.recordType}
                required
            />

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
