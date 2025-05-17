import type React from "react";
import { Input } from "../atoms/Input";
import { cn } from "../../lib/utils";
import { Label } from "../ui/label";

interface FormFieldProps {
    id: string;
    label: string;
    name?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    required = false,
    className,
}) => {
    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
                id={id}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                error={!!error}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    );
};
