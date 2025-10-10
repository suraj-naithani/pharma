import AdminLayout from "@/components/AdminLayout";

const AdminHomePage = () => {
    return (
        <AdminLayout>
            <div className="h-full">
                {/* Header */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#1E293B]">Admin Dashboard</h1>
                    <p className="text-[#1E293B] mt-1 text-sm">Welcome to the admin panel. Use the sidebar to navigate between different sections.</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Dashboard Cards */}
                        <div className="bg-white rounded-lg shadow border border-[#C7D2FE] p-6 hover:shadow-lg transition-shadow duration-200">
                            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Users</h3>
                            <p className="text-[#1E293B]">Manage user accounts and permissions</p>
                        </div>

                        <div className="bg-white rounded-lg shadow border border-[#C7D2FE] p-6 hover:shadow-lg transition-shadow duration-200">
                            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Subscriptions</h3>
                            <p className="text-[#1E293B]">Handle subscription management and billing</p>
                        </div>

                        <div className="bg-white rounded-lg shadow border border-[#C7D2FE] p-6 hover:shadow-lg transition-shadow duration-200">
                            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Upload</h3>
                            <p className="text-[#1E293B]">Upload and manage data files</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminHomePage;
