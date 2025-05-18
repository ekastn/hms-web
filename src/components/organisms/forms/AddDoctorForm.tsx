import type React from "react";
import { useState, useMemo } from "react";
import { FormField } from "../../molecules/FormField";
import { createDoctor } from "../../../lib/api/doctors";
import type { CreateDoctorRequest, TimeSlot } from "../../../types/doctor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Helper to create default time slots
const createDefaultTimeSlots = (): TimeSlot[] => {
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setHours(9, 0, 0, 0);
    
    const defaultEnd = new Date(now);
    defaultEnd.setHours(17, 0, 0, 0);
    
    const defaultStartISO = defaultStart.toISOString();
    const defaultEndISO = defaultEnd.toISOString();
    
    return [
        {
            dayOfWeek: 1, // Monday
            startTime: defaultStartISO,
            endTime: defaultEndISO
        },
        {
            dayOfWeek: 3, // Wednesday
            startTime: defaultStartISO,
            endTime: defaultEndISO
        },
        {
            dayOfWeek: 5, // Friday
            startTime: defaultStartISO,
            endTime: defaultEndISO
        }
    ];
};

interface AddDoctorFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddDoctorForm: React.FC<AddDoctorFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<Omit<CreateDoctorRequest, 'availability'>>({
        name: "",
        specialty: "",
        email: "",
        phone: ""
    });
    
    // We'll use the default time slots but won't modify them in this simple form
    const availability = useMemo(() => createDefaultTimeSlots(), []);
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
        
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                await createDoctor({
                    ...formData,
                    availability
                });
                toast.success("Doctor added successfully");
                onSuccess();
            } catch (error) {
                console.error("Error adding doctor:", error);
                toast.error("Failed to add doctor");
                setErrors({
                    form: "Failed to add doctor. Please try again.",
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                id="name"
                label="Name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                error={errors.name}
                required
            />

            <FormField
                id="specialty"
                label="Specialty"
                name="specialty"
                value={formData.specialty}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                error={errors.specialty}
                required
            />

            <FormField
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                error={errors.email}
                required
            />

            <FormField
                id="phone"
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                error={errors.phone}
                required
            />

            {errors.submit && <p className="text-destructive text-sm">{errors.submit}</p>}

            <div className="flex justify-end gap-2 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {isSubmitting ? "Adding..." : "Add Doctor"}
                </Button>
            </div>
        </form>
    );
};
