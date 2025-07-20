import type React from "react";
import { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { updatePatient } from "@/services/patients";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface EditPatientFormProps {
    patient: Patient;
    onSuccess: (patient: Patient) => void;
    onCancel: () => void;
}

export const EditPatientForm: React.FC<EditPatientFormProps> = ({
    patient,
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

        if (!formData.age.trim()) {
            newErrors.age = "Age is required";
        } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
            newErrors.age = "Age must be a positive number";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const updatedPatient = await updatePatient(patient.id, {
                ...formData,
                age: Number(formData.age),
            });
            if (updatedPatient) {
                onSuccess(updatedPatient);
            } else {
                throw new Error("Failed to update patient");
            }
        } catch (error) {
            setErrors({
                submit: "Failed to update patient. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                id="name"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                error={errors.name}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    id="age"
                    name="age"
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="45"
                    error={errors.age}
                    required
                />

                <FormField
                    id="gender"
                    label="Gender"
                    name="gender"
                    as="select"
                    value={formData.gender}
                    onChange={handleChange}
                    error={errors.gender}
                    required
                    options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' },
                    ]}
                />
            </div>

            <FormField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.smith@example.com"
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

            <FormField
                id="address"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Anytown, USA"
                error={errors.address}
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
