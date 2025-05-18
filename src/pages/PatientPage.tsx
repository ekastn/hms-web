import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { deletePatient, getPatientDetail } from "../lib/api/patients";
import type { PatientDetailResponse } from "../types/patient";
import { 
  ArrowLeft,
  Calendar,
  Edit,
  Mail as MailIcon,
  MapPin,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { EditPatientForm } from "../components/organisms/forms/EditPatientForm";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";

const PatientPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [patientDetail, setPatientDetail] = useState<PatientDetailResponse | null>(null);
    const patient = patientDetail?.patient || null;
    const recentAppointments = patientDetail?.recentAppointments || [];
    const medicalHistory = patientDetail?.medicalHistory || [];
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
        const data = await getPatientDetail(patientId);
        if (data?.patient) {
          setPatientDetail(data);
        } else {
          toast.error("Patient not found");
          navigate("/patients");
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load patient details";
        toast.error(errorMessage);
        navigate("/patients");
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
        toast.success("Patient deleted successfully");
        navigate("/patients");
      } catch (error) {
        console.error("Error deleting patient:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to delete patient";
        toast.error(errorMessage);
      } finally {
        setDeleteDialogOpen(false);
      }
    };

    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        setSearchParams({});
    };

    if (loading || !patient) {
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
                        <Trash2 className="h-4 w-4 mr-2" />
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
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {patient.age} years old • {patient.gender}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MailIcon className="h-4 w-4 text-muted-foreground" />
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
                                    <CardTitle>Appointments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentAppointments.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentAppointments.map((appointment, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium">{appointment.type}</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(appointment.dateTime).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No appointments found.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="medical-history" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Medical History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {medicalHistory.length > 0 ? (
                                        <div className="space-y-4">
                                            {medicalHistory.map((record: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <h4 className="font-medium">{record.diagnosis || 'Medical Record'}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {record.date ? new Date(record.date).toLocaleDateString() : 'No date'}
                                                    </p>
                                                    {record.notes && <p className="mt-2">{record.notes}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No medical history found.</p>
                                    )}
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
                                setPatientDetail(prev => prev ? { ...prev, patient: updatedPatient } : null);
                                closeEditDialog();
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
