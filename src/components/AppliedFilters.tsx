import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLazyGetFilterValuesQuery, useLazyGetSummaryStatsQuery, useLazyGetAllTopMetricsQuery, useLazyGetShipmentTableQuery } from "@/redux/api/dashboardAPi";
import { convertFiltersToUrlParams } from "@/utils/helper";
import {
    setFilterData,
    setSummaryStats,
    setTopBuyersByQuantity,
    setTopBuyersByValue,
    setTopCountryByQuantity,
    setTopCountryByValue,
    setTopHSCodeByQuantity,
    setTopHSCodeByValue,
    setTopIndianPortByQuantity,
    setTopIndianPortByValue,
    setTopSuppliersByQuantity,
    setTopSuppliersByValue,
    setTopYearsByQuantity,
    setTopYearsByValue,
} from "@/redux/reducers/dashboardReducer";
import {
    setFilterValues
} from "@/redux/reducers/filterReducer";
import { setShipmentTable } from "@/redux/reducers/shipmentReducer";
import type { RootState } from "@/redux/store";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function AppliedFilters() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const filterState = useSelector((state: RootState) => state.filter);
    const dashboardData = useSelector((state: RootState) => state.dashboard);
    const filterOptions = (dashboardData?.filter ?? {}) as { [key: string]: (string | number)[] };
    const dispatch = useDispatch();

    const [triggerSummaryStats] = useLazyGetSummaryStatsQuery();
    const [triggerAllTopMetrics] = useLazyGetAllTopMetricsQuery();
    const [triggerFilterValues] = useLazyGetFilterValuesQuery();
    const [triggerShipmentTable] = useLazyGetShipmentTableQuery();

    // Get grouped filters by category
    const getGroupedFilters = () => {
        const groupedFilters: Array<{
            category: string;
            values: Array<{
                value: string;
                onRemove: () => void;
            }>;
        }> = [];

        // Only show additional filters from filterState.filters (FilterSidebar filters)
        if (filterState.filters) {
            Object.entries(filterState.filters).forEach(([category, values]) => {
                if (Array.isArray(values) && values.length > 0) {
                    // Get available options for this category from dashboard data
                    const availableOptions = filterOptions[category] || [];
                    const availableOptionsStrings = availableOptions.map(String);

                    // Filter out empty or null values and only show values that are actually available
                    const validValues = values.filter(value =>
                        value &&
                        value.trim() !== '' &&
                        availableOptionsStrings.includes(value)
                    );

                    if (validValues.length > 0) {
                        groupedFilters.push({
                            category,
                            values: validValues.map(value => ({
                                value,
                                onRemove: () => {
                                    // Use the same logic as FilterSidebar to ensure consistency
                                    const currentValues = filterState.filters?.[category] || [];
                                    // Type guard to ensure it's an array
                                    if (Array.isArray(currentValues)) {
                                        const updatedValues = currentValues.filter((val: string) => val !== value);
                                        dispatch(setFilterValues({ category, values: updatedValues }));
                                        handleFilterChange();
                                    }
                                }
                            }))
                        });
                    }
                }
            });
        }

        return groupedFilters;
    };

    const groupedFilters = getGroupedFilters();
    const totalFilters = groupedFilters.reduce((sum, group) => sum + group.values.length, 0);

    const handleFilterChange = async () => {
        setIsLoading(true);

        // Ensure we have proper default values even if Redux state isn't fully initialized
        const safeFilterState = {
            selectedToggle: filterState.selectedToggle || "import",
            selectedDataType: filterState.selectedDataType || null,
            dateRange: {
                from: filterState.dateRange?.from || moment(new Date(2020, 5, 11)).format("YYYY-MM-DD"),
                to: filterState.dateRange?.to || moment(new Date()).format("YYYY-MM-DD")
            },
            selectedChapters: filterState.selectedChapters || [],
            selectedSearchType: filterState.selectedSearchType || null,
            selectedSearchItems: filterState.selectedSearchItems || [],
            filters: filterState.filters || {}
        };

        const data = {
            informationOf: safeFilterState.selectedToggle,
            dataType: safeFilterState.selectedDataType,
            duration: `${moment(safeFilterState.dateRange.from).format("DD/MM/YYYY")}-${moment(
                safeFilterState.dateRange.to
            ).format("DD/MM/YYYY")}`,
            chapter: safeFilterState.selectedChapters,
            searchType: safeFilterState.selectedSearchType,
            searchValue: Array.isArray(safeFilterState.selectedSearchItems)
                ? safeFilterState.selectedSearchItems.map(item => typeof item === 'string' ? item.replace(/'/g, "''") : String(item).replace(/'/g, "''"))
                : (safeFilterState.selectedSearchItems as string).replace(/'/g, "''"),
            ...convertFiltersToUrlParams(safeFilterState.filters),
            session: localStorage.getItem("sessionId")
        };

        const shipmentParams = {
            startDate: moment(safeFilterState.dateRange.from).format("YYYY-MM-DD"),
            endDate: moment(safeFilterState.dateRange.to).format("YYYY-MM-DD"),
            searchType: data.searchType,
            searchValue: data.searchValue,
            informationOf: data.informationOf,
            page: 1,
            limit: 10,
            ...convertFiltersToUrlParams(safeFilterState.filters),
        };

        const toastId = toast.loading("Updating data...");

        try {
            const [summaryRes, allTopMetricsRes, shipmentTable, filtersRes] = await Promise.all([
                triggerSummaryStats(data).unwrap(),
                triggerAllTopMetrics(data).unwrap(),
                triggerShipmentTable(shipmentParams).unwrap(),
                triggerFilterValues(data).unwrap(),
            ]);

            // Dispatch summary stats and filter data
            dispatch(setSummaryStats(summaryRes.metrics.summaryStats));
            dispatch(setFilterData(filtersRes.filters));

            // Dispatch all top metrics data from the single all-top-metrics API
            dispatch(setTopBuyersByQuantity(allTopMetricsRes.metrics.topBuyersByQuantity));
            dispatch(setTopBuyersByValue(allTopMetricsRes.metrics.topBuyersByValue));
            dispatch(setTopYearsByQuantity(allTopMetricsRes.metrics.topYearsByQuantity));
            dispatch(setTopYearsByValue(allTopMetricsRes.metrics.topYearsByValue));
            dispatch(setTopHSCodeByQuantity(allTopMetricsRes.metrics.topHSCodeByQuantity));
            dispatch(setTopHSCodeByValue(allTopMetricsRes.metrics.topHSCodeByValue));
            dispatch(setTopSuppliersByQuantity(allTopMetricsRes.metrics.topSuppliersByQuantity));
            dispatch(setTopSuppliersByValue(allTopMetricsRes.metrics.topSuppliersByValue));
            dispatch(setTopCountryByQuantity(allTopMetricsRes.metrics.topCountryByQuantity));
            dispatch(setTopCountryByValue(allTopMetricsRes.metrics.topCountryByValue));
            dispatch(setTopIndianPortByQuantity(allTopMetricsRes.metrics.topIndianPortByQuantity));
            dispatch(setTopIndianPortByValue(allTopMetricsRes.metrics.topIndianPortByValue));

            dispatch(
                setShipmentTable({
                    page: shipmentTable.page,
                    limit: shipmentTable.limit,
                    totalRecords: shipmentTable.totalRecords,
                    totalPages: shipmentTable.totalPages,
                    data: shipmentTable.data,
                })
            );

            toast.success("Data updated successfully!", { id: toastId });
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to update data.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    if (totalFilters === 0) {
        return null;
    }

    return (
        <div className="w-full px-6 py-2">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 p-0 h-auto"
                >
                    Applied Filters ({totalFilters})
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {isExpanded && (
                <div className="mt-2.5 bg-white rounded-lg p-2.5 border border-gray-200">
                    <div className="max-h-28 overflow-y-auto">
                        <div className="flex flex-wrap gap-3">
                            {groupedFilters.map((group, groupIndex) => (
                                <div key={groupIndex} className="inline-flex flex-wrap items-center gap-1.5">
                                    <span className="text-[11px] font-medium text-gray-600">
                                        {group.category}:
                                    </span>
                                    {group.values.map((item, valueIndex) => (
                                        <Badge
                                            key={valueIndex}
                                            variant="secondary"
                                            className="flex items-center gap-1 bg-gray-50 text-gray-700 border border-gray-200 px-2 py-1 text-[11px] shadow-sm hover:bg-gray-100 transition-all duration-200"
                                        >
                                            <span className="truncate max-w-[100px] text-gray-800">{item.value}</span>
                                            <button
                                                type="button"
                                                onClick={item.onRemove}
                                                disabled={isLoading}
                                                className="ml-0.5 rounded-full outline-none hover:bg-red-100 p-0.5 disabled:opacity-50 transition-colors group"
                                            >
                                                <X className="h-2.5 w-2.5 text-gray-400 group-hover:text-red-500" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
