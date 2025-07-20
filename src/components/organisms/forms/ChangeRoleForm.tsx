import React, { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/services/users";
import { Role, type User } from "@/lib/types";

interface ChangeRoleFormProps {
    user: User;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ChangeRoleForm: React.FC<ChangeRoleFormProps> = ({ user, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        role: user.role,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value as Role }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.role) newErrors.role = "Role is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await updateUser(user.id, { role: formData.role });
            onSuccess();
        } catch (error) {
            setErrors({
                submit: "Failed to change role. Please try again.",
            });
            console.error("Failed to change role:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                id="role"
                name="role"
                label="Role"
                as="select"
                value={formData.role as string}
                onChange={handleChange}
                error={errors.role}
                required
                options={Object.values(Role).map(role => ({ value: role, label: role }))}
            />
            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Changing..." : "Change Role"}
                </Button>
            </div>
        </form>
    );
};
