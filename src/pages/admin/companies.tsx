import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import CompaniesTable from "@/components/CompaniesTable";
import CreateCompanyDialog from "@/components/dialog/CreateCompanyDialog";
import { Plus } from "lucide-react";
import { useGetCompaniesQuery } from "@/redux/api/adminApi";

const AdminCompaniesPage = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const { refetch } = useGetCompaniesQuery();

    const handleCreateDialogClose = () => {
        setIsCreateDialogOpen(false);
    };

    const handleCreateSuccess = () => {
        // Refetch companies data after successful creation
        // RTK Query will also auto-refetch due to cache invalidation, but this ensures immediate update
        refetch();
    };

    return (
        <AdminLayout>
            <div className="h-full">
                <div className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1E293B]">Company Management</h1>
                            <p className="text-[#1E293B] mt-1 text-sm">Manage company accounts and information</p>
                        </div>
                        <Button
                            className="flex items-center bg-[#3B82F6] text-white hover:bg-[#60A5FA] transition-colors duration-200"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            <span>ADD COMPANY</span>
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    <CompaniesTable />
                </div>
            </div>

            <CreateCompanyDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCreateDialogClose}
                onSuccess={handleCreateSuccess}
            />
        </AdminLayout>
    );
};

export default AdminCompaniesPage;



