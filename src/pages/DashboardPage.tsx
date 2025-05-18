import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CardStats } from "../components/molecules/CardStats";
import { Users, UserRound, Calendar, FileText, Activity, User } from "lucide-react";
import { getDashboardStats } from "../lib/api/dashboard";
import type { DashboardResponse, Activity as ActivityType, UpcomingAppointment } from "../types/dashboard";

const DashboardPage: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const response = await getDashboardStats();
                // The API returns the data directly, no need to access a data property
                setDashboardData(response);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>;
    }

    if (error || !dashboardData) {
        return <div className="text-center py-8 text-destructive">
            {error || 'No data available'}
        </div>;
    }

    // Destructure the dashboard data with default values
    const { 
        stats = {
            patientsCount: 0,
            doctorsCount: 0,
            appointmentsCount: 0,
            medicalRecordsCount: 0
        }, 
        recentActivities = [], 
        upcomingAppointments = [] 
    } = dashboardData || {};
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your hospital management system</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardStats
                    title="Total Patients"
                    value={stats.patientsCount || 0}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 0, isPositive: true }}
                />
                <CardStats
                    title="Total Doctors"
                    value={stats.doctorsCount || 0}
                    icon={<UserRound className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 0, isPositive: true }}
                />
                <CardStats
                    title="Appointments"
                    value={stats.appointmentsCount || 0}
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 0, isPositive: true }}
                />
                <CardStats
                    title="Medical Records"
                    value={stats.medicalRecordsCount || 0}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 0, isPositive: true }}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity: ActivityType) => (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                        <Activity className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingAppointments.map((appointment: UpcomingAppointment) => (
                                <div key={appointment.id} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {appointment.patientName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            With Dr. {appointment.doctorName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium">
                                            {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <span className={`text-xs ${
                                            appointment.status.toLowerCase() === 'scheduled' ? 'text-blue-500' :
                                            appointment.status.toLowerCase() === 'confirmed' ? 'text-green-500' :
                                            appointment.status.toLowerCase() === 'cancelled' ? 'text-red-500' :
                                            'text-muted-foreground'
                                        }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
