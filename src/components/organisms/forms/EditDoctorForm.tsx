import type React from "react";
import { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { updateDoctor } from "@/services/doctors";
import type { Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface EditDoctorFormProps {
    doctor: Doctor;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditDoctorForm: React.FC<EditDoctorFormProps> = ({ doctor, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: doctor.name,
        specialty: doctor.specialty,
        email: doctor.email,
        phone: doctor.phone,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.specialty.trim()) {
            newErrors.specialty = "Specialty is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await updateDoctor(doctor.id, formData);
            onSuccess();
        } catch (error) {
            setErrors({
                submit: "Failed to update doctor. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                id="name"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                error={errors.name}
                required
            />

            <FormField
                id="specialty"
                name="specialty"
                label="Specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Cardiology"
                error={errors.specialty}
                required
            />

            <FormField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@hospital.com"
                error={errors.email}
                required
            />

            <FormField
                id="phone"
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                error={errors.phone}
                required
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
