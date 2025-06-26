"use client"

import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PortData = {
    id: string
    portName: string
    portCode: string
    mode: string
    indianState: string
}

const generatePortData = (count: number): PortData[] => {
    const ports = [
        {
            portName: "AACHIVS SEZ/NOIDA",
            portCode: "INDEA6",
            mode: "ICD",
            indianState: "UTTAR PRADESH",
        },
        {
            portName: "AAL-SEZ/Visakhapatnam",
            portCode: "INNRP6",
            mode: "ICD",
            indianState: "Andhra Pradesh",
        },
        {
            portName: "AA-SEZ AHMEDABAD",
            portCode: "INAPI6",
            mode: "ICD",
            indianState: "Gujarat",
        },
        {
            portName: "Achra",
            portCode: "INACH1",
            mode: "SEA",
            indianState: "Maharashtra",
        },
        {
            portName: "Adalaj",
            portCode: "INADA6",
            mode: "ICD",
            indianState: "Gujarat",
        },
        {
            portName: "AEPL SEZ/GURGAON",
            portCode: "INGGE6",
            mode: "ICD",
            indianState: "HARYANA",
        },
        {
            portName: "Agartala",
            portCode: "INAGT8",
            mode: "ROAD",
            indianState: "Tripura",
        },
        {
            portName: "Agatti Island",
            portCode: "INAGI1",
            mode: "SEA",
            indianState: "Lakshadweep",
        },
        {
            portName: "Agra",
            portCode: "INAGR4",
            mode: "AIR",
            indianState: "Uttar Pradesh",
        },
        {
            portName: "Agra",
            portCode: "INBLJ6",
            mode: "ICD",
            indianState: "Uttar Pradesh",
        },
    ]

    return Array.from({ length: Math.min(count, ports.length) }, (_, i) => ({
        id: `PT${String(i + 1).padStart(4, "0")}`,
        ...ports[i],
    }))
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
    const data = generatePortData(10)

    const columns: ColumnDef<PortData>[] = [
        {
            id: "portName",
            header: "Port Name",
            cell: ({ value, density }) => (
                <div className={cn("font-medium text-slate-800", density === "comfortable" ? "whitespace-normal" : "")}>
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
                <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-700 border-slate-200">
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
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return <TableData data={data} columns={columns} title="Port Data" />
}
