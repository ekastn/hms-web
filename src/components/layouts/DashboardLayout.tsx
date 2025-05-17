import type React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../organisms/Sidebar";
import { Toaster } from "../ui/sonner";

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-colml-64">
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
                <Toaster />
            </div>
        </div>
    );
};

export default DashboardLayout;
