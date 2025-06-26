"use client"

import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type CountryData = {
    id: string
    countryCode2: string
    countryCode3: string
    countryName: string
    countryNameFull: string
    continentCode2: string
    continentName: string
    dialCode: string
    currencyName: string
    capital: string
}

const generateCountryData = (count: number): CountryData[] => {
    const countries = [
        {
            countryCode2: "AF",
            countryCode3: "AFG",
            countryName: "Afghanistan",
            countryNameFull: "Islamic Republic of Afghanistan",
            continentCode2: "AS",
            continentName: "Asia",
            dialCode: "93",
            currencyName: "Afghani",
            capital: "Kabul",
        },
        {
            countryCode2: "AL",
            countryCode3: "ALB",
            countryName: "Albania",
            countryNameFull: "Republic of Albania",
            continentCode2: "EU",
            continentName: "Europe",
            dialCode: "355",
            currencyName: "Lek",
            capital: "Tirana",
        },
        {
            countryCode2: "DZ",
            countryCode3: "DZA",
            countryName: "Algeria",
            countryNameFull: "People's Democratic Republic of Algeria",
            continentCode2: "AF",
            continentName: "Africa",
            dialCode: "213",
            currencyName: "Algerian Dinar",
            capital: "Algiers",
        },
        {
            countryCode2: "AD",
            countryCode3: "AND",
            countryName: "Andorra",
            countryNameFull: "Principality of Andorra",
            continentCode2: "EU",
            continentName: "Europe",
            dialCode: "376",
            currencyName: "Euro",
            capital: "Andorra la Vella",
        },
        {
            countryCode2: "AO",
            countryCode3: "AGO",
            countryName: "Angola",
            countryNameFull: "Republic of Angola",
            continentCode2: "AF",
            continentName: "Africa",
            dialCode: "244",
            currencyName: "Kwanza",
            capital: "Luanda",
        },
    ]

    return Array.from({ length: Math.min(count, countries.length) }, (_, i) => ({
        id: `CT${String(i + 1).padStart(4, "0")}`,
        ...countries[i],
    }))
}

export default function CountryTable() {
    const data = generateCountryData(5)

    const columns: ColumnDef<CountryData>[] = [
        {
            id: "countryCode2",
            header: "Country Code 2",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-blue-100 text-blue-700 border-blue-200">
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "countryCode3",
            header: "Country Code 3",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-slate-100 text-slate-700 border-slate-200">
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "countryName",
            header: "Country Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "countryNameFull",
            header: "Country Name Full",
            cell: ({ value, density }) => (
                <div className={cn("text-slate-600 leading-relaxed", density === "comfortable" ? "whitespace-normal" : "")}>
                    {value}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "continentCode2",
            header: "Continent Code 2",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-green-100 text-green-700 border-green-200">
                    {value}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "continentName",
            header: "Continent Name",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "dialCode",
            header: "Dial Code",
            cell: ({ value }) => (
                <div className="font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded text-sm">+{value}</div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "currencyName",
            header: "Currency Name",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "capital",
            header: "Capital",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return <TableData data={data} columns={columns} title="Country Data" />
}
