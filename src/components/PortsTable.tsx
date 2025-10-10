"use client"

import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { indianPorts } from "@/constants/indianPort"
import { cn } from "@/lib/utils"

type PortData = {
    id: string
    portName: string
    portCode: string
    mode: string
    indianState: string
}

const getModeColor = (mode: string) => {
    switch (mode) {
        case "ICD":
            return "bg-blue-100 text-blue-700 border-blue-200"
        case "SEA":
            return "bg-cyan-100 text-cyan-700 border-cyan-200"
        case "AIR":
            return "bg-purple-100 text-purple-700 border-purple-200"
        case "ROAD":
            return "bg-green-100 text-green-700 border-green-200"
        default:
            return "bg-slate-100 text-slate-700 border-slate-200"
    }
}

export default function PortsTable() {
    const data = indianPorts.map((port, index) => ({
        id: `PT${String(index + 1).padStart(4, "0")}`,
        ...port,
    }))

    const columns: ColumnDef<PortData>[] = [
        {
            id: "portName",
            header: "Port Name",
            cell: ({ value, density }) => (
                <div className={cn("font-medium text-[#1E293B]", density === "comfortable" ? "whitespace-normal" : "")}>
                    {value}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "portCode",
            header: "Port Code",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-[#EEF2FF] text-[#1E293B] border-[#C7D2FE]">
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "mode",
            header: "Mode",
            cell: ({ value }) => (
                <Badge variant="outline" className={cn("font-medium text-xs", getModeColor(value))}>
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "indianState",
            header: "Indian State",
            cell: ({ value }) => <div className="font-medium text-[#1E293B]">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return <TableData data={data} columns={columns} title="Port Data" />
}
