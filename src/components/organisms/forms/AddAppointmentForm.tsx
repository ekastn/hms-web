import type React from "react";
import { useState } from "react";
import { addAppointment } from "../../../lib/api/appointments";
import type { Appointment } from "../../../types/appointment";
import { FormField } from "../../molecules/FormField";
import { Button } from "../../ui/button";

interface AddAppointmentFormProps {
    onSuccess: (appointment: Appointment) => void;
    onCancel: () => void;
}

export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        doctorId: "",
        doctorName: "",
        date: "",
        time: "",
        type: "",
        location: "",
        notes: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        console.log(name, value);
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

        if (!formData.date.trim()) {
            newErrors.date = "Date is required";
        }

        if (!formData.time.trim()) {
            newErrors.time = "Time is required";
        }

        if (!formData.type.trim()) {
            newErrors.type = "Appointment type is required";
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
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
            const newAppointment = await addAppointment({
                ...formData,
                patientId: "p1", // TODO: Mock ID
                doctorId: "d1", // TODO: Mock ID for demo
                status: "Scheduled",
            });
            onSuccess(newAppointment);
        } catch (error) {
            setErrors({
                submit: "Failed to add appointment. Please try again.",
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

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    id="date"
                    name="date"
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={errors.date}
                    required
                />

                <FormField
                    id="time"
                    name="time"
                    label="Time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="10:00 AM"
                    error={errors.time}
                    required
                />
            </div>

            <FormField
                id="type"
                name="type"
                label="Appointment Type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Check-up"
                error={errors.type}
                required
            />

            <FormField
                id="location"
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Main Clinic, Room 101"
                error={errors.location}
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
                    placeholder="Additional notes about the appointment"
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
                    {isSubmitting ? "Adding..." : "Add Appointment"}
                </Button>
            </div>
        </form>
    );
};
