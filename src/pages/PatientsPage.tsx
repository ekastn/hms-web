import { Edit, Eye, Plus, Trash, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import { DataTable, type Column } from "../components/organisms/DataTable";
import { AddPatientForm } from "../components/organisms/forms/AddPatientForm";
import { Button } from "../components/ui/button";
import { deletePatient, getPatients } from "../lib/api/patients";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import type { Patient } from "../types/patient";

const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const data = await getPatients();
            setPatients(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPatient = (patient: Patient) => {
        navigate(`/patients/${patient.id}`);
    };

    const handleEditPatient = (patient: Patient) => {
        navigate(`/patients/${patient.id}?edit=true`);
    };

    const handleDeletePatient = (patient: Patient) => {
        setPatientToDelete(patient);
        setDeleteDialogOpen(true);
    };

    const confirmDeletePatient = async () => {
        if (!patientToDelete) return;

        try {
            await deletePatient(patientToDelete.id);
            setPatients((prev) => prev.filter((p) => p.id !== patientToDelete.id));
            toast("Patient deleted");
        } catch (error) {
            toast("Failed to delete patient");
            console.log(error);
        } finally {
            setDeleteDialogOpen(false);
            setPatientToDelete(null);
        }
    };

    const columns: Column<Patient>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: (patient) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <span>{patient.name}</span>
                </div>
            ),
            sortable: true,
        },
        {
            header: "Age",
            accessorKey: "age",
            sortable: true,
        },
        {
            header: "Gender",
            accessorKey: "gender",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Phone",
            accessorKey: "phone",
        },
    ];

    const actions = [
        {
            label: "View Details",
            onClick: handleViewPatient,
            icon: <Eye className="h-4 w-4 mr-2" />,
        },
        {
            label: "Edit",
            onClick: handleEditPatient,
            icon: <Edit className="h-4 w-4 mr-2" />,
        },
        {
            label: "Delete",
            onClick: handleDeletePatient,
            icon: <Trash className="h-4 w-4 mr-2" />,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
                    <p className="text-muted-foreground">Manage patients and their information</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                </Button>
            </div>

            <DataTable
                data={patients}
                columns={columns}
                actions={actions}
                searchPlaceholder="Search patients..."
            />

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Patient</DialogTitle>
                    </DialogHeader>
                    <AddPatientForm
                        onSuccess={(newPatient) => {
                            setPatients((prev) => [...prev, newPatient]);
                            setIsAddDialogOpen(false);
                            toast("Patient added");
                        }}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDeletePatient}
                title="Delete Patient"
                description={`Are you sure you want to delete ${patientToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />
        </div>
    );
};

export default PatientsPage;
