import type React from "react";
import { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { updateAppointment } from "@/services/appointments";
import type { Appointment } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface EditAppointmentFormProps {
    appointment: Appointment;
    onSuccess: (appointment: Appointment) => void;
    onCancel: () => void;
}

export const EditAppointmentForm: React.FC<EditAppointmentFormProps> = ({
    appointment,
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        date: new Date(appointment.dateTime).toISOString().split('T')[0],
        time: new Date(appointment.dateTime).toTimeString().split(' ')[0].substring(0, 5),
        type: appointment.type,
        location: appointment.location,
        notes: appointment.notes || "",
        status: appointment.status,
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
            const updatedAppointment = await updateAppointment(appointment.id, formData);
            if (updatedAppointment) {
                onSuccess(updatedAppointment);
            } else {
                throw new Error("Failed to update appointment");
            }
        } catch (error) {
            setErrors({
                submit: "Failed to update appointment. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <label htmlFor="status" className="text-sm font-medium">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <FormField
                id="notes"
                name="notes"
                label="Notes"
                as="textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the appointment"
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
