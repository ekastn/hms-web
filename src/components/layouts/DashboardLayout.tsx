import type React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../organisms/Sidebar";

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-colml-64">
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
