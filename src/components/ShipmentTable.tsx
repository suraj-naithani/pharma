"use client"

import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { useDownloadDataAsCSVMutation, useLazyGetShipmentTableQuery } from "@/redux/api/dashboardAPi"
import moment from "moment"
import { useState, useEffect } from "react"

type TradeData = {
    id: string
    shippingBillDate: string
    H_S_Code: string
    productName: string
    productDescription: string
    quantity: number
    quantityUnit: string
    portOfOrigin: string
    currency: string
    supplier: string
    buyer: string
    buyerCountry: string
}

export default function ShipmentDTable() {
    const shipmentState = useSelector((state: RootState) => state.shipmentTable)
    const filterState = useSelector((state: RootState) => state.filter)
    const [downloadDataAsCSV, { isLoading: isDownloading }] = useDownloadDataAsCSVMutation()
    const [getShipmentTable, { isLoading: isPaginationLoading }] = useLazyGetShipmentTableQuery()

    // Local state for pagination data
    const [paginationData, setPaginationData] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Use redux data on initial load, pagination data afterwards
    const data = isInitialLoad ? shipmentState.data : paginationData

    // Initialize pagination data from redux when it changes
    useEffect(() => {
        if (shipmentState.data.length > 0 && isInitialLoad) {
            setCurrentPage(shipmentState.page || 1)
            setTotalRecords(parseInt(shipmentState.totalRecords || '0'))
            setTotalPages(shipmentState.totalPages || 1)
        }
    }, [shipmentState, isInitialLoad])

    const handlePageChange = async (page: number, newPageSize?: number) => {
        try {
            setIsInitialLoad(false)

            // Update page size if provided
            const currentPageSize = newPageSize || pageSize
            if (newPageSize) {
                setPageSize(newPageSize)
            }
            setCurrentPage(page)

            const params = {
                startDate: moment(filterState.dateRange.from).format("YYYY-MM-DD"),
                endDate: moment(filterState.dateRange.to).format("YYYY-MM-DD"),
                searchType: filterState.selectedSearchType,
                searchValue: Array.isArray(filterState.selectedSearchItems)
                    ? filterState.selectedSearchItems.map(item => item.replace(/'/g, "''")) // Escape single quotes
                    : (filterState.selectedSearchItems as string).replace(/'/g, "''"),
                informationOf: filterState.selectedToggle,
                page: page,
                limit: currentPageSize,
                filters: filterState.filters,
            }

            const result = await getShipmentTable(params).unwrap()

            setPaginationData(result.data || [])
            setTotalPages(result.totalPages || 1)
            setTotalRecords(result.totalRecords || 0)
        } catch (error) {
            console.error('Pagination failed:', error)
        }
    }

    const handleDownload = async (downloadParams?: any) => {
        try {
            // Use current filter state for download parameters
            const params = downloadParams || {
                startDate: moment(filterState.dateRange.from).format("YYYY-MM-DD"),
                endDate: moment(filterState.dateRange.to).format("YYYY-MM-DD"),
                searchType: filterState.selectedSearchType,
                searchValue: Array.isArray(filterState.selectedSearchItems)
                    ? filterState.selectedSearchItems.join(',')
                    : filterState.selectedSearchItems,
                informationOf: filterState.selectedToggle,
                // Add filters
                ...Object.keys(filterState.filters || {}).reduce((acc, key) => {
                    const filterValues = filterState.filters?.[key];
                    if (filterValues && filterValues.length > 0) {
                        acc[`filters[${key}]`] = filterValues.join(',');
                    }
                    return acc;
                }, {} as Record<string, string>)
            }

            const result = await downloadDataAsCSV(params).unwrap()

            // Create download link
            const url = window.URL.createObjectURL(result.blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', result.filename)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

        } catch (error) {
            console.error('Download failed:', error)
            // You can add toast notification here
        }
    }

    const columns: ColumnDef<TradeData>[] = [
        {
            id: "shippingBillDate",
            header: "S.Bill_Date",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "H_S_Code",
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
            id: "productName",
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
            id: "portOfOrigin",
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
            id: "supplier",
            header: "Indian Company",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "buyer",
            header: "Foreign Company",
            cell: ({ value }) => <div className="text-slate-600">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "buyerCountry",
            header: "Foreign Country",
            cell: ({ value }) => <div className="font-medium text-slate-800">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return (
        <TableData
            data={data}
            columns={columns}
            title="Trade Chart"
            onDownload={handleDownload}
            isDownloading={isDownloading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            isLoading={isPaginationLoading}
            pageSize={pageSize}
        />
    )
}
