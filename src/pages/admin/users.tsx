import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import UsersTable from "@/components/UsersTable";
import { Plus } from "lucide-react";

const AdminUsersPage = () => {
    return (
        <AdminLayout>
            <div className="h-full">
                {/* Header */}
                <div className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1E293B]">User Management</h1>
                            <p className="text-[#1E293B] mt-1 text-sm">Manage user accounts and permissions</p>
                        </div>
                        <Button className="flex items-center bg-[#3B82F6] text-white hover:bg-[#60A5FA] transition-colors duration-200">
                            <Plus className="w-4 h-4" />
                            <span>ADD USER</span>
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <UsersTable />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUsersPage;
