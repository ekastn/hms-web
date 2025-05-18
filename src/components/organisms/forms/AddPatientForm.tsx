import type React from "react";
import { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { createPatient } from "@/lib/api/patients";
import type { Patient, CreatePatientRequest } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddPatientFormProps {
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<CreatePatientRequest, 'age'> & { age: string }>({
    name: "",
    age: "",
    gender: "male",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    // Clear submit error when any field changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a positive number";
    } else if (Number(formData.age) > 120) {
      newErrors.age = "Age must be less than 120";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (8-20 digits, may include +-() and spaces)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address is too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const patientData: CreatePatientRequest = {
        ...formData,
        age: parseInt(formData.age, 10),
      };

      const newPatient = await createPatient(patientData);
      toast.success("Patient created successfully");
      onSuccess(newPatient);
    } catch (error) {
      console.error("Error creating patient:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create patient. Please try again.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange as any}
        placeholder="John Doe"
        error={errors.name}
        required
        autoFocus
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="age"
          label="Age"
          name="age"
          type="number"
          min="0"
          max="120"
          value={formData.age}
          onChange={handleChange as any}
          placeholder="30"
          error={errors.age}
          required
        />

        <FormField
          id="gender"
          label="Gender"
          name="gender"
          as="select"
          value={formData.gender}
          onChange={handleChange as any}
          error={errors.gender}
          required
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="email"
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange as any}
          placeholder="john.doe@example.com"
          error={errors.email}
          required
        />

        <FormField
          id="phone"
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange as any}
          placeholder="+1 (555) 123-4567"
          error={errors.phone}
          required
        />
      </div>

      <FormField
        id="address"
        label="Full Address"
        name="address"
        value={formData.address}
        onChange={handleChange as any}
        placeholder="123 Main Street, Apartment 4B, New York, NY 10001, USA"
        error={errors.address}
        required
      />

      {submitError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {submitError}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : 'Add Patient'}
        </Button>
      </div>
    </form>
  );
};
