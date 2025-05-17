import type React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserRound, Calendar, FileText } from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarLink {
    title: string;
    href: string;
    icon: React.ReactNode;
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
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background">
            <div className="flex h-16 items-center border-b px-6">
                <h2 className="text-xl font-bold">HMS Admin</h2>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {links.map((link) => (
                    <NavLink
                        key={link.href}
                        to={link.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            )
                        }
                    >
                        {link.icon}
                        <span className="ml-3">{link.title}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
