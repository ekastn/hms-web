import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash, Plus, User, Clock } from "lucide-react";
import { DataTable, type Column } from "../components/organisms/DataTable";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import type { Appointment } from "../types/appointment";
import { getAppointments, deleteAppointment } from "../lib/api/appointments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AddAppointmentForm } from "../components/organisms/forms/AddAppointmentForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await getAppointments();
            setAppointments(data);
        } catch (error) {
            console.log(error);
            toast("Failed to fetch appointments");
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
            accessorKey: "patientName",
            cell: (appointment) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <span>{appointment.patientName}</span>
                </div>
            ),
            sortable: true,
        },
        {
            header: "Doctor",
            accessorKey: "doctorName",
            sortable: true,
        },
        {
            header: "Type",
            accessorKey: "type",
        },
        {
            header: "Date",
            accessorKey: "date",
            cell: (appointment) => <span>{new Date(appointment.date).toLocaleDateString()}</span>,
            sortable: true,
        },
        {
            header: "Time",
            accessorKey: "time",
            cell: (appointment) => (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (appointment) => (
                <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : appointment.status === "Confirmed"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                >
                    {appointment.status}
                </div>
            ),
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
                    defaultValue="all"
                >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="all"
                >
                    <option value="all">All Doctors</option>
                    <option value="dr-smith">Dr. Jane Smith</option>
                    <option value="dr-johnson">Dr. John Johnson</option>
                    <option value="dr-williams">Dr. Emily Williams</option>
                </select>

                <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
            </div>

            <DataTable
                data={appointments}
                columns={columns}
                actions={actions}
                searchPlaceholder="Search appointments..."
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
