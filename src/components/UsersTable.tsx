import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type UserData = {
    id: string
    name: string
    email: string
    role: string
    partyName: string
    mobileNumber: string
}

// Sample user data - replace with actual API data
const sampleUsers: UserData[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        partyName: "ABC Corp",
        mobileNumber: "+1 234 567 8900"
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "User",
        partyName: "XYZ Ltd",
        mobileNumber: "+1 234 567 8901"
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "User",
        partyName: "DEF Inc",
        mobileNumber: "+1 234 567 8902"
    },
    {
        id: "4",
        name: "Alice Brown",
        email: "alice.brown@example.com",
        role: "Manager",
        partyName: "GHI Solutions",
        mobileNumber: "+1 234 567 8903"
    },
    {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie.wilson@example.com",
        role: "User",
        partyName: "JKL Enterprises",
        mobileNumber: "+1 234 567 8904"
    }
]

export default function UsersTable() {
    const handleDownload = () => {
        // Implement download functionality
        console.log("Downloading users data...")
    }

    const handleEdit = (userId: string) => {
        // Implement edit functionality
        console.log("Editing user:", userId)
    }

    const handleDelete = (userId: string) => {
        // Implement delete functionality
        console.log("Deleting user:", userId)
    }

    const columns: ColumnDef<UserData>[] = [
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
            cell: ({ value }) => (
                <Badge variant={value === 'Admin' ? 'default' : value === 'Manager' ? 'secondary' : 'outline'}>
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "partyName",
            header: "Party Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "mobileNumber",
            header: "Mobile Number",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "select" as keyof UserData,
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(row.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(row.id)}
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
        <TableData
            data={sampleUsers}
            columns={columns}
            title="Users"
            onDownload={handleDownload}
            isDownloading={false}
            currentPage={1}
            totalPages={1}
            totalRecords={sampleUsers.length}
            pageSize={10}
        />
    )
}
