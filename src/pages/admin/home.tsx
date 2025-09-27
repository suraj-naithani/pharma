import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import UsersTable from "@/components/UsersTable";
import SubscriptionsTable from "@/components/SubscriptionsTable";
import { Plus } from "lucide-react";

const AdminHomePage = () => {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <AdminLayout>
            <div className="h-full">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    {/* Tab Navigation */}
                    <div className="flex space-x-8 border-b border-gray-200">
                        <button
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === "users"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setActiveTab("users")}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                                <span>USERS</span>
                            </div>
                        </button>
                        <button
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === "subscriptions"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setActiveTab("subscriptions")}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>SUBSCRIPTIONS</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === "users" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                                <Button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700">
                                    <Plus className="w-4 h-4" />
                                    <span>ADD USER</span>
                                </Button>
                            </div>
                            <UsersTable />
                        </div>
                    )}

                    {activeTab === "subscriptions" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Subscription Management</h2>
                                <Button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700">
                                    <Plus className="w-4 h-4" />
                                    <span>ADD SUBSCRIPTION</span>
                                </Button>
                            </div>
                            <SubscriptionsTable />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminHomePage;
