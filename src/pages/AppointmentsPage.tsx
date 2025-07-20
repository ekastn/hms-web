import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 as Trash, Plus, User } from "lucide-react";
import { DataTable, type Column } from "../components/organisms/DataTable";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import type { Appointment, Patient, Doctor, AppointmentType, AppointmentStatus } from "@/lib/types";
import { getAppointments, deleteAppointment } from "../services/appointments";
import { getPatients } from "../services/patients";
import { getDoctors } from "../services/doctors";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AddAppointmentForm } from "../components/organisms/forms/AddAppointmentForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Record<string, Patient>>({});
    const [doctors, setDoctors] = useState<Record<string, Doctor>>({});
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [selectedStatus, selectedDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [appts, pts, docs] = await Promise.all([
                getAppointments(),
                getPatients(),
                getDoctors()
            ]);

            let filteredAppts = appts;

            if (selectedStatus !== 'all') {
                filteredAppts = filteredAppts.filter(appt => appt.status.toLowerCase() === selectedStatus);
            }

            if (selectedDate) {
                filteredAppts = filteredAppts.filter(appt => new Date(appt.dateTime).toLocaleDateString() === new Date(selectedDate).toLocaleDateString());
            }
            
            setAppointments(filteredAppts);
            
            // Create a mapping of patient IDs to patient objects
            const patientsMap = pts.reduce((acc, patient) => ({
                ...acc,
                [patient.id]: patient
            }), {} as Record<string, Patient>);
            setPatients(patientsMap);
            
            // Create a mapping of doctor IDs to doctor objects
            const doctorsMap = docs.reduce((acc, doctor) => ({
                ...acc,
                [doctor.id]: doctor
            }), {} as Record<string, Doctor>);
            setDoctors(doctorsMap);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };



    const handleViewAppointment = (appointment: Appointment) => {
        navigate(`/appointments/${appointment.id}`);
    };

    const handleEditAppointment = (appointment: Appointment) => {
        navigate(`/appointments/${appointment.id}?edit=true`);
    };

    const handleDeleteAppointment = (appointment: Appointment) => {
        setAppointmentToDelete(appointment);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteAppointment = async () => {
        if (!appointmentToDelete) return;

        try {
            await deleteAppointment(appointmentToDelete.id);
            setAppointments((prev) => prev.filter((a) => a.id !== appointmentToDelete.id));
            toast("Appointment deleted");
        } catch (error) {
            console.log(error);
            toast("Failed to delete appointment");
        } finally {
            setDeleteDialogOpen(false);
            setAppointmentToDelete(null);
        }
    };

    const columns: Column<Appointment>[] = [
        {
            header: "Patient",
            accessorKey: "patientId",
            cell: (appointment) => {
                const patient = patients[appointment.patientId];
                const patientName = patient?.name || `Patient (${appointment.patientId.substring(0, 6)}...)`;
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <span>{patientName}</span>
                    </div>
                );
            },
            sortable: true,
        },
        {
            header: "Doctor",
            accessorKey: "doctorId",
            cell: (appointment) => {
                const doctor = doctors[appointment.doctorId];
                const doctorName = doctor?.name ? `Dr. ${doctor.name}` : `Doctor (${appointment.doctorId.substring(0, 6)}...)`;
                return doctorName;
            },
            sortable: true,
        },
        {
            header: "Type",
            accessorKey: "type",
            cell: (appointment) => {
                const typeMap: Record<string, string> = {
                    consultation: "Consultation",
                    checkup: "Check-up",
                    followup: "Follow-up",
                    surgery: "Surgery",
                    emergency: "Emergency"
                };
                return typeMap[appointment.type] || appointment.type;
            },
        },
        {
            header: "Date & Time",
            accessorKey: "dateTime",
            cell: (appointment) => {
                const date = new Date(appointment.dateTime);
                return (
                    <div className="flex flex-col">
                        <span>{date.toLocaleDateString()}</span>
                        <span className="text-sm text-muted-foreground">
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                );
            },
            sortable: true,
        },
        {
            header: "Duration",
            accessorKey: "duration",
            cell: (appointment) => `${appointment.duration} min`,
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (appointment) => {
                const statusMap: Record<string, { label: string; className: string }> = {
                    scheduled: { 
                        label: "Scheduled", 
                        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                    },
                    completed: { 
                        label: "Completed", 
                        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                    },
                    cancelled: { 
                        label: "Cancelled", 
                        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" 
                    },
                    no_show: { 
                        label: "No Show", 
                        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" 
                    },
                };
                
                const status = statusMap[appointment.status.toLowerCase()] || { 
                    label: appointment.status, 
                    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" 
                };
                
                return (
                    <span 
                        key={`status-${appointment.id}`}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                        {status.label}
                    </span>
                );
            },
        },
    ];

    const actions = [
        {
            label: "View Details",
            onClick: handleViewAppointment,
            icon: <Eye className="h-4 w-4 mr-2" />,
        },
        {
            label: "Edit",
            onClick: handleEditAppointment,
            icon: <Edit className="h-4 w-4 mr-2" />,
        },
        {
            label: "Delete",
            onClick: handleDeleteAppointment,
            icon: <Trash className="h-4 w-4 mr-2" />,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                    <p className="text-muted-foreground">Manage appointments and schedules</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Appointment
                </Button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={loading}
                >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={loading}
                />
            </div>

            <DataTable
                data={appointments}
                columns={columns}
                actions={actions}
                searchPlaceholder="Search appointments..."
                isLoading={loading}
            />

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Appointment</DialogTitle>
                    </DialogHeader>
                    <AddAppointmentForm
                        onSuccess={(newAppointment) => {
                            setAppointments((prev) => [...prev, newAppointment]);
                            setIsAddDialogOpen(false);
                            toast("Appointment added");
                        }}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDeleteAppointment}
                title="Delete Appointment"
                description="Are you sure you want to delete this appointment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />
        </div>
    );
};

export default AppointmentsPage;
