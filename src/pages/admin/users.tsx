import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import UsersTable from "@/components/UsersTable";
import { Plus } from "lucide-react";

const AdminUsersPage = () => {
    return (
        <AdminLayout>
            <div className="h-full">
                {/* Content */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                        <Button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700">
                            <Plus className="w-4 h-4" />
                            <span>ADD USER</span>
                        </Button>
                    </div>

                    {/* User Table */}
                    <UsersTable />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUsersPage;
