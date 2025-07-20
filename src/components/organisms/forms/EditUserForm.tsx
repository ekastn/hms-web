import React, { useState, useEffect } from "react";
import { FormField } from "../../molecules/FormField";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/services/users";
import type { User } from "@/lib/types";

interface EditUserFormProps {
    user: User;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
        });
    }, [user]);

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
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
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
            const dataToUpdate = {
                name: formData.name,
                email: formData.email,
            };

            await updateUser(user.id, dataToUpdate);
            onSuccess();
        } catch (error) {
            setErrors({
                submit: "Failed to update user. Please check your input and try again.",
            });
            console.error("Failed to update user:", error);
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
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
            />
            <FormField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
            />
            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update User"}
                </Button>
            </div>
        </form>
    );
};