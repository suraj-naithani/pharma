import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetSubscriptionsQuery, useDeleteSubscriptionMutation } from "@/redux/api/adminApi"
import { useDispatch, useSelector } from "react-redux"
import { setSubscriptions, setLoading, setError } from "@/redux/reducers/subscriptionReducer"
import type { RootState } from "@/redux/store"
import type { Subscription } from "@/types/subscription"
import { useEffect, useState } from "react"
import { EditSubscriptionDialog, ConfirmDialog } from "./dialog"
import Loading from "./ui/loading"

// Using the Subscription type from types/subscription.ts

export default function SubscriptionsTable() {
    const dispatch = useDispatch();
    const { subscriptions, isLoading, error } = useSelector((state: RootState) => state.subscription);

    // State for edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

    // State for delete confirmation dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [subscriptionToDelete, setSubscriptionToDelete] = useState<number | null>(null);

    // RTK Query call to fetch subscriptions
    const { data, error: apiError, isLoading: apiLoading, isError } = useGetSubscriptionsQuery();
    const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();

    // Sync RTK Query data with Redux state
    useEffect(() => {
        dispatch(setLoading(apiLoading));

        if (isError && apiError) {
            dispatch(setError(apiError.toString()));
        } else if (data?.data) {
            dispatch(setSubscriptions(data.data));
        }
    }, [data, apiError, apiLoading, isError, dispatch]);

    const handleEdit = (subscriptionId: number) => {
        const subscription = subscriptions.find(sub => sub.id === subscriptionId);
        if (subscription) {
            setSelectedSubscription(subscription);
            setIsEditDialogOpen(true);
        }
    };

    const handleDelete = (subscriptionId: number) => {
        setSubscriptionToDelete(subscriptionId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (subscriptionToDelete) {
            try {
                await deleteSubscription(subscriptionToDelete).unwrap();
                console.log("Subscription deleted successfully");
                setIsDeleteDialogOpen(false);
                setSubscriptionToDelete(null);
            } catch (error) {
                console.error("Failed to delete subscription:", error);
                // You might want to show a toast notification here
            }
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setSubscriptionToDelete(null);
    };

    const handleDownload = () => {
        console.log("Downloading subscriptions data...");
    };

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false);
        setSelectedSubscription(null);
    };

    const handleEditSuccess = () => {
        // The RTK Query will automatically refetch data due to invalidatesTags
        console.log("Subscription updated successfully");
    };

    const columns: ColumnDef<Subscription>[] = [
        {
            id: "clientName",
            header: "Client Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
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
            id: "email",
            header: "Email",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "productlimit",
            header: "Product Limit",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "subscribedDurationDownload",
            header: "Duration (months)",
            cell: ({ value }) => <div className="text-slate-600">{value || 'N/A'}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "subscriptionCost",
            header: "Cost",
            cell: ({ value }) => <div className="font-semibold text-green-600">${value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "status",
            header: "Status",
            cell: ({ value }) => (
                <Badge variant={
                    value === 'active' ? 'default' :
                        value === 'expired' ? 'destructive' :
                            'secondary'
                }>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "paymentMethod",
            header: "Payment Method",
            cell: ({ value }) => <div className="text-slate-600">{value || 'N/A'}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "actions" as keyof Subscription,
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit((row as Subscription).id)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete((row as Subscription).id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ]

    if (isLoading) {
        return <Loading className="h-64" />;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
    }

    return (
        <>
            <TableData
                data={subscriptions}
                columns={columns}
                title="Subscriptions"
                onDownload={handleDownload}
                isDownloading={false}
                currentPage={1}
                totalPages={1}
                totalRecords={subscriptions.length}
                pageSize={10}
            />

            <EditSubscriptionDialog
                subscription={selectedSubscription}
                isOpen={isEditDialogOpen}
                onClose={handleEditDialogClose}
                onSuccess={handleEditSuccess}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Subscription"
                description="Are you sure you want to delete this subscription? This action cannot be undone and all associated data will be permanently removed."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                isLoading={isDeleting}
            />
        </>
    )
}
