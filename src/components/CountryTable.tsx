"use client"

import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CountriesList } from "@/constants/country"

type CountryData = {
    id: string
    Country_Code_2?: string
    Country_Code_3?: string
    Country_Name?: string
    Country_Name_Full?: string
    Continent_Code_2?: string
    Continent_Name?: string
    Dial_Code: number
    Currency_Name?: string
    Capital?: string
}

export default function CountryTable() {
    const data: CountryData[] = CountriesList.map((country, index) => ({
        id: `CT${String(index + 1).padStart(4, "0")}`,
        ...country,
        Dial_Code: typeof country.Dial_Code === 'string' ? parseInt(country.Dial_Code) : (country.Dial_Code || 0),
    }))

    const columns: ColumnDef<CountryData>[] = [
        {
            id: "Country_Code_2",
            header: "Country Code 2",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-blue-100 text-blue-700 border-blue-200">
                    {value || '-'}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Country_Code_3",
            header: "Country Code 3",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-700 border-slate-200">
                    {value || '-'}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Country_Name",
            header: "Country Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value || '-'}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Country_Name_Full",
            header: "Country Name Full",
            cell: ({ value, density }) => (
                <div className={cn("text-slate-600 leading-relaxed", density === "comfortable" ? "whitespace-normal" : "")}>
                    {value || '-'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Continent_Code_2",
            header: "Continent Code 2",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-green-100 text-green-700 border-green-200">
                    {value || '-'}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Continent_Name",
            header: "Continent Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value || '-'}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Dial_Code",
            header: "Dial Code",
            cell: ({ value }) => (
                <div className="font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded text-sm">+{value}</div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Currency_Name",
            header: "Currency Name",
            cell: ({ value }) => <div className="text-slate-600">{value || '-'}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Capital",
            header: "Capital",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value || '-'}</div>,
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return <TableData data={data} columns={columns} title="Country Data" />
}
