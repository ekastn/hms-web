import React, { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/services/users";
import type { User } from "@/lib/types";

interface ChangePasswordFormProps {
    user: User;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ user, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
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
            await changePassword(user.id, { newPassword: formData.newPassword, confirmPassword: formData.confirmPassword });
            onSuccess();
        } catch (error) {
            setErrors({
                submit: "Failed to change password. Please try again.",
            });
            console.error("Failed to change password:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                required
            />
            <FormField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
            />
            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Changing..." : "Change Password"}
                </Button>
            </div>
        </form>
    );
};
