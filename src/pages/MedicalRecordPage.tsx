import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    Edit,
    FileText,
    Trash,
    User
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import { EditMedicalRecordForm } from "../components/organisms/forms/EditMedicalRecordForm";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { deleteMedicalRecord, getMedicalRecordById } from "../services/medicalRecords";
import type { MedicalRecord } from "@/lib/types";

const MedicalRecordDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [record, setRecord] = useState<MedicalRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchMedicalRecord(id);
        }
    }, [id]);

    useEffect(() => {
        // Check if edit=true in URL params
        if (searchParams.get("edit") === "true") {
            setIsEditDialogOpen(true);
        }
    }, [searchParams]);

    const fetchMedicalRecord = async (recordId: string) => {
        setLoading(true);
        try {
            const data = await getMedicalRecordById(recordId);
            if (data) {
                setRecord(data);
            } else {
                toast("Medical record not found");
                navigate("/records");
            }
        } catch (error) {
            console.log(error);
            toast("Failed to fetch medical record details");
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
        if (!record) return;

        try {
            await deleteMedicalRecord(record.id);
            toast("Medical record deleted");
            navigate("/records");
        } catch (error) {
            console.log(error);
            toast("Failed to delete medical record");
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
                    <p>Loading medical record details...</p>
                </div>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Medical Record Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    The medical record you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate("/medical-records")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Medical Records
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
                        onClick={() => navigate("/records")}
                        aria-label="Back to medical records"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Medical Record</h1>
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
                        <CardTitle>Record Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{record.recordType}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Record ID: {record.id}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Patient ID: {record.patientId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Doctor ID: {record.doctorId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Date: {new Date(record.date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Description</h4>
                            <p className="text-sm">{record.description}</p>
                        </div>

                        <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Diagnosis</h4>
                            <p className="text-sm">{record.diagnosis}</p>
                        </div>

                        <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Treatment</h4>
                            <p className="text-sm">{record.treatment}</p>
                        </div>

                        <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Notes</h4>
                            <p className="text-sm">{record.notes || "No additional notes."}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Medical Record</DialogTitle>
                    </DialogHeader>
                    {record && (
                        <EditMedicalRecordForm
                            record={record}
                            onSuccess={() => {
                                closeEditDialog();
                                toast("Medical record updated");
                                fetchMedicalRecord(id);
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
                title="Delete Medical Record"
                description="Are you sure you want to delete this medical record? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />
        </div>
    );
};

export default MedicalRecordDetailPage;
