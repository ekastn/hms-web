import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../organisms/Sidebar";
import { Toaster } from "../ui/sonner";

import { BottomNavigationBar } from "../molecules/BottomNavigationBar";
import { cn } from "../../lib/utils";

const DashboardLayout: React.FC = () => {

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-background">
            {/* Sidebar (visible on medium and larger screens) */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            <div
                className={cn(
                    "flex flex-1 flex-col overflow-auto transition-all duration-300 ease-in-out",
                    "pb-16 md:pb-0" // Add padding for bottom nav on small screens
                )}
            >
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
                <Toaster />
            </div>

            {/* Bottom Navigation Bar (visible on small screens) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
                <BottomNavigationBar />
            </div>
        </div>
    );
};

export default DashboardLayout;
