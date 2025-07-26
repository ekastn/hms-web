import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/types";
import {
    BookUser,
    Calendar,
    FileText,
    LayoutDashboard,
    LogOut,
    ScanEye,
    UserRound,
    Users
} from "lucide-react";
import type React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

interface SidebarLink {
    title: string;
    href: string;
    icon: React.ReactNode;
    roles?: Role[];
}

const links: SidebarLink[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Doctors",
        href: "/doctors",
        icon: <UserRound className="h-5 w-5" />,
    },
    {
        title: "Patients",
        href: "/patients",
        icon: <Users className="h-5 w-5" />,
    },
    {
        title: "Appointments",
        href: "/appointments",
        icon: <Calendar className="h-5 w-5" />,
    },
    {
        title: "Medical Records",
        href: "/records",
        icon: <FileText className="h-5 w-5" />,
    },
    {
        title: "Activity",
        href: "/activities",
        icon: <ScanEye className="h-5 w-5" />,
        roles: [Role.Admin, Role.Management],
    },
    {
        title: "Users",
        href: "/users",
        icon: <BookUser className="h-5 w-5" />,
        roles: [Role.Admin],
    },
];

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="flex flex-col border-r bg-background w-64">
            <div className="flex h-16 items-center border-b px-6">
                <h2 className="text-xl font-bold">HealthCare</h2>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {links.map((link) => {
                    // Check if the link has roles defined and if the current user's role is included
                    const canView = link.roles ? user && link.roles.includes(user.role) : true;

                    if (!canView) {
                        return null; // Don't render the link if the user doesn't have the required role
                    }

                    return (
                        <NavLink
                            key={link.href}
                            to={link.href}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                )
                            }
                        >
                            {link.icon}
                            <span className="ml-3">{link.title}</span>
                        </NavLink>
                    );
                })}
            </nav>
            <div className="mt-auto p-3">
                <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};
