import React, { useState } from "react";
import { FormField } from "../../molecules/FormField";
import { Button } from "@/components/ui/button";
import { createUser } from "@/services/users";
import { Role } from "@/lib/types";

interface AddUserFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: Role.Receptionist, // Default role
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
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
            await createUser(formData);
            onSuccess();
        } catch (error) {
            setErrors({
                submit: "Failed to add user. Please check your input and try again.",
            });
            console.error("Failed to add user:", error);
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
            <FormField
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
            />
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
                    {isSubmitting ? "Adding..." : "Add User"}
                </Button>
            </div>
        </form>
    );
};
