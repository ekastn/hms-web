import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CardStats } from "../components/molecules/CardStats";
import { Users, UserRound, Calendar, FileText } from "lucide-react";
import { getDashboardStats } from "../lib/api/dashboard";

const DashboardPage: React.FC = () => {
    const stats = getDashboardStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your hospital management system</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardStats
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 12, isPositive: true }}
                />
                <CardStats
                    title="Total Doctors"
                    value={stats.totalDoctors}
                    icon={<UserRound className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 5, isPositive: true }}
                />
                <CardStats
                    title="Appointments"
                    value={stats.totalAppointments}
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 8, isPositive: true }}
                />
                <CardStats
                    title="Medical Records"
                    value={stats.totalMedicalRecords}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    trend={{ value: 15, isPositive: true }}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 rounded-lg border p-3"
                                >
                                    <div className="rounded-full bg-primary/10 p-2">
                                        {activity.type === "appointment" && (
                                            <Calendar className="h-4 w-4 text-primary" />
                                        )}
                                        {activity.type === "patient" && (
                                            <Users className="h-4 w-4 text-primary" />
                                        )}
                                        {activity.type === "doctor" && (
                                            <UserRound className="h-4 w-4 text-primary" />
                                        )}
                                        {activity.type === "record" && (
                                            <FileText className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {activity.time}
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
                            {stats.upcomingAppointments.map((appointment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 rounded-lg border p-3"
                                >
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {appointment.patientName}
                                        </p>
                                        <p className="text-xs">{appointment.doctorName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {appointment.time}
                                        </p>
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
