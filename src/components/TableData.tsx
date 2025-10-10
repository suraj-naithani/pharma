import type React from "react"
import { useState, useMemo, useCallback } from "react"
import {
    Search,
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    Settings2,
    Maximize,
    Minimize,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    AlignJustify,
    Minus,
    List,
    Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type DensityType = "compact" | "default" | "comfortable"

export type ColumnDef<TData> = {
    id: keyof TData | "select"
    header: string | ((props: { table: any }) => React.ReactNode)
    cell: (props: { row: TData; value: any; density: DensityType }) => React.ReactNode
    enableSorting?: boolean
    enableHiding?: boolean
}

export interface ReusableDataTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData>[]
    title?: string
    onDownload?: (params?: any) => void
    isDownloading?: boolean
    currentPage?: number
    totalPages?: number
    totalRecords?: number
    onPageChange?: (page: number, pageSize?: number) => void
    isLoading?: boolean
    pageSize?: number
}

export default function TableData<TData extends Record<string, any>>({
    data,
    columns: propColumns,
    title = "Data Table",
    onDownload,
    isDownloading = false,
    currentPage = 1,
    totalPages = 1,
    totalRecords = 0,
    onPageChange,
    isLoading = false,
    pageSize: externalPageSize,
}: ReusableDataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [density, setDensity] = useState<DensityType>("default")
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)

    const [sorting, setSorting] = useState<Record<string, "asc" | "desc" | false>>({})
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const [internalPageSize, setInternalPageSize] = useState(10)
    const [internalCurrentPage, setInternalCurrentPage] = useState(1)

    // Use external values if provided, otherwise use internal
    const actualCurrentPage = onPageChange ? currentPage : internalCurrentPage
    const actualPageSize = externalPageSize !== undefined ? externalPageSize : internalPageSize
    const setCurrentPage = onPageChange ? onPageChange : setInternalCurrentPage

    const filteredData = useMemo(() => {
        if (!globalFilter) return data
        const lowerCaseFilter = globalFilter.toLowerCase()
        return data.filter((row) =>
            Object.values(row).some((value) => String(value).toLowerCase().includes(lowerCaseFilter)),
        )
    }, [data, globalFilter])

    const sortedData = useMemo(() => {
        if (Object.keys(sorting).length === 0) return filteredData

        const sortColumnId = Object.keys(sorting)[0]
        const sortDirection = sorting[sortColumnId]

        if (!sortDirection) return filteredData

        return [...filteredData].sort((a, b) => {
            const aValue = String(a[sortColumnId as keyof TData] || "").toLowerCase()
            const bValue = String(b[sortColumnId as keyof TData] || "").toLowerCase()

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
            return 0
        })
    }, [filteredData, sorting])

    // Use external pagination if onPageChange is provided, otherwise use internal pagination
    const paginatedData = useMemo(() => {
        if (onPageChange) {
            // External pagination - use data as is (already paginated from API)
            return sortedData
        } else {
            // Internal pagination - slice data locally
            const startIndex = (actualCurrentPage - 1) * actualPageSize
            const endIndex = startIndex + actualPageSize
            return sortedData.slice(startIndex, endIndex)
        }
    }, [sortedData, actualCurrentPage, actualPageSize, onPageChange])

    // Use external totalPages if provided, otherwise calculate from data
    const actualTotalPages = onPageChange ? totalPages : Math.ceil(sortedData.length / actualPageSize)

    const columns: ColumnDef<TData>[] = useMemo(
        () => [
            {
                id: "select",
                header: () => {
                    const getIsAllPageRowsSelected =
                        paginatedData.length > 0 && paginatedData.every((row) => rowSelection[row.id])
                    const getIsSomePageRowsSelected =
                        paginatedData.length > 0 && paginatedData.some((row) => rowSelection[row.id]) && !getIsAllPageRowsSelected

                    return (
                        <Checkbox
                            checked={getIsAllPageRowsSelected || (getIsSomePageRowsSelected && "indeterminate")}
                            onCheckedChange={(value) => {
                                const newSelection = { ...rowSelection }
                                if (value === true) {
                                    paginatedData.forEach((row) => {
                                        newSelection[row.id] = true
                                    })
                                } else {
                                    paginatedData.forEach((row) => {
                                        delete newSelection[row.id]
                                    })
                                }
                                setRowSelection(newSelection)
                            }}
                            aria-label="Select all rows"
                            className="h-5 w-5 rounded-md border-[#C7D2FE] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6] data-[state=indeterminate]:bg-[#3B82F6] data-[state=indeterminate]:border-[#3B82F6]"
                        />
                    )
                },
                cell: ({ row }) => (
                    <Checkbox
                        checked={!!rowSelection[row.id]}
                        onCheckedChange={(value) => {
                            setRowSelection((prev) => ({
                                ...prev,
                                [row.id]: !!value,
                            }))
                        }}
                        aria-label="Select row"
                        className="h-5 w-5 rounded-md border-[#C7D2FE] data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...propColumns,
        ],
        [paginatedData, rowSelection, propColumns],
    )

    const handleSort = useCallback((columnId: string) => {
        setSorting((prev) => {
            const currentSort = prev[columnId]
            if (currentSort === "asc") return { [columnId]: "desc" }
            if (currentSort === "desc") return {}
            return { [columnId]: "asc" }
        })
        if (onPageChange) {
            onPageChange(1)
        } else {
            setCurrentPage(1)
        }
    }, [])

    const handleColumnVisibilityChange = useCallback((columnId: string, isVisible: boolean) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: isVisible,
        }))
    }, [])

    const handleShowAllColumns = useCallback(() => {
        const newVisibility: Record<string, boolean> = {}
        columns.forEach((column) => {
            if (column.enableHiding !== false) {
                newVisibility[column.id as string] = true
            }
        })
        setColumnVisibility(newVisibility)
    }, [columns])

    const handleHideAllColumns = useCallback(() => {
        const newVisibility: Record<string, boolean> = {}
        columns.forEach((column) => {
            if (column.enableHiding !== false) {
                newVisibility[column.id as string] = false
            }
        })
        setColumnVisibility(newVisibility)
    }, [columns])

    const handleDensityToggle = () => {
        setDensity((prevDensity) => {
            if (prevDensity === "default") return "compact"
            if (prevDensity === "compact") return "comfortable"
            return "default"
        })
    }

    const DensityIcon = useMemo(() => {
        switch (density) {
            case "compact":
                return Minus
            case "comfortable":
                return List
            default:
                return AlignJustify
        }
    }, [density])

    const visibleColumns = useMemo(() => {
        return columns.filter((column) => {
            return columnVisibility[column.id as string] !== false
        })
    }, [columns, columnVisibility])

    return (
        <div
            className={`w-full space-y-6 p-6 bg-white rounded-xl border-2 border-gray-100 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-6 overflow-auto" : ""}`}
        >
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-[#1E293B]">
                        {title} <span className="text-[#64748B]">({data.length})</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2 w-full justify-start lg:w-auto">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B82F6]" />
                        <Input
                            placeholder="Search across all columns..."
                            value={globalFilter ?? ""}
                            onChange={(event) => {
                                setGlobalFilter(String(event.target.value))
                                if (onPageChange) {
                                    onPageChange(1)
                                } else {
                                    setCurrentPage(1)
                                }
                            }}
                            className="pl-10 h-9 border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20 rounded-lg bg-[#EEF2FF] w-full transition-colors duration-200"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="h-9 px-3 border-[#C7D2FE] hover:bg-[#EEF2FF] rounded-lg bg-white text-[#1E293B] transition-colors duration-200"
                        disabled={isDownloading || !onDownload}
                        onClick={() => onDownload && onDownload()}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu open={columnDropdownOpen} onOpenChange={setColumnDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9 px-3 border-[#C7D2FE] hover:bg-[#EEF2FF] rounded-lg bg-white text-[#1E293B] transition-colors duration-200">
                                <Settings2 className="h-4 w-4" />
                                <span className="sr-only">Columns</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[280px] p-0 bg-white border border-slate-200">
                            <div className="p-4 border-b border-slate-200">
                                <DropdownMenuLabel className="text-base font-semibold text-slate-900 px-0">
                                    Toggle Columns
                                </DropdownMenuLabel>
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleShowAllColumns}
                                        className="flex-1 h-8 text-xs border border-slate-200"
                                    >
                                        <Eye className="mr-1 h-3 w-3" />
                                        Show All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleHideAllColumns}
                                        className="flex-1 h-8 text-xs border border-slate-200"
                                    >
                                        <EyeOff className="mr-1 h-3 w-3" />
                                        Hide All
                                    </Button>
                                </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-2">
                                {columns
                                    .filter((column) => column.enableHiding !== false)
                                    .map((column) => (
                                        <DropdownMenuItem
                                            key={column.id as string}
                                            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-slate-50"
                                            onSelect={(e: Event) => e.preventDefault()} // Prevent closing on select
                                        >
                                            <label
                                                htmlFor={`checkbox-${column.id as string}`}
                                                className="flex items-center cursor-pointer flex-1"
                                            >
                                                <Checkbox
                                                    id={`checkbox-${column.id as string}`}
                                                    checked={columnVisibility[column.id as string] !== false} // Default to true if not set
                                                    onCheckedChange={(value) => handleColumnVisibilityChange(column.id as string, !!value)}
                                                    className="h-4 w-4 rounded border-slate-300
                                                                    data-[state=checked]:bg-black data-[state=checked]:text-white
                                                                    data-[state=indeterminate]:bg-black data-[state=indeterminate]:text-white"
                                                />
                                                <span className="ml-2 font-medium capitalize">
                                                    {String(column.id)
                                                        .replace(/([A-Z])/g, " $1")
                                                        .trim()}
                                                </span>
                                            </label>
                                        </DropdownMenuItem>
                                    ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        size="default"
                        onClick={handleDensityToggle}
                        className="h-9 px-3 border-[#C7D2FE] hover:bg-[#EEF2FF] rounded-lg bg-white text-[#1E293B] transition-colors duration-200"
                    >
                        <DensityIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle density</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="default"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="h-9 px-3 border-[#C7D2FE] hover:bg-[#EEF2FF] rounded-lg bg-white text-[#1E293B] transition-colors duration-200"
                    >
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                {visibleColumns.map((column) => {
                                    const isSorted = sorting[column.id as string]
                                    return (
                                        <TableHead
                                            key={column.id as string}
                                            className={cn(
                                                "whitespace-nowrap font-semibold text-[#1E293B] py-3",
                                                column.id === "productDescription" && density === "comfortable" && "w-1/4",
                                            )}
                                        >
                                            <div
                                                className={`flex items-center space-x-2 ${column.enableSorting ? "cursor-pointer select-none hover:text-[#3B82F6]" : ""
                                                    }`}
                                                onClick={() => column.enableSorting && handleSort(column.id as string)}
                                            >
                                                <span>
                                                    {typeof column.header === "function" ? column.header({ table: {} }) : column.header}
                                                </span>
                                                {column.enableSorting && (
                                                    <div className="flex flex-col">
                                                        {isSorted === "desc" ? (
                                                            <ChevronDown className="h-4 w-4 text-[#3B82F6]" />
                                                        ) : isSorted === "asc" ? (
                                                            <ChevronUp className="h-4 w-4 text-[#3B82F6]" />
                                                        ) : (
                                                            <ChevronsUpDown className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData?.length ? (
                                paginatedData.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={rowSelection[row.id] && "selected"}
                                        className={cn(
                                            "border-b border-slate-100 last:border-b-0 transition-all duration-300 ease-in-out",
                                            rowSelection[row.id] ? "bg-[#EEF2FF] hover:bg-[#EEF2FF]" : "bg-white hover:bg-[#F8FAFC]",
                                            density === "compact" && "h-8",
                                            density === "default" && "h-12",
                                            density === "comfortable" && "h-16",
                                        )}
                                    >
                                        {visibleColumns.map((column) => (
                                            <TableCell
                                                key={column.id as string}
                                                className={cn(
                                                    "align-top text-sm transition-all duration-300 ease-in-out",
                                                    density === "compact" && "py-1",
                                                    density === "default" && "py-3",
                                                    density === "comfortable" && "py-4",
                                                    column.id === "productDescription" && density === "compact"
                                                        ? "whitespace-nowrap overflow-hidden text-ellipsis"
                                                        : "",
                                                    column.id === "productDescription" &&
                                                    density === "comfortable" &&
                                                    "w-1/4 break-words overflow-hidden",
                                                    column.id === "select" && rowSelection[row.id] ? "border-l-4 border-[#3B82F6] pl-3" : "",
                                                )}
                                            >
                                                {column.cell({ row, value: row[column.id as keyof TData], density })}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} className="h-32 text-center">
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="text-slate-400 text-lg">No results found</div>
                                            <div className="text-slate-500 text-sm">Try adjusting your search criteria</div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-end text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page:</p>
                    <Select
                        value={`${actualPageSize}`}
                        onValueChange={(value) => {
                            const newPageSize = Number(value)
                            if (onPageChange) {
                                // Calculate which page would show similar data
                                const currentRecord = (actualCurrentPage - 1) * actualPageSize + 1
                                const newPage = Math.max(1, Math.ceil(currentRecord / newPageSize))
                                onPageChange(newPage, newPageSize)
                            } else {
                                setInternalPageSize(newPageSize)
                                // Calculate new page for internal pagination too
                                const currentRecord = (actualCurrentPage - 1) * actualPageSize + 1
                                const newPage = Math.max(1, Math.ceil(currentRecord / newPageSize))
                                setCurrentPage(newPage)
                            }
                        }}
                    >
                        <SelectTrigger className="h-9 w-[70px] rounded-lg bg-white border border-[#C7D2FE]">
                            <SelectValue placeholder={actualPageSize} />
                        </SelectTrigger>
                        <SelectContent side="top" className="bg-white border border-[#C7D2FE]">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="text-sm text-slate-600">
                        {onPageChange ? (
                            totalRecords > 0
                                ? `${(actualCurrentPage - 1) * actualPageSize + 1}-${Math.min(actualCurrentPage * actualPageSize, totalRecords)} of ${totalRecords}`
                                : "0-0 of 0"
                        ) : (
                            sortedData.length > 0
                                ? `${(actualCurrentPage - 1) * actualPageSize + 1}-${Math.min(actualCurrentPage * actualPageSize, sortedData.length)} of ${sortedData.length}`
                                : "0-0 of 0"
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            className="h-9 w-9 p-0 rounded-lg border-[#C7D2FE] bg-white hover:bg-[#F8FAFC] text-[#1E293B]"
                            onClick={() => {
                                if (onPageChange) {
                                    onPageChange(Math.max(1, actualCurrentPage - 1))
                                } else {
                                    setCurrentPage(Math.max(1, actualCurrentPage - 1))
                                }
                            }}
                            disabled={actualCurrentPage === 1 || isLoading}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 w-9 p-0 rounded-lg border-[#C7D2FE] bg-white hover:bg-[#F8FAFC] text-[#1E293B]"
                            onClick={() => {
                                if (onPageChange) {
                                    onPageChange(Math.min(actualTotalPages, actualCurrentPage + 1))
                                } else {
                                    setCurrentPage(Math.min(actualTotalPages, actualCurrentPage + 1))
                                }
                            }}
                            disabled={actualCurrentPage === actualTotalPages || actualTotalPages === 0 || isLoading}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
