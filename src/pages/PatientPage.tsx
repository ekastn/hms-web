import {
    Activity,
    ArrowLeft,
    Calendar,
    Edit,
    Mail,
    MapPin,
    Phone,
    Trash,
    User,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import { EditPatientForm } from "../components/organisms/forms/EditPatientForm";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { deletePatient, getPatientById } from "../lib/api/patients";
import type { Patient } from "../types/patient";

const PatientPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchPatient(id);
        }
    }, [id]);

    useEffect(() => {
        // Check if edit=true in URL params
        if (searchParams.get("edit") === "true") {
            setIsEditDialogOpen(true);
        }
    }, [searchParams]);

    const fetchPatient = async (patientId: string) => {
        setLoading(true);
        try {
            const data = await getPatientById(patientId);
            if (data) {
                setPatient(data);
            } else {
                toast("Patient not found");
                navigate("/patients");
            }
        } catch (error) {
            toast("Failed to fetch patient details");
            console.log(error);
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
        if (!patient) return;

        try {
            await deletePatient(patient.id);
            toast("Patient deleted");
            navigate("/patients");
        } catch (error) {
            console.log(error);
            toast("Failed to delete patient");
        } finally {
            setDeleteDialogOpen(false);
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
                    <p>Loading patient details...</p>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    The patient you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate("/patients")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Patients
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
                        onClick={() => navigate("/patients")}
                        aria-label="Back to patients"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
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

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{patient.name}</h3>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {patient.age} years old • {patient.gender}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{patient.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2">
                    <Tabs defaultValue="appointments">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="appointments">Appointments</TabsTrigger>
                            <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="appointments" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Appointments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {patient.appointments && patient.appointments.length > 0 ? (
                                            patient.appointments.map((appointment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 rounded-lg border p-3"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Calendar className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {appointment.doctorName}
                                                        </p>
                                                        <p className="text-sm">
                                                            {appointment.type}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(
                                                                appointment.date
                                                            ).toLocaleDateString()}{" "}
                                                            at {appointment.time}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            appointment.status === "Completed"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                : appointment.status === "Scheduled"
                                                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                        }`}
                                                    >
                                                        {appointment.status}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">
                                                No appointments found.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="medical-history" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Medical History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {patient.medicalHistory &&
                                        patient.medicalHistory.length > 0 ? (
                                            patient.medicalHistory.map((record, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-4 rounded-lg border p-3"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                                        <Activity className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {record.condition}
                                                        </p>
                                                        <p className="text-sm">{record.notes}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Diagnosed:{" "}
                                                            {new Date(
                                                                record.diagnosedDate
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">
                                                No medical history found.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Patient</DialogTitle>
                    </DialogHeader>
                    {patient && (
                        <EditPatientForm
                            patient={patient}
                            onSuccess={(updatedPatient) => {
                                setPatient(updatedPatient);
                                closeEditDialog();
                                toast("Patient updated");
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
                title="Delete Patient"
                description={`Are you sure you want to delete ${patient.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />
        </div>
    );
};

export default PatientPage;
