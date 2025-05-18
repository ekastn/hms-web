import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash, Plus, FileText, User, Calendar, Download } from "lucide-react";
import { DataTable, type Column } from "../components/organisms/DataTable";
import { ConfirmDialog } from "../components/organisms/ConfirmDialog";
import type { MedicalRecord } from "../types/medicalRecord";
import { getMedicalRecords, deleteMedicalRecord } from "../lib/api/medicalRecords";
import { getPatients } from "../lib/api/patients";
import { getDoctors } from "../lib/api/doctors";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AddMedicalRecordForm } from "../components/organisms/forms/AddMedicalRecordForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Patient } from "../types/patient";
import type { Doctor } from "../types/doctor";

const MedicalRecordsPage: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [patients, setPatients] = useState<Record<string, Patient>>({});
    const [doctors, setDoctors] = useState<Record<string, Doctor>>({});
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [recs, pts, docs] = await Promise.all([
                    getMedicalRecords(),
                    getPatients(),
                    getDoctors()
                ]);
                
                setRecords(recs);
                
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
        
        fetchData();
    }, []);

    const handleViewRecord = (record: MedicalRecord) => {
        navigate(`/records/${record.id}`);
    };

    const handleEditRecord = (record: MedicalRecord) => {
        navigate(`/records/${record.id}?edit=true`);
    };

    const handleDeleteRecord = (record: MedicalRecord) => {
        setRecordToDelete(record);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteRecord = async () => {
        if (!recordToDelete) return;

        try {
            await deleteMedicalRecord(recordToDelete.id);
            setRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
            toast("Medical record deleted");
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteDialogOpen(false);
            setRecordToDelete(null);
        }
    };

    const columns: Column<MedicalRecord>[] = [
        {
            header: "Patient",
            accessorKey: "patientId",
            cell: (record) => {
                const patient = patients[record.patientId];
                const patientName = patient?.name || `Patient (${record.patientId.substring(0, 6)}...)`;
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
            header: "Record Type",
            accessorKey: "recordType",
            sortable: true,
        },
        {
            header: "Doctor",
            accessorKey: "doctorId",
            cell: (record) => {
                const doctor = doctors[record.doctorId];
                return doctor?.name || `Doctor (${record.doctorId.substring(0, 6)}...)`;
            },
        },
        {
            header: "Date",
            accessorKey: "date",
            cell: (record) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
            ),
            sortable: true,
        },
    ];

    const actions = [
        {
            label: "View Details",
            onClick: handleViewRecord,
            icon: <Eye className="h-4 w-4 mr-2" />,
        },
        {
            label: "Edit",
            onClick: handleEditRecord,
            icon: <Edit className="h-4 w-4 mr-2" />,
        },
        {
            label: "Delete",
            onClick: handleDeleteRecord,
            icon: <Trash className="h-4 w-4 mr-2" />,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
                    <p className="text-muted-foreground">
                        Manage patient medical records and documents
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Record
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="all"
                >
                    <option value="all">All Record Types</option>
                    <option value="physical">Physical Examination</option>
                    <option value="consultation">Consultation</option>
                    <option value="lab">Lab Results</option>
                    <option value="imaging">Imaging</option>
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
                data={records}
                columns={columns}
                actions={actions}
                searchPlaceholder="Search medical records..."
            />

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Medical Record</DialogTitle>
                    </DialogHeader>
                    <AddMedicalRecordForm
                        onSuccess={(newRecord) => {
                            setRecords((prev) => [...prev, newRecord]);
                            setIsAddDialogOpen(false);
                            toast("Medical record added");
                        }}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDeleteRecord}
                title="Delete Medical Record"
                description="Are you sure you want to delete this medical record? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
            />
        </div>
    );
};

export default MedicalRecordsPage;
