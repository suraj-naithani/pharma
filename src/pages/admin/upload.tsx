import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const AdminUploadPage = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Export File Section */}
                    <div className="bg-white rounded-lg border border-[#C7D2FE] p-6 hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-xl font-bold text-[#1E293B] text-center mb-8">Upload Export File</h2>

                        <div className="border-2 border-dashed border-[#C7D2FE] rounded-lg p-12 text-center bg-[#EEF2FF] hover:bg-[#C7D2FE]/10 transition-colors duration-200">
                            <div className="w-16 h-16 mx-auto mb-4 text-[#1E3A8A]">
                                <Upload className="w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-[#1E293B] mb-2">Click to upload</h3>
                            <p className="text-[#1E293B] mb-1">or drag and drop</p>
                            <p className="text-sm text-[#1E293B]">Excel files only (.xls, .xlsx, .csv)</p>
                        </div>

                        <div className="mt-6 text-center">
                            <Button className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-2 transition-colors duration-200">
                                Upload Export File
                            </Button>
                        </div>
                    </div>

                    {/* Upload Import File Section */}
                    <div className="bg-white rounded-lg border border-[#C7D2FE] p-6 hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-xl font-bold text-[#1E293B] text-center mb-8">Upload Import File</h2>

                        <div className="border-2 border-dashed border-[#C7D2FE] rounded-lg p-12 text-center bg-[#EEF2FF] hover:bg-[#C7D2FE]/10 transition-colors duration-200">
                            <div className="w-16 h-16 mx-auto mb-4 text-[#1E3A8A]">
                                <Upload className="w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-[#1E293B] mb-2">Click to upload</h3>
                            <p className="text-[#1E293B] mb-1">or drag and drop</p>
                            <p className="text-sm text-[#1E293B]">Excel files only (.xls, .xlsx, .csv)</p>
                        </div>

                        <div className="mt-6 text-center">
                            <Button className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-2 transition-colors duration-200">
                                Upload Import File
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUploadPage;
