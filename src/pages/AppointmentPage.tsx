import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    Edit,
    Trash,
    Calendar,
    User,
    Clock,
    FileText,
    MapPin,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { EditAppointmentForm } from "../components/organisms/forms/EditAppointmentForm";
import {
    getAppointmentById,
    deleteAppointment,
    updateAppointmentStatus,
} from "../services/appointments";
import { getPatientById } from "../services/patients";
import { getDoctorById } from "../services/doctors";
import type { Appointment } from "@/lib/types";
import type { Patient } from "@/lib/types";
import type { Doctor } from "@/lib/types";
import { toast } from "sonner";

const AppointmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [confirmStatusDialogOpen, setConfirmStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<
        "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | null
    >(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchAppointment(id);
        }
    }, [id]);

    useEffect(() => {
        // Check if edit=true in URL params
        if (searchParams.get("edit") === "true") {
            setIsEditDialogOpen(true);
        }
    }, [searchParams]);

    const fetchAppointment = async (appointmentId: string) => {
        setLoading(true);
        try {
            const data = await getAppointmentById(appointmentId);
            if (data) {
                setAppointment(data);
                
                // Fetch patient and doctor details in parallel
                const [patientData, doctorData] = await Promise.all([
                    getPatientById(data.patientId).catch(() => null),
                    getDoctorById(data.doctorId).catch(() => null)
                ]);
                
                setPatient(patientData || null);
                setDoctor(doctorData || null);
            } else {
                toast.error("Appointment not found");
                navigate("/appointments");
            }
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            toast.error("Failed to fetch appointment details");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditDialogOpen(true);
        setSearchParams({ edit: "true" });
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!appointment) return;

        try {
            await deleteAppointment(appointment.id);
            toast("Appointment deleted");
            navigate("/appointments");
        } catch (error) {
            toast("Failed to delete appointment");
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleStatusChange = (status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled") => {
        setNewStatus(status);
        setConfirmStatusDialogOpen(true);
    };

    const confirmStatusChange = async () => {
        if (!appointment || !newStatus) return;

        try {
            await updateAppointmentStatus(appointment.id, newStatus);
            toast("Status updated");
            fetchAppointment(id); 
        } catch (error) {
            console.log(error);
            toast("Failed to update appointment status");
        } finally {
            setConfirmStatusDialogOpen(false);
            setNewStatus(null);
        }
    };

    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        setSearchParams({});
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading appointment details...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Appointment Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    The appointment you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate("/appointments")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Appointments
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/appointments")}
                        aria-label="Back to appointments"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Appointment Details</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{appointment.type}</h3>
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
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Date: {new Date(appointment.dateTime).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Time: {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Patient: {patient?.name || `Patient (${appointment.patientId.substring(0, 6)}...)`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Doctor: {doctor?.name ? `Dr. ${doctor.name}` : `Doctor (${appointment.doctorId.substring(0, 6)}...)`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>Location: {appointment.location}</span>
                            </div>
                            {appointment.notes && (
                                <div className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                                    <span>Notes: {appointment.notes}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <h4 className="text-sm font-medium mb-2">Update Status</h4>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    variant={
                                        appointment.status === "Scheduled" ? "default" : "outline"
                                    }
                                    onClick={() => handleStatusChange("Scheduled")}
                                    disabled={appointment.status === "Scheduled"}
                                >
                                    Scheduled
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        appointment.status === "Confirmed" ? "default" : "outline"
                                    }
                                    onClick={() => handleStatusChange("Confirmed")}
                                    disabled={appointment.status === "Confirmed"}
                                >
                                    Confirmed
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        appointment.status === "Completed" ? "default" : "outline"
                                    }
                                    onClick={() => handleStatusChange("Completed")}
                                    disabled={appointment.status === "Completed"}
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Completed
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        appointment.status === "Cancelled"
                                            ? "destructive"
                                            : "outline"
                                    }
                                    onClick={() => handleStatusChange("Cancelled")}
                                    disabled={appointment.status === "Cancelled"}
                                >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancelled
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {patient?.name || `Patient ${appointment.patientId.substring(0, 6)}`}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {patient?.email || 'No email available'}
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate(`/patients/${appointment.patientId}`)}
                            >
                                View Patient Details
                            </Button>

                            <div className="pt-4">
                                <h4 className="text-sm font-medium mb-2">Medical History</h4>
                                <p className="text-sm text-muted-foreground">
                                    {appointment.patientHistory || "No medical history available."}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Appointment</DialogTitle>
                    </DialogHeader>
                    {appointment && (
                        <EditAppointmentForm
                            appointment={appointment}
                            onSuccess={() => {
                                closeEditDialog();
                                toast("Appointment updated");
                                fetchAppointment(id);
                            }}
                            onCancel={closeEditDialog}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Appointment"
                description="Are you sure you want to delete this appointment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />

            <ConfirmDialog
                isOpen={confirmStatusDialogOpen}
                onClose={() => setConfirmStatusDialogOpen(false)}
                onConfirm={confirmStatusChange}
                title={`Update Status to ${newStatus}`}
                description={`Are you sure you want to change the appointment status to ${newStatus}?`}
                confirmText="Update"
                cancelText="Cancel"
            />
        </div>
    );
};

export default AppointmentPage;
