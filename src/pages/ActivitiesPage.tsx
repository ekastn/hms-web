import React, { useState, useEffect } from "react";
import { DataTable, type Column } from "@/components/organisms/DataTable";
import { getActivities } from "@/services/activities"; // We'll create this service
import type { Activity } from "@/lib/types";
import { Activity as ActivityIcon } from "lucide-react";

const ActivitiesPage: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getActivities();
            if (!Array.isArray(data)) {
                setLoading(false);
                setActivities([]);
                return;
            }
            setActivities(data);
        } catch (err) {
            setError("Failed to fetch activities.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const columns: Column<Activity>[] = [
        {
            header: "Timestamp",
            accessorKey: "timestamp",
            cell: (row) => new Date(row.timestamp).toLocaleString(),
            sortable: true,
        },
        {
            header: "Type",
            accessorKey: "type",
            cell: (row) => row.type,
            sortable: true,
        },
        {
            header: "Title",
            accessorKey: "title",
            cell: (row) => row.title,
            sortable: true,
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: (row) => row.description,
            sortable: false,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-destructive">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
                <p className="text-muted-foreground">Detailed log of all system activities</p>
            </div>

            {activities.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No activities found</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                        System activities will appear here.
                    </p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={activities}
                    searchable
                    searchPlaceholder="Search activities..."
                />
            )}
        </div>
    );
};

export default ActivitiesPage;
