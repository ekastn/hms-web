import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 as Trash, User as UserIcon, KeyRound, UserCog } from "lucide-react";
import { DataTable, type Column } from "@/components/organisms/DataTable";
import { ConfirmDialog } from "@/components/organisms/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getUsers, deactivateUser, updateUser } from "@/services/users";
import type { User, Role } from "@/lib/types";
import { AddUserForm } from "@/components/organisms/forms/AddUserForm";
import { EditUserForm } from "@/components/organisms/forms/EditUserForm";
import { ChangePasswordForm } from "@/components/organisms/forms/ChangePasswordForm";
import { ChangeRoleForm } from "@/components/organisms/forms/ChangeRoleForm";

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
    const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to load users";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUserSuccess = () => {
        toast.success("User added successfully!");
        setIsAddUserDialogOpen(false);
        fetchUsers();
    };

    const handleEditUserSuccess = () => {
        toast.success("User updated successfully!");
        setIsEditDialogOpen(false);
        fetchUsers();
    };

    const handleChangePasswordSuccess = () => {
        toast.success("Password changed successfully!");
        setIsChangePasswordDialogOpen(false);
        fetchUsers();
    };

    const handleChangeRoleSuccess = () => {
        toast.success("User role updated successfully!");
        setIsChangeRoleDialogOpen(false);
        fetchUsers();
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await updateUser(user.id, {
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: !user.isActive
            });
            toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully!`);
            fetchUsers();
        } catch (err) {
            console.error("Error toggling user status:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to toggle user status";
            toast.error(errorMessage);
        }
    };

    const handleDeactivateUser = async () => {
        if (userToDeactivate) {
            try {
                await deactivateUser(userToDeactivate.id);
                toast.success("User deactivated successfully!");
                fetchUsers();
            } catch (err) {
                toast.error("Failed to deactivate user.");
                console.error(err);
            } finally {
                setIsConfirmDialogOpen(false);
                setUserToDeactivate(null);
            }
        }
    };

    const columns: Column<User>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: (user) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>{user.name}</span>
                </div>
            ),
            sortable: true,
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: (row) => row.email,
            sortable: true,
        },
        {
            header: "Role",
            accessorKey: "role",
            cell: (row) => row.role,
            sortable: true,
        },
        {
            header: "Status",
            accessorKey: "isActive",
            cell: (row) => (row.isActive ? "Active" : "Inactive"),
            sortable: true,
        },
    ];

    const actions = [
        {
            label: "Edit Info",
            onClick: (user: User) => {
                setSelectedUser(user);
                setIsEditDialogOpen(true);
            },
            icon: <Edit className="h-4 w-4 mr-2" />,
        },
        {
            label: "Change Password",
            onClick: (user: User) => {
                setSelectedUser(user);
                setIsChangePasswordDialogOpen(true);
            },
            icon: <KeyRound className="h-4 w-4 mr-2" />,
        },
        {
            label: "Change Role",
            onClick: (user: User) => {
                setSelectedUser(user);
                setIsChangeRoleDialogOpen(true);
            },
            icon: <UserCog className="h-4 w-4 mr-2" />,
        },
        {
            label: (user: User) => (user.isActive ? "Deactivate" : "Activate"),
            onClick: (user: User) => {
                setUserToDeactivate(user);
                setIsConfirmDialogOpen(true);
            },
            icon: (user: User) => (user.isActive ? <Trash className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />),
            variant: (user: User) => (user.isActive ? "destructive" : "default") as "destructive" | "default",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage users and their roles</p>
                </div>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={loading}>
                            <Plus className="mr-2 h-4 w-4" />
                            {loading ? "Loading..." : "Add New User"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <AddUserForm onSuccess={handleAddUserSuccess} onCancel={() => setIsAddUserDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading users...</span>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No users found</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                        Get started by adding a new user.
                    </p>
                    <Button onClick={() => setIsAddUserDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={users}
                    actions={actions}
                    searchPlaceholder="Search users..."
                />
            )}

            {selectedUser && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <EditUserForm user={selectedUser} onSuccess={handleEditUserSuccess} onCancel={() => setIsEditDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            {selectedUser && (
                <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Change Password for {selectedUser.name}</DialogTitle>
                        </DialogHeader>
                        <ChangePasswordForm user={selectedUser} onSuccess={handleChangePasswordSuccess} onCancel={() => setIsChangePasswordDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            {selectedUser && (
                <Dialog open={isChangeRoleDialogOpen} onOpenChange={setIsChangeRoleDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Change Role for {selectedUser.name}</DialogTitle>
                        </DialogHeader>
                        <ChangeRoleForm user={selectedUser} onSuccess={handleChangeRoleSuccess} onCancel={() => setIsChangeRoleDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={() => handleToggleStatus(userToDeactivate!)}
                title={userToDeactivate?.isActive ? "Deactivate User" : "Activate User"}
                description={`Are you sure you want to ${userToDeactivate?.isActive ? "deactivate" : "activate"} user ${userToDeactivate?.name}?`}
                confirmText={userToDeactivate?.isActive ? "Deactivate" : "Activate"}
                cancelText="Cancel"
                variant={userToDeactivate?.isActive ? "destructive" : "default"}
            />
        </div>
    );
};

export default UsersPage;