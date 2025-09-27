import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"

type SubscriptionData = {
    id: string
    clientName: string
    contactPerson: string
    email: string
    subscriptionType: string
    productLimit: string
    duration: string
    cost: string
    status: string
}

// Sample subscription data - replace with actual API data
const sampleSubscriptions: SubscriptionData[] = [
    {
        id: "1",
        clientName: "ABC Corporation",
        contactPerson: "John Doe",
        email: "john.doe@abccorp.com",
        subscriptionType: "Premium",
        productLimit: "10,000",
        duration: "12 months",
        cost: "$2,999",
        status: "Active"
    },
    {
        id: "2",
        clientName: "XYZ Industries",
        contactPerson: "Jane Smith",
        email: "jane.smith@xyzind.com",
        subscriptionType: "Basic",
        productLimit: "5,000",
        duration: "6 months",
        cost: "$1,499",
        status: "Active"
    },
    {
        id: "3",
        clientName: "DEF Enterprises",
        contactPerson: "Bob Johnson",
        email: "bob.johnson@defent.com",
        subscriptionType: "Enterprise",
        productLimit: "Unlimited",
        duration: "24 months",
        cost: "$9,999",
        status: "Expired"
    },
    {
        id: "4",
        clientName: "GHI Solutions",
        contactPerson: "Alice Brown",
        email: "alice.brown@ghisol.com",
        subscriptionType: "Premium",
        productLimit: "15,000",
        duration: "12 months",
        cost: "$3,499",
        status: "Active"
    },
    {
        id: "5",
        clientName: "JKL Enterprises",
        contactPerson: "Charlie Wilson",
        email: "charlie.wilson@jklent.com",
        subscriptionType: "Basic",
        productLimit: "3,000",
        duration: "3 months",
        cost: "$799",
        status: "Pending"
    }
]

export default function SubscriptionsTable() {
    const handleDownload = () => {
        // Implement download functionality
        console.log("Downloading subscriptions data...")
    }

    const columns: ColumnDef<SubscriptionData>[] = [
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
            id: "subscriptionType",
            header: "Subscription Type",
            cell: ({ value }) => (
                <Badge variant={
                    value === 'Enterprise' ? 'default' :
                        value === 'Premium' ? 'secondary' :
                            'outline'
                }>
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "productLimit",
            header: "Product Limit",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "duration",
            header: "Duration",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "cost",
            header: "Cost",
            cell: ({ value }) => <div className="font-semibold text-green-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "status",
            header: "Status",
            cell: ({ value }) => (
                <Badge variant={
                    value === 'Active' ? 'default' :
                        value === 'Expired' ? 'destructive' :
                            'secondary'
                }>
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return (
        <TableData
            data={sampleSubscriptions}
            columns={columns}
            title="Subscriptions"
            onDownload={handleDownload}
            isDownloading={false}
            currentPage={1}
            totalPages={1}
            totalRecords={sampleSubscriptions.length}
            pageSize={10}
        />
    )
}
