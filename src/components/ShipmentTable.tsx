"use client"

import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TradeData = {
    id: string
    billDate: string
    hsCode: string
    product: string
    productDescription: string
    quantity: number
    quantityUnit: string
    indianPorts: string
    currency: string
    indianCompany: string
    foreignCompany: string
    foreignCountry: string
}

const generateMockData = (count: number): TradeData[] => {
    const products = ["Electronics", "Textiles", "Machinery", "Chemicals", "Food Products"]
    const units = ["KG", "PCS", "MT", "LTR", "SET"]
    const ports = ["Mumbai", "Chennai", "Kolkata", "Cochin", "Kandla"]
    const currencies = ["USD", "EUR", "GBP", "JPY", "CNY"]
    const countries = ["USA", "Germany", "China", "Japan", "UK"]

    const longDescriptions = [
        "High-quality industrial grade electronic components designed for automotive applications with advanced safety features and durability testing",
        "Premium cotton textiles manufactured using sustainable processes with eco-friendly dyes and advanced weaving techniques for superior quality",
        "Heavy-duty machinery parts engineered for industrial manufacturing with precision tolerances and extended operational life",
        "Specialized chemical compounds formulated for pharmaceutical applications meeting international quality standards and regulatory requirements",
        "Organic food products processed using traditional methods while maintaining nutritional value and natural flavor profiles",
    ]

    return Array.from({ length: count }, (_, i) => ({
        id: `TD${String(i + 1).padStart(4, "0")}`,
        billDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        hsCode: `${Math.floor(Math.random() * 9999)
            .toString()
            .padStart(4, "0")}.${Math.floor(Math.random() * 99)
                .toString()
                .padStart(2, "0")}`,
        product: products[Math.floor(Math.random() * products.length)],
        productDescription: longDescriptions[Math.floor(Math.random() * longDescriptions.length)],
        quantity: Math.floor(Math.random() * 10000) + 1,
        quantityUnit: units[Math.floor(Math.random() * units.length)],
        indianPorts: ports[Math.floor(Math.random() * ports.length)],
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        indianCompany: `Indian Manufacturing Corp ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} Ltd`,
        foreignCompany: `International Trading Co ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} Inc`,
        foreignCountry: countries[Math.floor(Math.random() * countries.length)],
    }))
}

export default function ShipmentDTable() {
    const data = generateMockData(5)

    const columns: ColumnDef<TradeData>[] = [
        {
            id: "billDate",
            header: "S.Bill_Date",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "hsCode",
            header: "HS Code",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-700 border-slate-200">
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "product",
            header: "Product",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "productDescription",
            header: "Product Description",
            cell: ({ value, density }) => (
                <div className={cn("text-slate-600 leading-relaxed", density === "comfortable" ? "whitespace-normal" : "")}>
                    {value}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "quantity",
            header: "Quantity",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value.toLocaleString()}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "quantityUnit",
            header: "Quantity Unit",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "indianPorts",
            header: "Indian Ports",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "currency",
            header: "Currency",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "indianCompany",
            header: "Indian Company",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "foreignCompany",
            header: "Foreign Company",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "foreignCountry",
            header: "Foreign Country",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return <TableData data={data} columns={columns} title="Trade Chart" />
}
