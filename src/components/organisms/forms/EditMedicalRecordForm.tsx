import type React from "react";
import { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { updateMedicalRecord } from "../../../lib/api/medicalRecords";
import type { MedicalRecord } from "../../../types/medicalRecord";
import { Button } from "@/components/ui/button";

interface EditMedicalRecordFormProps {
    record: MedicalRecord;
    onSuccess: (record: MedicalRecord) => void;
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            const updatedRecord = await updateMedicalRecord(record.id, formData);
            if (updatedRecord) {
                onSuccess(updatedRecord);
            } else {
                throw new Error("Failed to update medical record");
            }
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
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
};
