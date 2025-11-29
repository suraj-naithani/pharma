import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { searchTypeOptions } from "@/constants/config"
import { useLazyGetFilterValuesQuery, useLazyGetSuggestionsQuery, useLazyGetSummaryStatsQuery, useLazyGetAllTopMetricsQuery, useLazyGetShipmentTableQuery, useLazyGetFilterMetadataQuery } from "@/redux/api/dashboardAPi"
import { convertFiltersToUrlParams, transformSearchTypeForPayload } from "@/utils/helper"
import {
    setFilterData,
    setFilterMetadata,
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
    clearDashboardStats
} from "@/redux/reducers/dashboardReducer"
import { addSearchItem, removeSearchItem, setEndDate, setSelectedChapters, setSelectedDataType, setSelectedSearchType, setSelectedToggle, setShowSuggestions, setStartDate, toggleChapter, resetAllData, clearAllFilters } from "@/redux/reducers/filterReducer"
import { setShipmentTable, clearShipmentTable } from "@/redux/reducers/shipmentReducer"
import type { RootState } from "@/redux/store"
import { CalendarDays, ChevronDown, RefreshCw, Search, X } from "lucide-react"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

export default function FilterSection() {
    const [currentInput, setCurrentInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const filterState = useSelector((state: RootState) => state.filter);
    const dispatch = useDispatch();

    const [triggerSuggestions, { data: suggestions, isFetching }] = useLazyGetSuggestionsQuery();

    const [triggerSummaryStats] = useLazyGetSummaryStatsQuery();
    const [triggerAllTopMetrics] = useLazyGetAllTopMetricsQuery();
    const [triggerFilterValues] = useLazyGetFilterValuesQuery();
    const [triggerShipmentTable] = useLazyGetShipmentTableQuery();
    const [triggerFilterMetadata] = useLazyGetFilterMetadataQuery();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const chapterOptions =
        filterState.selectedDataType === "Cleaned"
            ? [29, 30]
            : Array.from({ length: 34 - 28 + 1 }, (_, i) => 28 + i);

    const handleRemoveChapter = (chapterToRemove: number) => {
        const updatedChapters = filterState.selectedChapters.filter((c) => c !== chapterToRemove);
        dispatch(setSelectedChapters(updatedChapters));
    };

    const getSearchTypeLabel = (type: string) => {
        if (type.includes("Indian Company")) {
            return filterState.selectedToggle === "export"
                ? "Indian Company (Exporter)"
                : "Indian Company (Importer)";
        }

        if (type.includes("Foreign Company")) {
            return filterState.selectedToggle === "export"
                ? "Foreign Company (Importer)"
                : "Foreign Company (Exporter)";
        }

        return type;
    };

    const getSearchTypeDisabledState = (type: string) => {
        if (!filterState.selectedDataType) {
            return true;
        }
        if (filterState.selectedDataType === "Raw") {
            return type === "Product Name" || type === "CAS Number";
        }
        if (filterState.selectedDataType === "Cleaned") {
            return type === "Product Description";
        }
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Clear all applied filters before making API call to get fresh data
        dispatch(clearAllFilters());

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
            filters: {
                "Indian Port": [],
                "H S Code": [],
                "Product Description": [],
                "Quantity Units": [],
                "Quantity": [],
                "Unit Price": [],
                "Currency": [],
                "Product Name": [],
                "Indian Company": [],
                "Foreign Company": [],
                "Foreign Country": [],
                "CAS Number": [],
            }
        };

        const data = {
            informationOf: safeFilterState.selectedToggle,
            dataType: safeFilterState.selectedDataType,
            duration: `${moment(safeFilterState.dateRange.from).format("DD/MM/YYYY")}-${moment(
                safeFilterState.dateRange.to
            ).format("DD/MM/YYYY")}`,
            chapter: safeFilterState.selectedChapters,
            searchType: transformSearchTypeForPayload(safeFilterState.selectedSearchType, safeFilterState.selectedToggle),
            searchValue: Array.isArray(safeFilterState.selectedSearchItems)
                ? safeFilterState.selectedSearchItems.map(item => typeof item === 'string' ? item.replace(/'/g, "''") : String(item).replace(/'/g, "''")) // Escape single quotes
                : (safeFilterState.selectedSearchItems as string).replace(/'/g, "''"),
            ...convertFiltersToUrlParams(safeFilterState.filters),
            session: localStorage.getItem("sessionId")
        };

        const shipmentParams = {
            startDate: moment(safeFilterState.dateRange.from).format("YYYY-MM-DD"),
            endDate: moment(safeFilterState.dateRange.to).format("YYYY-MM-DD"),
            searchType: data.searchType,
            searchValue: data.searchValue,  // Now a string (joined if array)
            informationOf: data.informationOf,
            page: 1,
            limit: 10,
            ...(safeFilterState.selectedChapters && safeFilterState.selectedChapters.length > 0 && { chapter: safeFilterState.selectedChapters }),
            ...convertFiltersToUrlParams(safeFilterState.filters),
        };

        const toastId = toast.loading("Fetching data...");

        try {
            const [summaryRes, allTopMetricsRes, shipmentTable, filtersRes, metadataRes] = await Promise.all([
                triggerSummaryStats(data).unwrap(),
                triggerAllTopMetrics(data).unwrap(),
                triggerShipmentTable(shipmentParams).unwrap(),
                triggerFilterValues(data).unwrap(),
                triggerFilterMetadata(data).unwrap()
            ]);

            // Dispatch summary stats and filter data
            dispatch(setSummaryStats(summaryRes.metrics.summaryStats));
            dispatch(setFilterData(filtersRes.filters));

            // Process and store filter metadata
            if (metadataRes?.metadata) {
                const metadataMap: Record<string, number> = {};
                metadataRes.metadata.forEach((item: { displayName: string; uniqueValueCount: number }) => {
                    metadataMap[item.displayName] = item.uniqueValueCount;
                });
                dispatch(setFilterMetadata(metadataMap));
            }

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

            toast.success("Data fetched successfully!", { id: toastId });
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to fetch data.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const addSearchItemHandler = (item: string) => {
        if (!item.trim()) return;

        dispatch(addSearchItem(item));

        setCurrentInput("");

        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }

        setTimeout(() => {
            if (searchContainerRef.current) {
                searchContainerRef.current.scrollLeft = searchContainerRef.current.scrollWidth;
            }
        }, 10);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentInput.trim()) {
            e.preventDefault();
            addSearchItem(currentInput);
        }
    };

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("search-container")) {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    };

    const handleResetAllData = async () => {
        setIsLoading(true);

        try {
            // Clear all dashboard data (graphs, tables, stats)
            dispatch(clearDashboardStats());
            dispatch(clearShipmentTable());

            // Reset all filter state to initial values
            dispatch(resetAllData());

            // Clear current input
            setCurrentInput("");

            // Show success message
            toast.success("All data has been reset successfully!");

        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to reset data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!currentInput.trim()) return;

        const debounceTimer = setTimeout(() => {
            triggerSuggestions({
                informationOf: filterState.selectedToggle || "export",
                chapter: filterState.selectedChapters?.[0] || "",
                searchType: transformSearchTypeForPayload(filterState.selectedSearchType, filterState.selectedToggle || "export"),
                suggestion: currentInput,
                session: localStorage.getItem("sessionId"),
            });
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [currentInput, filterState.selectedToggle, filterState.selectedChapters, filterState.selectedSearchType]);

    return (
        <div className="p-3 w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:contents">
                    <ToggleGroup
                        type="single"
                        value={filterState.selectedToggle}
                        onValueChange={(value) => {
                            if (value) dispatch(setSelectedToggle(value as "import" | "export"));
                        }}
                        className="rounded-lg border border-[#C7D2FE] overflow-hidden"
                    >
                        <ToggleGroupItem
                            value="import"
                            aria-label="Toggle import"
                            className="px-4 py-2 text-sm data-[state=on]:bg-[#3B82F6] data-[state=on]:text-white data-[state=off]:bg-white data-[state=off]:text-[#1E293B] h-auto transition-colors duration-200"
                        >
                            Import
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="export"
                            aria-label="Toggle export"
                            className="px-4 py-2 text-sm data-[state=on]:bg-[#3B82F6] data-[state=on]:text-white data-[state=off]:bg-white data-[state=off]:text-[#1E293B] h-auto transition-colors duration-200"
                        >
                            Export
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <div className="flex flex-row gap-1 flex-wrap sm:flex-nowrap">
                        {/* Start Date Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`max-w-max gap-0 justify-start text-left bg-white border-gray-200 font-normal hover:bg-[#f4f4f5] text-sm ${!filterState.dateRange.from ? "text-gray-500" : ""
                                        }`}
                                >
                                    <CalendarDays className="mr-2 h-4 w-3" />
                                    {filterState.dateRange.from ? (
                                        moment(new Date(filterState.dateRange.from)).format("D MMM YYYY")
                                    ) : (
                                        <span>Start date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
                                <Calendar
                                    mode="single"
                                    selected={filterState.dateRange.from ? new Date(filterState.dateRange.from) : undefined}
                                    onSelect={(date) =>
                                        dispatch(setStartDate(date ? date.toISOString() : moment(new Date(2020, 5, 11)).format("YYYY-MM-DD")))
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        {/* End Date Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`max-w-max gap-0 justify-start text-left bg-white border-gray-200 font-normal hover:bg-[#f4f4f5] text-sm ${!filterState.dateRange.to ? "text-gray-500" : ""
                                        }`}
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {filterState.dateRange.to ? (
                                        moment(new Date(filterState.dateRange.to)).format("D MMM YYYY")
                                    ) : (
                                        <span>End date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
                                <Calendar
                                    mode="single"
                                    selected={filterState.dateRange.to ? new Date(filterState.dateRange.to) : undefined}
                                    onSelect={(date) =>
                                        dispatch(setEndDate(date ? date.toISOString() : moment(new Date()).format("YYYY-MM-DD")))
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:contents">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[130px] justify-between border outline-none border-gray-200 bg-white rounded-lg text-sm">
                                {filterState.selectedDataType || "Data Type"} <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[130px] border border-gray-200 bg-white">
                            <DropdownMenuItem onClick={() => dispatch(setSelectedDataType("Raw"))} className="hover:bg-[#f4f4f5]">
                                Raw
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => dispatch(setSelectedDataType("Cleaned"))} className="hover:bg-[#f4f4f5]">
                                Cleaned
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-[140px] relative rounded-lg h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm"
                            >
                                <div className="flex flex-nowrap gap-1 items-center overflow-hidden flex-grow pr-6">
                                    {filterState.selectedChapters.length > 0 ? (
                                        filterState.selectedChapters.map((chapter) => (
                                            <Badge
                                                key={chapter}
                                                variant="secondary"
                                                className="flex items-center gap-1 bg-gray-200 text-gray-800 rounded-lg px-2 py-0.5 text-xs font-normal shrink-0"
                                            >
                                                {chapter}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveChapter(chapter);
                                                    }}
                                                    className="ml-1 rounded-lg outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                >
                                                    <X className="h-3 w-3 text-gray-600 hover:text-gray-900" />
                                                </button>
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-gray-700 whitespace-nowrap">Chapter</span>
                                    )}
                                </div>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[140px] bg-white border border-gray-200">
                            {chapterOptions.map((chapter) => {
                                const isSelected = filterState.selectedChapters.includes(chapter);

                                return (
                                    <DropdownMenuItem
                                        key={chapter}
                                        onSelect={(e) => e.preventDefault()}
                                        className="hover:bg-[#f4f4f5] cursor-pointer"
                                        onClick={() => dispatch(toggleChapter(chapter))}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`chapter-${chapter}`}
                                                checked={isSelected}
                                                onCheckedChange={() => { }}
                                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white"
                                            />
                                            <label
                                                htmlFor={`chapter-${chapter}`}
                                                className="text-sm font-medium leading-none"
                                            >
                                                {chapter}
                                            </label>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-[180px] justify-between rounded-lg border border-gray-200 bg-white text-sm"
                            >
                                {filterState.selectedSearchType
                                    ? getSearchTypeLabel(filterState.selectedSearchType)
                                    : "Search Type"}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[180px] bg-white border border-gray-200">
                            {searchTypeOptions.map((type) => (
                                <DropdownMenuItem
                                    key={type}
                                    onClick={() => dispatch(setSelectedSearchType(type))}
                                    disabled={getSearchTypeDisabledState(type)}
                                    className={getSearchTypeDisabledState(type) ? "text-gray-400 cursor-not-allowed" : ""}
                                >
                                    {getSearchTypeLabel(type)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-grow sm:flex-grow-0 md:contents md:w-auto md:flex-grow-0">
                    <div className="relative flex-grow w-full sm:min-w-0 sm:max-w-none min-w-0 md:min-w-[500px] md:max-w-sm">
                        <div
                            className="w-full relative rounded-lg h-10 bg-white border border-gray-200 flex items-center pr-12"
                            onClick={handleContainerClick}
                        >
                            <div
                                ref={searchContainerRef}
                                className="search-container flex items-center gap-1 overflow-x-auto h-full pl-3 pr-2"
                                style={{
                                    msOverflowStyle: "none",
                                    scrollbarWidth: "none",
                                }}
                            >
                                <style>{`
                                .search-container::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                                {filterState.selectedSearchItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-gray-200 text-gray-700 rounded-lg px-2 py-0.5 text-xs font-normal shrink-0"
                                    >
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                                            {item}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(removeSearchItem(item));
                                            }}
                                            className="ml-1 rounded-lg outline-none border-none bg-transparent p-0.5 cursor-pointer"
                                        >
                                            <X className="h-3 w-3 text-gray-600 hover:text-gray-900" />
                                        </button>
                                    </div>
                                ))}

                                <div className="flex-shrink-0 min-w-[80px] flex-grow">
                                    <input
                                        ref={searchInputRef}
                                        placeholder={filterState.selectedSearchItems.length > 0 ? "" : "Search"}
                                        className="border-none outline-none p-0 h-8 bg-transparent w-full text-sm focus:ring-0"
                                        value={currentInput}
                                        onChange={(e) => setCurrentInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        onFocus={() => dispatch(setShowSuggestions(true))}
                                        onBlur={() => setTimeout(() => dispatch(setShowSuggestions(false)), 200)}
                                    />
                                </div>
                            </div>

                            {filterState.selectedSearchItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="absolute right-12 top-1/2 -translate-y-1/2 p-1 bg-white z-10 border-none rounded cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeSearchItem(item));
                                    }}
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            ))}
                        </div>

                        {filterState.showSuggestions && currentInput.trim() !== "" && (
                            <div className="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                                {isFetching ? (
                                    <div className="p-2 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#C7D2FE] border-t-[#3B82F6]"></div>
                                        <span className="ml-2 text-sm text-[#1E293B]">Loading...</span>
                                    </div>
                                ) : suggestions?.data?.length > 0 ? (
                                    <>
                                        {!suggestions?.data?.some(({ title }: { title: string }) => title.toLowerCase() === currentInput.toLowerCase()) && (
                                            <div
                                                className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                                                onMouseDown={() => addSearchItemHandler(currentInput)}
                                            >
                                                {currentInput}
                                            </div>
                                        )}
                                        {suggestions.data.map(({ title }: { title: string }, i: number) => (
                                            <div
                                                key={i}
                                                className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                                                onMouseDown={() => addSearchItemHandler(title)}
                                            >
                                                {title}
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="p-2 text-sm text-gray-500">
                                        No suggestions found. Press Enter to add "{currentInput}".
                                    </div>
                                )}
                            </div>
                        )}

                        <Button
                            className="absolute right-0 top-0 h-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white rounded-tl-none rounded-bl-none px-4 border-none cursor-pointer disabled:cursor-not-allowed transition-colors duration-200"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-lg border border-[#C7D2FE] bg-white hover:bg-[#EEF2FF] text-[#1E293B] transition-colors duration-200 flex-shrink-0"
                        onClick={handleResetAllData}
                        disabled={isLoading}
                        title="Reset all data (graphs, tables, filters)"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>
        </div>
    );
}