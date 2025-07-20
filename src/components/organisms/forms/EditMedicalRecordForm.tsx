import type React from "react";
import { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { updateMedicalRecord } from "@/services/medicalRecords";
import type { MedicalRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface EditMedicalRecordFormProps {
    record: MedicalRecord;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditMedicalRecordForm: React.FC<EditMedicalRecordFormProps> = ({
    record,
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        recordType: record.recordType,
        description: record.description,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        notes: record.notes || "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
            await updateMedicalRecord(record.id, formData);
            onSuccess();
        } catch (error) {
            setErrors({
                submit: "Failed to update medical record. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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

            <FormField
                id="notes"
                name="notes"
                label="Notes"
                as="textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the medical record"
                rows={3}
            />

            {errors.submit && <p className="text-destructive text-sm">{errors.submit}</p>}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
};
