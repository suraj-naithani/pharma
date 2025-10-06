import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import SubscriptionsTable from "@/components/SubscriptionsTable";
import { CreateSubscriptionDialog } from "@/components/dialog";
import { Plus } from "lucide-react";

const AdminSubscriptionsPage = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleCreateDialogClose = () => {
        setIsCreateDialogOpen(false);
    };

    const handleCreateSuccess = () => {
        console.log("Subscription created successfully");
    };

    return (
        <AdminLayout>
            <div className="h-full">
                {/* Header */}
                <div className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
                            <p className="text-gray-600 mt-1 text-sm">Manage all subscription plans and user subscriptions</p>
                        </div>
                        <Button
                            className="flex items-center bg-black text-white hover:bg-gray-800"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            <span>ADD SUBSCRIPTION</span>
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <SubscriptionsTable />
                </div>
            </div>

            <CreateSubscriptionDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCreateDialogClose}
                onSuccess={handleCreateSuccess}
            />
        </AdminLayout>
    );
};

export default AdminSubscriptionsPage;
