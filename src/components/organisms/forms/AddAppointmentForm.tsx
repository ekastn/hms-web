import { useState, useEffect } from "react";
import { createAppointment } from "../../../lib/api/appointments";
import { getPatients } from "../../../lib/api/patients";
import { getDoctors } from "../../../lib/api/doctors";
import type { Appointment, AppointmentType } from "../../../types/appointment";
import type { Patient } from "../../../types/patient";
import type { Doctor } from "../../../types/doctor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { Loader2, Calendar, Clock, User, Stethoscope } from "lucide-react";

interface AddAppointmentFormProps {
    onSuccess: (appointment: Appointment) => void;
    onCancel: () => void;
}

export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        patientId: "",
        doctorId: "",
        date: "",
        time: "",
        type: "consultation" as AppointmentType,
        duration: 30,
        location: "Clinic",
        notes: "",
    });
    
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch patients and doctors on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsData, doctorsData] = await Promise.all([
                    getPatients(),
                    getDoctors()
                ]);
                setPatients(patientsData);
                setDoctors(doctorsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrors({ submit: 'Failed to load required data. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' ? parseInt(value, 10) : value
        }));
        
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'duration' ? parseInt(value, 10) : value
        }));
        
        // Clear error when field is edited
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        const validationErrors: Record<string, string> = {};
        if (!formData.patientId) validationErrors.patientId = 'Please select a patient';
        if (!formData.doctorId) validationErrors.doctorId = 'Please select a doctor';
        if (!formData.date) validationErrors.date = 'Date is required';
        if (!formData.time) validationErrors.time = 'Time is required';
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Combine date and time for the API
            const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
            const appointmentData = {
                ...formData,
                dateTime,
            };
            
            const newAppointment = await createAppointment(appointmentData);
            onSuccess(newAppointment);
        } catch (error) {
            console.error('Error creating appointment:', error);
            setErrors({ submit: 'Failed to create appointment. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                {/* Patient Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Patient <span className="text-destructive">*</span>
                    </label>
                    <Select
                        value={formData.patientId}
                        onValueChange={(value) => handleSelectChange('patientId', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                            {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{patient.name}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {patient.phone}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.patientId && (
                        <p className="text-sm font-medium text-destructive">{errors.patientId}</p>
                    )}
                </div>

                {/* Doctor Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Doctor <span className="text-destructive">*</span>
                    </label>
                    <Select
                        value={formData.doctorId}
                        onValueChange={(value) => handleSelectChange('doctorId', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="h-4 w-4" />
                                        <span>Dr. {doctor.name}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {doctor.specialty}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.doctorId && (
                        <p className="text-sm font-medium text-destructive">{errors.doctorId}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Date <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>
                        {errors.date && (
                            <p className="text-sm font-medium text-destructive">{errors.date}</p>
                        )}
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Time <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>
                        {errors.time && (
                            <p className="text-sm font-medium text-destructive">{errors.time}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Appointment Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Appointment Type
                        </label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => handleSelectChange('type', value as AppointmentType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select appointment type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="check-up">Check-up</SelectItem>
                                <SelectItem value="follow-up">Follow-up</SelectItem>
                                <SelectItem value="consultation">Consultation</SelectItem>
                                <SelectItem value="procedure">Procedure</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Duration (minutes)
                        </label>
                        <Select
                            value={formData.duration.toString()}
                            onValueChange={(value) => handleSelectChange('duration', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="90">90 minutes</SelectItem>
                                <SelectItem value="120">120 minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter location"
                    />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Additional notes about the appointment..."
                    />
                </div>
            </div>

            {errors.submit && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                    {errors.submit}
                </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
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
                    className="gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : 'Create Appointment'}
                </Button>
            </div>
        </form>
    );
};
