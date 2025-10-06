import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const AdminUploadPage = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Export File Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Upload Export File</h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                                <Upload className="w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Click to upload</h3>
                            <p className="text-gray-500 mb-1">or drag and drop</p>
                            <p className="text-sm text-gray-400">Excel files only (.xls, .xlsx, .csv)</p>
                        </div>

                        <div className="mt-6 text-center">
                            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-2">
                                Upload Export File
                            </Button>
                        </div>
                    </div>

                    {/* Upload Import File Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Upload Import File</h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                                <Upload className="w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Click to upload</h3>
                            <p className="text-gray-500 mb-1">or drag and drop</p>
                            <p className="text-sm text-gray-400">Excel files only (.xls, .xlsx, .csv)</p>
                        </div>

                        <div className="mt-6 text-center">
                            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-2">
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
