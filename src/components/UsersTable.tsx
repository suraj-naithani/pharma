import { useState } from "react"
import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/redux/api/adminUserApi"
import Loading from "./ui/loading"
import type { User } from "@/types/users"
import EditUserDialog from "./dialog/EditUserDialog"
import ConfirmDialog from "./dialog/ConfirmDialog"
import { toast } from "sonner"

export default function UsersTable() {
    const { data, isLoading, error, isError } = useGetAllUsersQuery()
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

    // State for edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // State for delete confirmation dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<number | null>(null)

    // Use API data directly
    const users: User[] = data?.data || []

    const handleDownload = () => {
        // Implement download functionality
        console.log("Downloading users data...")
    }

    const handleEdit = (userId: number) => {
        const user = users.find(u => u.id === userId)
        if (user) {
            setSelectedUser(user)
            setIsEditDialogOpen(true)
        }
    }

    const handleDelete = (userId: number) => {
        setUserToDelete(userId)
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.toString()).unwrap()
                toast.success("User deleted successfully!", {
                    description: "The user has been permanently removed.",
                    duration: 3000,
                })
                setIsDeleteDialogOpen(false)
                setUserToDelete(null)
            } catch (error: unknown) {
                console.error("Failed to delete user:", error)
                let errorMessage = "Failed to delete user. Please try again."
                if (error && typeof error === "object" && "data" in error) {
                    const errorData = error.data as { message?: string }
                    errorMessage = errorData?.message || errorMessage
                }
                toast.error("Failed to delete user", {
                    description: errorMessage,
                    duration: 4000,
                })
            }
        }
    }

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false)
        setUserToDelete(null)
    }

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false)
        setSelectedUser(null)
    }

    const handleEditSuccess = () => {
        // The RTK Query will automatically refetch data due to invalidatesTags
        console.log("User updated successfully")
    }

    if (isLoading) {
        return <Loading className="h-64" />
    }

    if (isError || error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-600">
                Error: {error ? (typeof error === 'object' && 'data' in error ? String(error.data) : String(error)) : "Failed to load users"}
            </div>
        )
    }

    const columns: ColumnDef<User>[] = [
        {
            id: "name",
            header: "Name",
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
            id: "role",
            header: "Role",
            cell: ({ value }) => {
                const role = value as string
                return (
                    <Badge variant={role === 'admin' ? 'default' : 'outline'}>
                        {role?.charAt(0).toUpperCase() + role?.slice(1) || role}
                    </Badge>
                )
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "partyName",
            header: "Party Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value || "N/A"}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "mobileNumber",
            header: "Mobile Number",
            cell: ({ value }) => <div className="text-slate-600">{value || "N/A"}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "isActive",
            header: "Status",
            cell: ({ value }) => {
                const isActive = value as number
                return (
                    <Badge variant={isActive === 1 ? 'default' : 'destructive'}>
                        {isActive === 1 ? 'Active' : 'Inactive'}
                    </Badge>
                )
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "isVerified",
            header: "Verified",
            cell: ({ value }) => {
                const isVerified = value as number
                return (
                    <Badge variant={isVerified === 1 ? 'default' : 'secondary'}>
                        {isVerified === 1 ? 'Verified' : 'Not Verified'}
                    </Badge>
                )
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "createdAt",
            header: "Created At",
            cell: ({ value }) => <div className="text-slate-600 text-sm">{value as string}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "actions" as keyof User,
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit((row as User).id)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete((row as User).id)}
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
                data={users}
                columns={columns}
                title="Users"
                onDownload={handleDownload}
                isDownloading={false}
                currentPage={1}
                totalPages={1}
                totalRecords={users.length}
                pageSize={10}
            />

            <EditUserDialog
                user={selectedUser}
                isOpen={isEditDialogOpen}
                onClose={handleEditDialogClose}
                onSuccess={handleEditSuccess}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone and all associated data will be permanently removed."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />
        </>
    )
}
