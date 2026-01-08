import { useState } from "react"
import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetCompaniesQuery } from "@/redux/api/adminApi"
import Loading from "./ui/loading"
import type { Company } from "@/types/company"
import EditCompanyDialog from "./dialog/EditCompanyDialog"

export default function CompaniesTable() {
    const { data, isLoading, error, isError } = useGetCompaniesQuery()

    // State for edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

    // Use API data directly
    const companies: Company[] = data?.data || []

    const handleDownload = () => {
        // Implement download functionality
        console.log("Downloading companies data...")
    }

    const handleEdit = (companyId: number) => {
        const company = companies.find(c => c.id === companyId)
        if (company) {
            setSelectedCompany(company)
            setIsEditDialogOpen(true)
        }
    }

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false)
        setSelectedCompany(null)
    }

    const handleEditSuccess = () => {
        // The RTK Query will automatically refetch data due to invalidatesTags
        console.log("Company updated successfully")
    }

    if (isLoading) {
        return <Loading className="h-64" />
    }

    if (isError || error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-600">
                Error: {error ? (typeof error === 'object' && 'data' in error ? String(error.data) : String(error)) : "Failed to load companies"}
            </div>
        )
    }

    const columns: ColumnDef<Company>[] = [
        {
            id: "name",
            header: "Company Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "email",
            header: "Email",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "contactPerson",
            header: "Contact Person",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "address",
            header: "Address",
            cell: ({ value }) => <div className="text-slate-600">{value || "N/A"}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "phone",
            header: "Phone",
            cell: ({ value }) => <div className="text-slate-600">{value || "N/A"}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "status",
            header: "Status",
            cell: ({ value }) => {
                const status = value as string
                return (
                    <Badge variant={status === 'active' ? 'default' : 'destructive'}>
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
                    </Badge>
                )
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "createdAt",
            header: "Created At",
            cell: ({ value }) => <div className="text-slate-600 text-sm">{value ? new Date(value as string).toLocaleDateString() : "N/A"}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "actions" as keyof Company,
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit((row as Company).id)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                            // TODO: Implement delete functionality
                            console.log("Delete company:", (row as Company).id)
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ]

    return (
        <>
            <TableData
                data={companies}
                columns={columns}
                title="Companies"
                onDownload={handleDownload}
                isDownloading={false}
                currentPage={1}
                totalPages={1}
                totalRecords={companies.length}
                pageSize={10}
            />

            <EditCompanyDialog
                company={selectedCompany}
                isOpen={isEditDialogOpen}
                onClose={handleEditDialogClose}
                onSuccess={handleEditSuccess}
            />
        </>
    )
}

