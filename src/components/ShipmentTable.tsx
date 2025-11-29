"use client"

import TableData, { type ColumnDef } from "./TableData"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { useDownloadDataAsCSVMutation, useLazyGetShipmentTableQuery } from "@/redux/api/dashboardAPi"
import { convertFiltersToUrlParams, transformSearchTypeForPayload } from "@/utils/helper"
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
    portOfDeparture: string
    currency: string
    supplier: string
    buyer: string
    buyerCountry: string
    standardUnitRateUSD?: number
    unitPrice?: number
}

export default function ShipmentDTable() {
    const shipmentState = useSelector((state: RootState) => state.shipmentTable)
    const filterState = useSelector((state: RootState) => state.filter)
    const [downloadDataAsCSV, { isLoading: isDownloading }] = useDownloadDataAsCSVMutation()
    const [getShipmentTable] = useLazyGetShipmentTableQuery()

    // Local state for pagination data
    const [paginationData, setPaginationData] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [isPageChanging, setIsPageChanging] = useState(false)

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
        // Prevent multiple calls if already changing page
        if (isPageChanging) {
            return
        }

        try {
            setIsPageChanging(true)
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
                searchType: transformSearchTypeForPayload(filterState.selectedSearchType, filterState.selectedToggle),
                searchValue: Array.isArray(filterState.selectedSearchItems)
                    ? filterState.selectedSearchItems.map(item => item.replace(/'/g, "''")) // Escape single quotes
                    : (filterState.selectedSearchItems as string).replace(/'/g, "''"),
                informationOf: filterState.selectedToggle,
                page: page,
                limit: currentPageSize,
                ...(filterState.selectedChapters && filterState.selectedChapters.length > 0 && { chapter: filterState.selectedChapters }),
                ...convertFiltersToUrlParams(filterState.filters || {}),
            }

            const result = await getShipmentTable(params).unwrap()

            setPaginationData(result.data || [])
            setTotalPages(result.totalPages || 1)
            setTotalRecords(result.totalRecords || 0)
        } catch (error) {
            console.error('Pagination failed:', error)
        } finally {
            setIsPageChanging(false)
        }
    }

    const handleDownload = async (downloadParams?: unknown) => {
        try {
            // Use current filter state for download parameters
            const params = downloadParams || {
                startDate: moment(filterState.dateRange.from).format("YYYY-MM-DD"),
                endDate: moment(filterState.dateRange.to).format("YYYY-MM-DD"),
                searchType: transformSearchTypeForPayload(filterState.selectedSearchType, filterState.selectedToggle),
                searchValue: Array.isArray(filterState.selectedSearchItems)
                    ? filterState.selectedSearchItems.join(',')
                    : filterState.selectedSearchItems,
                informationOf: filterState.selectedToggle,
                ...(filterState.selectedChapters && filterState.selectedChapters.length > 0 && { chapter: filterState.selectedChapters }),
                // Add filters
                ...convertFiltersToUrlParams(filterState.filters || {}),
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
            id: "portOfOrigin",
            header: "Indian Port",
            cell: ({ row }) => {
                const portValue = filterState.selectedToggle === "export"
                    ? row.portOfOrigin
                    : row.portOfDeparture;
                return <div className="font-medium text-slate-800">{portValue}</div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "shippingBillDate",
            header: "Date of Shipment",
            cell: ({ value }) => <div className="font-medium text-[#1E293B]">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "H_S_Code",
            header: "HS Code",
            cell: ({ value }) => (
                <Badge variant="outline" className="font-mono text-xs bg-[#EEF2FF] text-[#1E293B] border-[#C7D2FE]">
                    {value}
                </Badge>
            ),
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
            header: "Quantity Units",
            cell: ({ value }) => <div className="text-[#1E293B]">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "unitPrice",
            header: "Unit Price",
            cell: ({ row }) => {
                const unitPrice = row.standardUnitRateUSD || row.unitPrice;
                return <div className="font-medium text-slate-800">{unitPrice ? unitPrice.toFixed(2) : '-'}</div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "currency",
            header: "Currency",
            cell: ({ value }) => <div className="font-medium text-[#1E293B]">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "supplier",
            header: "Indian Company",
            cell: ({ row }) => {
                const companyValue = filterState.selectedToggle === "export"
                    ? row.supplier
                    : row.buyer;
                return <div className="text-slate-600">{companyValue}</div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "buyer",
            header: "Foreign Company",
            cell: ({ row }) => {
                const companyValue = filterState.selectedToggle === "export"
                    ? row.buyer
                    : row.supplier;
                return <div className="text-slate-600">{companyValue}</div>;
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "buyerCountry",
            header: "Foreign Country",
            cell: ({ value }) => <div className="font-medium text-[#1E293B]">{value}</div>,
            enableSorting: true,
            enableHiding: true,
        },
    ]

    return (
        data && data.length > 0 &&
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
            isLoading={isPageChanging}
            pageSize={pageSize}
        />
    )
}
