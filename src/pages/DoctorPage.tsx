import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash, Calendar, Users, Mail, Phone, Clock } from "lucide-react";
import { formatTimeSlot } from "../utils/dateTime";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import type { DoctorDetailResponse } from "../types/doctor";
import { getDoctorById, deleteDoctor } from "../lib/api/doctors";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { EditDoctorForm } from "../components/organisms/forms/EditDoctorForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DoctorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [doctor, setDoctor] = useState<DoctorDetailResponse | null>(null);
    const [showRecentPatients, setShowRecentPatients] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchDoctor(id);
        }
    }, [id]);

    useEffect(() => {
        if (searchParams.get("edit") === "true") {
            setIsEditDialogOpen(true);
        }
    }, [searchParams]);

    const fetchDoctor = async (doctorId: string) => {
        setLoading(true);
        try {
            const data = await getDoctorById(doctorId);
            if (data) {
                // If the data has recentPatients, it's a DoctorDetailResponse
                if ('recentPatients' in data) {
                    setDoctor(data as DoctorDetailResponse);
                    setShowRecentPatients(true);
                } else {
                    // Otherwise, it's a basic Doctor, convert it to DoctorDetailResponse
                    setDoctor({
                        ...data,
                        recentPatients: []
                    });
                    setShowRecentPatients(false);
                }
            } else {
                toast("Doctor not found");
                navigate("/doctors");
            }
        } catch (error) {
            console.log(error);
            toast("Failed to fetch doctor details");
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
        if (!doctor) return;

        try {
            await deleteDoctor(doctor.id);
            toast("Doctor deleted");
            navigate("/doctors");
        } catch (error) {
            console.log(error);
            toast("Failed to delete doctor");
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
                    <p>Loading doctor details...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    The doctor you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate("/doctors")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Doctors
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
                        onClick={() => navigate("/doctors")}
                        aria-label="Back to doctors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">{doctor.name}</h1>
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
                        <CardTitle>Doctor Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{doctor.name}</h3>
                                <p className="text-muted-foreground">{doctor.specialty}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{doctor.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium mb-1">Availability:</p>
                                    {doctor.availability.length > 0 ? (
                                        <ul className="space-y-1 text-sm">
                                            {doctor.availability.map((slot, index) => (
                                                <li key={`${slot.dayOfWeek}-${slot.startTime}-${index}`} className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <span>{
                                                        formatTimeSlot({
                                                            dayOfWeek: slot.dayOfWeek,
                                                            startTime: slot.startTime,
                                                            endTime: slot.endTime
                                                        })
                                                    }</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No availability set</p>
                                    )}
                                </div>
                            </div>
                            {showRecentPatients && doctor?.recentPatients && (
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>Recent Patients: {doctor.recentPatients.length}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* TODO: This would be populated with actual patient data */}
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 rounded-lg border p-3"
                                >
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Patient #{i}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Last visit: 3 days ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Doctor</DialogTitle>
                    </DialogHeader>
                    {doctor && (
                        <EditDoctorForm
                            doctor={doctor}
                            onSuccess={(updatedDoctor) => {
                                setDoctor({
                                    ...updatedDoctor,
                                    recentPatients: doctor.recentPatients || []
                                });
                                closeEditDialog();
                                toast("Doctor updated");
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
                title="Delete Doctor"
                description={`Are you sure you want to delete ${doctor.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />
        </div>
    );
};


export default DoctorPage;
