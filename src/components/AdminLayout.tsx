import { Home, Upload, Users, ChevronsLeft, ChevronsRight } from "lucide-react";
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
        { id: "upload", label: "Upload", icon: Upload, path: "/admin-dashboard/upload" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Admin Dashboard Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 p-4 transition-all duration-300`}>
                    <div className="mb-8 flex items-center justify-between">
                        {!isCollapsed && <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
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
                                    className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} w-full h-12 rounded-lg text-left transition-colors ${isActive
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon className={`h-5 w-5 ${isCollapsed ? 'flex-shrink-0' : ''}`} />
                                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
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
