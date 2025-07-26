import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash, Plus, UserRound } from "lucide-react";
import { DataTable, type Column } from "../components/organisms/DataTable";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import type { Doctor } from "@/lib/types";
import { getDoctors, deleteDoctor } from "../services/doctors";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AddDoctorForm } from "../components/organisms/forms/AddDoctorForm";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { formatAvailability } from "../utils/dateTime";

const DoctorsPage: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const data = await getDoctors();
            if (!Array.isArray(data)) {
                setLoading(false);
                setDoctors([]);
                return;
            }
            const formattedDoctors = data.map(doctor => ({
                ...doctor,
                availability: Array.isArray(doctor.availability) ? doctor.availability : []
            }));
            setDoctors(formattedDoctors);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
            toast.error("Failed to fetch doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDoctor = (doctor: Doctor) => {
        navigate(`/doctors/${doctor.id}`);
    };

    const handleEditDoctor = (doctor: Doctor) => {
        navigate(`/doctors/${doctor.id}?edit=true`);
    };

    const handleDeleteDoctor = (doctor: Doctor) => {
        setDoctorToDelete(doctor);
        setDeleteDialogOpen(true);
    };
    


    const confirmDeleteDoctor = async () => {
        if (!doctorToDelete) return;

        try {
            await deleteDoctor(doctorToDelete.id);
            await fetchDoctors();
            toast.success("Doctor deleted successfully");
        } catch (error) {
            console.error("Error deleting doctor:", error);
            toast.error("Failed to delete doctor");
        } finally {
            setDeleteDialogOpen(false);
            setDoctorToDelete(null);
        }
    };

    const columns: Column<Doctor>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: (doctor) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserRound className="h-4 w-4 text-primary" />
                    </div>
                    <span>{doctor.name}</span>
                </div>
            ),
            sortable: true,
        },
        {
            header: "Specialty",
            accessorKey: "specialty",
            sortable: true,
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Phone",
            accessorKey: "phone",
        },
        {
            header: "Availability",
            accessorKey: "availability",
            cell: (doctor) => (
                <div className="max-w-xs truncate" title={formatAvailability(doctor.availability)}>
                    {formatAvailability(doctor.availability)}
                </div>
            ),
        },
    ];

    const actions = [
        {
            label: "View Details",
            onClick: handleViewDoctor,
            icon: <Eye className="h-4 w-4 mr-2" />,
        },
        {
            label: "Edit",
            onClick: handleEditDoctor,
            icon: <Edit className="h-4 w-4 mr-2" />,
        },
        {
            label: "Delete",
            onClick: handleDeleteDoctor,
            icon: <Trash className="h-4 w-4 mr-2" />,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
                    <p className="text-muted-foreground">Manage doctors and their information</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Doctor
                </Button>
            </div>

            <DataTable
                data={doctors}
                columns={columns}
                actions={actions}
                searchPlaceholder="Search doctors..."
                isLoading={loading}
            />

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Doctor</DialogTitle>
                    </DialogHeader>
                    <AddDoctorForm
                        onSuccess={() => {
                            fetchDoctors();
                            setIsAddDialogOpen(false);
                        }}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDeleteDoctor}
                title="Delete Doctor"
                description={`Are you sure you want to delete ${doctorToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />
        </div>
    );
};

export default DoctorsPage;
