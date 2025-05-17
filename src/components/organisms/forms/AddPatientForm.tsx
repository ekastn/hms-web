import type React from "react";
import { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { addPatient } from "@/lib/api/patients";
import type { Patient } from "@/types/patient";
import { Button } from "@/components/ui/button";

interface AddPatientFormProps {
    onSuccess: (patient: Patient) => void;
    onCancel: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "Male" as Patient["gender"],
        email: "",
        phone: "",
        address: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const newPatient = await addPatient({
                ...formData,
                age: Number(formData.age),
                lastVisit: new Date().toISOString().split("T")[0],
                appointments: [],
                medicalHistory: [],
                billing: [],
            });
            onSuccess(newPatient);
        } catch (error) {
            setErrors({
                submit: "Failed to add patient. Please try again.",
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
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="45"
                    error={errors.age}
                    required
                />

                <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <FormField
                id="email"
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.smith@example.com"
                error={errors.email}
                required
            />

            <FormField
                id="phone"
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                error={errors.phone}
                required
            />

            <FormField
                id="address"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, Anytown, USA"
                error={errors.address}
                required
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Patient"}
                </Button>
            </div>
        </form>
    );
};
