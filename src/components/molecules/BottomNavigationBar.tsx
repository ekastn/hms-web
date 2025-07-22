import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserRound, Calendar, FileText, MoreHorizontal, Activity, BookUser, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/types";

const mainLinks = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Patients",
        href: "/patients",
        icon: <Users className="h-5 w-5" />,
    },
    {
        title: "Doctors",
        href: "/doctors",
        icon: <UserRound className="h-5 w-5" />,
    },
    {
        title: "Appointments",
        href: "/appointments",
        icon: <Calendar className="h-5 w-5" />,
    },
];

const moreLinks = [
    {
        title: "Medical Records",
        href: "/records",
        icon: <FileText className="h-5 w-5" />,
        roles: [Role.Admin, Role.Doctor, Role.Nurse, Role.Management],
    },
    {
        title: "Activity Log",
        href: "/activities",
        icon: <Activity className="h-5 w-5" />,
        roles: [Role.Admin, Role.Management],
    },
    {
        title: "User Management",
        href: "/users",
        icon: <BookUser className="h-5 w-5" />,
        roles: [Role.Admin],
    },
];

export const BottomNavigationBar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="flex h-16 w-full items-center justify-around border-t bg-background shadow-lg">
            {mainLinks.map((link) => (
                <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                        cn(
                            "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )
                    }
                >
                    {link.icon}
                    <span className="mt-1">{link.title}</span>
                </NavLink>
            ))}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex flex-col items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="mt-1">More</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {moreLinks.map((link) => {
                        const canView = link.roles ? user && link.roles.includes(user.role) : true;
                        if (!canView) {
                            return null;
                        }
                        return (
                            <DropdownMenuItem key={link.href} asChild>
                                <NavLink
                                    to={link.href}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                                            isActive ? "bg-primary text-primary-foreground" : ""
                                        )
                                    }
                                >
                                    {link.icon}
                                    <span className="ml-3">{link.title}</span>
                                </NavLink>
                            </DropdownMenuItem>
                        );
                    })}
                    <DropdownMenuItem onClick={logout} className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
};
