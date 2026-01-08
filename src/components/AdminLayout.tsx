import { Home, Upload, Users, ChevronsLeft, ChevronsRight, FileText, Building2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Initialize from localStorage if available
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        return saved ? JSON.parse(saved) : false;
    });

    // Save collapse state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    const menuItems = [
        { id: "home", label: "Home", icon: Home, path: "/admin-dashboard" },
        { id: "users", label: "Users", icon: Users, path: "/admin-dashboard/users" },
        { id: "companies", label: "Companies", icon: Building2, path: "/admin-dashboard/companies" },
        { id: "subscriptions", label: "Subscriptions", icon: FileText, path: "/admin-dashboard/subscriptions" },
        { id: "upload", label: "Upload", icon: Upload, path: "/admin-dashboard/upload" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#EEF2FF]">
            {/* Navbar */}
            <Navbar />

            {/* Admin Dashboard Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`${isCollapsed ? 'w-16' : 'w-48'} bg-white border-r border-[#C7D2FE] p-3 transition-all duration-300`}>
                    <div className="mb-6 flex items-center justify-between">
                        {!isCollapsed && <h1 className="text-md font-semibold text-[#1E293B]">Admin</h1>}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-[#1E293B] hover:text-[#1E3A8A] hover:bg-[#C7D2FE]/20 transition-colors duration-200"
                        >
                            {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                        </Button>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-2 px-3'} w-full h-10 rounded-lg text-left text-sm transition-colors duration-200 ${isActive
                                        ? "bg-[#3B82F6] text-white hover:bg-[#60A5FA]"
                                        : "text-[#1E293B] hover:text-[#1E3A8A] hover:bg-[#C7D2FE]/20"
                                        }`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon className={`h-4 w-4 ${isCollapsed ? 'flex-shrink-0' : ''}`} />
                                    {!isCollapsed && <span className="ml-2 text-sm">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-white overflow-y-auto transition-all duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
