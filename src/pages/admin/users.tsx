import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import UsersTable from "@/components/UsersTable";
import CreateUserDialog from "@/components/dialog/CreateUserDialog";
import { Plus } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/api/adminUserApi";

const AdminUsersPage = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const { refetch } = useGetAllUsersQuery();

    const handleCreateDialogClose = () => {
        setIsCreateDialogOpen(false);
    };

    const handleCreateSuccess = () => {
        // Refetch users data after successful creation
        // RTK Query will also auto-refetch due to cache invalidation, but this ensures immediate update
        refetch();
    };

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
                        <Button
                            className="flex items-center bg-[#3B82F6] text-white hover:bg-[#60A5FA] transition-colors duration-200"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
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

            <CreateUserDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCreateDialogClose}
                onSuccess={handleCreateSuccess}
            />
        </AdminLayout>
    );
};

export default AdminUsersPage;
