import React from "react";
import { Input } from "../atoms/Input";
import { cn } from "../../lib/utils";
import { Label } from "../ui/label";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type InputChangeEvent = 
  | React.ChangeEvent<HTMLInputElement> 
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

interface FormFieldProps {
  id: string;
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: (e: InputChangeEvent) => void;
  onBlur?: (e: React.FocusEvent<InputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  rows?: number;
  as?: 'input' | 'select';
  options?: Array<{ value: string; label: string }>;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  min,
  max,
  step,
  as = 'input',
  options = [],
}) => {
  const inputId = id || name || '';
  const inputName = name || id || '';

  const commonProps = {
    id: inputId,
    name: inputName,
    value: value ?? '',
    onChange,
    onBlur,
    disabled,
    readOnly,
    'aria-invalid': !!error,
    'aria-required': required,
    className: cn(
      'w-full',
      error && 'border-destructive focus-visible:ring-destructive/50',
      className
    ),
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {as === 'select' ? (
        <select
          {...commonProps}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            commonProps.className
          )}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          {...commonProps}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          autoFocus={autoFocus}
        />
      )}
      
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
