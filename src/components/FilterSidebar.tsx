import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HierarchicalHSCode from "@/components/HierarchicalHSCode";
import RangeSlider from "@/components/RangeSlider";
import { defaultFilterKeys } from "@/constants/config";
import { useLazyGetAllTopMetricsQuery, useLazyGetFilterValuesQuery, useLazyGetShipmentTableQuery, useLazyGetSummaryStatsQuery, useLazySearchFiltersQuery, useLazyGetFilterMetadataQuery } from "@/redux/api/dashboardAPi";
import { convertFiltersToUrlParams, transformSearchTypeForPayload } from "@/utils/helper";
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
    setTopYearsByValue
} from "@/redux/reducers/dashboardReducer";
import { setShipmentTable } from "@/redux/reducers/shipmentReducer";
import {
    clearFilterCategory,
    selectAllFilterCategory,
    setFilterValues,
} from "@/redux/reducers/filterReducer";
import type { RootState } from "@/redux/store";
import { Eraser, Filter, Search } from "lucide-react";
import moment from "moment";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const extractOptionValue = (option: unknown): string => {
    if (typeof option === 'object' && option !== null && 'value' in option) {
        return String((option as { value: unknown }).value);
    }
    return String(option);
};

const extractOptionCount = (option: unknown): string | null => {
    if (typeof option === 'object' && option !== null && 'count' in option) {
        return String((option as { count: unknown }).count);
    }
    return null;
};

type SearchInputProps = {
    category: string;
    value: string;
    onChange: (value: string) => void;
    onDebouncedSearch?: (value: string) => void;
};

const SearchInput = ({ category, value, onChange, onDebouncedSearch }: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedValue = useDebounce(value, 300); // 300ms debounce delay

    useEffect(() => {
        if (onDebouncedSearch && debouncedValue !== value) {
            onDebouncedSearch(debouncedValue);
        }
    }, [debouncedValue, onDebouncedSearch, value]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        [onChange]
    );

    const handleClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

    return (
        <div className="relative mb-3" onClick={handleClick}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                ref={inputRef}
                placeholder={`Search ${category}...`}
                className="pl-9 pr-3 py-2 rounded-md border border-input focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
            />
        </div>
    );
};

export default function FilterSidebar() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [openAccordionItem, setOpenAccordionItem] = useState("");
    const [categorySearchTerms, setCategorySearchTerms] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [unitPriceRange, setUnitPriceRange] = useState<[number, number]>([0, 1000000]);
    const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 1000000]);
    const [visibleItemsCount, setVisibleItemsCount] = useState<Record<string, number>>({});
    const [hoveredOption, setHoveredOption] = useState<{ text: string; x: number; y: number } | null>(null);

    const dispatch = useDispatch();
    const filterState = useSelector((state: RootState) => state.filter);
    const dashboardData = useSelector((state: RootState) => state.dashboard);
    const filterOptions = useMemo(() => (dashboardData?.filter ?? {}) as { [key: string]: unknown[] | { min: number; max: number } }, [dashboardData?.filter]);
    const filterValues = useMemo(() => filterState.filters || {}, [filterState.filters]);
    const filterMetadata = useMemo(() => dashboardData?.filterMetadata || {}, [dashboardData?.filterMetadata]);

    // Filter categories based on selectedDataType: hide CAS Number when Raw is selected
    const visibleFilterKeys = useMemo(() => {
        if (filterState.selectedDataType === "Raw") {
            return defaultFilterKeys.filter(key => key !== "CAS Number");
        }
        return defaultFilterKeys;
    }, [filterState.selectedDataType]);

    // Update range sliders when filter data changes
    useEffect(() => {
        if (filterOptions["Unit Price"] && typeof filterOptions["Unit Price"] === 'object' && 'min' in filterOptions["Unit Price"] && 'max' in filterOptions["Unit Price"]) {
            const unitPriceData = filterOptions["Unit Price"] as { min: number; max: number };
            // Only update if the current range is still at default values
            if (unitPriceRange[0] === 0 && unitPriceRange[1] === 1000000) {
                setUnitPriceRange([unitPriceData.min, unitPriceData.max]);
            }
        }

        if (filterOptions["Quantity"] && typeof filterOptions["Quantity"] === 'object' && 'min' in filterOptions["Quantity"] && 'max' in filterOptions["Quantity"]) {
            const quantityData = filterOptions["Quantity"] as { min: number; max: number };
            // Only update if the current range is still at default values
            if (quantityRange[0] === 0 && quantityRange[1] === 1000000) {
                setQuantityRange([quantityData.min, quantityData.max]);
            }
        }
    }, [filterOptions, unitPriceRange, quantityRange]);

    const [triggerSummaryStats] = useLazyGetSummaryStatsQuery();
    const [triggerAllTopMetrics] = useLazyGetAllTopMetricsQuery();
    const [triggerFilterValues] = useLazyGetFilterValuesQuery();
    const [triggerShipmentTable] = useLazyGetShipmentTableQuery();
    const [triggerSearchFilters] = useLazySearchFiltersQuery();
    const [triggerFilterMetadata] = useLazyGetFilterMetadataQuery();

    const getRangeValues = useCallback(
        (category: string) => {
            const option = filterOptions[category];
            if (option && typeof option === 'object' && 'min' in option && 'max' in option) {
                return { min: option.min, max: option.max };
            }
            return { min: 0, max: 1000000 }; // Default values
        },
        [filterOptions]
    );

    const getRecordData = useCallback(async (filtersOverride?: Record<string, string[] | { min: number; max: number }>) => {
        setIsLoading(true);
        const filters = filtersOverride ?? filterValues;

        const data = {
            informationOf: filterState.selectedToggle,
            dataType: filterState.selectedDataType,
            duration: `${moment(filterState.dateRange.from).format("DD/MM/YYYY")}-${moment(
                filterState.dateRange.to
            ).format("DD/MM/YYYY")}`,
            chapter: filterState.selectedChapters,
            searchType: transformSearchTypeForPayload(filterState.selectedSearchType, filterState.selectedToggle),
            searchValue: Array.isArray(filterState.selectedSearchItems)
                ? filterState.selectedSearchItems.map(item => item.replace(/'/g, "''")) // Escape single quotes
                : (filterState.selectedSearchItems as string).replace(/'/g, "''"),
            ...convertFiltersToUrlParams(filters),
            session: localStorage.getItem("sessionId"),
        };

        const shipmentParams = {
            startDate: moment(filterState.dateRange.from).format("YYYY-MM-DD"),
            endDate: moment(filterState.dateRange.to).format("YYYY-MM-DD"),
            searchType: data.searchType,
            searchValue: data.searchValue,
            informationOf: data.informationOf,
            page: 1,
            limit: 10,
            ...(filterState.selectedChapters && filterState.selectedChapters.length > 0 && { chapter: filterState.selectedChapters }),
            ...convertFiltersToUrlParams(filters),
        };

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
        } catch (err) {
            console.error("getRecordData error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [
        filterState.selectedToggle,
        filterState.selectedDataType,
        filterState.dateRange.from,
        filterState.dateRange.to,
        filterState.selectedChapters,
        filterState.selectedSearchType,
        filterState.selectedSearchItems,
        filterValues,
        triggerSummaryStats,
        triggerAllTopMetrics,
        triggerShipmentTable,
        triggerFilterValues,
        triggerFilterMetadata,
        dispatch
    ]);

    const handleCheckboxChange = useCallback(
        (category: string, value: string, checked: boolean) => {
            // Skip checkbox changes for range-based filters
            if (category === "Unit Price" || category === "Quantity") {
                return;
            }

            const currentValues = filterValues[category];

            // Ensure currentValues is an array
            if (!Array.isArray(currentValues)) {
                return;
            }

            const updatedValues = checked
                ? [...new Set([...currentValues, value])]
                : currentValues.filter((val: string) => val !== value);

            dispatch(setFilterValues({ category, values: updatedValues }));
        },
        [dispatch, filterValues]
    );

    const handleSelectAll = useCallback(
        async (category: string, checked: boolean) => {
            const options = filterOptions[category] || [];

            // Skip select all for range-based filters (Unit Price, Quantity)
            if (category === "Unit Price" || category === "Quantity") {
                return;
            }

            // Ensure options is an array before calling map
            if (!Array.isArray(options)) {
                return;
            }

            const filteredOptions = options
                .map(extractOptionValue)
                .filter((option: string) =>
                    option.toLowerCase().includes((categorySearchTerms[category] || "").toLowerCase())
                );

            const newValues = checked ? filteredOptions : [];
            dispatch(
                checked
                    ? selectAllFilterCategory({ category, values: filteredOptions })
                    : clearFilterCategory(category)
            );

            // Create updated filters object for API call
            const updatedFilters = {
                ...filterValues,
                [category]: newValues
            };

            // Call API immediately with updated filters
            try {
                await getRecordData(updatedFilters);
            } catch (error) {
                console.error("Select all API error:", error);
            }
        },
        [dispatch, filterOptions, categorySearchTerms, filterValues, getRecordData]
    );

    const handleClearSelection = useCallback(
        async (category: string) => {
            const toastId = toast.loading(`Clearing ${category} filter...`);

            try {
                dispatch(clearFilterCategory(category));

                // Create updated filters object for API call
                const updatedFilters = {
                    ...filterValues,
                    [category]: []
                };

                // For range filters, reset to default range
                if (category === "Unit Price") {
                    const rangeValues = getRangeValues(category);
                    updatedFilters[category] = { min: rangeValues.min, max: rangeValues.max };
                } else if (category === "Quantity") {
                    const rangeValues = getRangeValues(category);
                    updatedFilters[category] = { min: rangeValues.min, max: rangeValues.max };
                }

                // Call API immediately with updated filters
                await getRecordData(updatedFilters);
                toast.success(`${category} filter cleared successfully!`, { id: toastId });
            } catch (error) {
                console.error("Clear selection API error:", error);
                toast.error(`Failed to clear ${category} filter.`, { id: toastId });
            }
        },
        [dispatch, filterValues, getRecordData, getRangeValues]
    );

    const handleClearAllFilters = useCallback(
        async () => {
            setIsLoading(true);
            const toastId = toast.loading("Clearing all filters...");

            try {
                // Clear all filter values
                Object.keys(filterValues).forEach(category => {
                    dispatch(clearFilterCategory(category));
                });

                // Clear search terms
                setCategorySearchTerms({});

                // Reset range sliders to default values
                setUnitPriceRange([0, 1000000]);
                setQuantityRange([0, 1000000]);

                // Call API with empty filters (initial payload)
                await getRecordData({});
                toast.success("All filters cleared successfully!", { id: toastId });
            } catch (error) {
                console.error("Clear all filters error:", error);
                toast.error("Failed to clear all filters.", { id: toastId });
            } finally {
                setIsLoading(false);
            }
        },
        [dispatch, filterValues, getRecordData]
    );

    const handleSearchChange = useCallback(
        (category: string, term: string) => {
            setCategorySearchTerms((prev) => ({ ...prev, [category]: term }));
        },
        []
    );

    const handleDebouncedSearch = useCallback(
        async (searchTerm: string) => {
            // Only call API if search term has at least 2 characters
            if (!searchTerm.trim() || searchTerm.trim().length < 2) return;

            try {
                const searchParams = {
                    search: searchTerm.trim(),
                    informationOf: filterState.selectedToggle,
                    startDate: moment(filterState.dateRange.from).format("YYYY-MM-DD"),
                    endDate: moment(filterState.dateRange.to).format("YYYY-MM-DD"),
                };

                const searchResults = await triggerSearchFilters(searchParams).unwrap();

                // Update filter options with search results if they exist
                if (searchResults?.filters) {
                    dispatch(setFilterData(searchResults.filters));
                }
            } catch (error) {
                console.error("Search error:", error);
            }
        },
        [
            filterState.selectedToggle,
            filterState.dateRange.from,
            filterState.dateRange.to,
            triggerSearchFilters,
            dispatch
        ]
    );

    const handleApplyFilters = useCallback(
        async () => {
            setIsLoading(true);
            const toastId = toast.loading("Applying filters...");

            try {
                // Create updated filters with range slider values in correct format
                const updatedFilters = {
                    ...filterValues,
                    "Unit Price": { min: unitPriceRange[0], max: unitPriceRange[1] },
                    "Quantity": { min: quantityRange[0], max: quantityRange[1] }
                };

                await getRecordData(updatedFilters);
                toast.success("Filters applied successfully!", { id: toastId });
            } catch (error) {
                console.error("Apply filters error:", error);
                toast.error("Failed to apply filters.", { id: toastId });
            } finally {
                setIsLoading(false);
            }
        },
        [getRecordData, filterValues, unitPriceRange, quantityRange]
    );

    const handleAccordionChange = useCallback(
        (value: string) => setOpenAccordionItem((prev) => (value === prev ? "" : value)),
        []
    );

    const INITIAL_ITEMS = 100; // Initial items to show
    const LOAD_MORE_COUNT = 50; // Items to load when clicking "Load More"

    const handleLoadMore = useCallback((category: string) => {
        setVisibleItemsCount(prev => ({
            ...prev,
            [category]: (prev[category] || INITIAL_ITEMS) + LOAD_MORE_COUNT
        }));
    }, []);

    const getFilteredOptions = useCallback(
        (category: string, options: unknown[] | { min: number; max: number } = []) => {
            // Skip filtering for range-based filters
            if (category === "Unit Price" || category === "Quantity") {
                return { displayed: [], total: 0, hasMore: false, displayedObjects: [] };
            }

            // Ensure options is an array before filtering
            if (!Array.isArray(options)) {
                return { displayed: [], total: 0, hasMore: false, displayedObjects: [] };
            }

            const searchTerm = categorySearchTerms[category] || "";
            // Filter the original options first (preserving objects), then extract values
            const filteredObjects = options.filter((option) => {
                const value = extractOptionValue(option);
                return value.toLowerCase().includes(searchTerm.toLowerCase());
            });

            // Extract values from filtered objects for backward compatibility
            const filtered = filteredObjects.map(extractOptionValue);

            const limit = visibleItemsCount[category] || INITIAL_ITEMS;
            const displayed = filtered.slice(0, limit);
            const displayedObjects = filteredObjects.slice(0, limit);
            const hasMore = filtered.length > displayed.length;

            return { displayed, total: filtered.length, hasMore, displayedObjects };
        },
        [categorySearchTerms, visibleItemsCount]
    );

    const FilterPanelContent = useMemo(
        () => (
            <Card className="rounded-lg shadow-sm border border-gray-200 bg-white text-foreground flex flex-col w-full sticky top-5 z-40 max-h-[calc(100vh-2rem)]">
                <CardHeader className="px-4 border-b border-gray-200 flex-shrink-0 !pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-900">Filters</CardTitle>
                        <Button
                            onClick={handleClearAllFilters}
                            disabled={isLoading}
                            variant="outline"
                            size="sm"
                            className="text-xs px-3 py-1 h-8 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-1">
                                    Clearing...
                                </div>
                            ) : (
                                'Clear All'
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-y-auto min-h-0">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={openAccordionItem}
                        onValueChange={handleAccordionChange}
                    >
                        {visibleFilterKeys.map((category) => {
                            const options = filterOptions[category] || [];
                            const { displayed: filteredOptions, total: totalOptions, hasMore, displayedObjects } = getFilteredOptions(category, options);
                            const searchTerm = categorySearchTerms[category] || "";

                            return (
                                <AccordionItem
                                    key={category}
                                    value={category}
                                    className="border-b border-gray-200 last:border-b-0"
                                >
                                    <AccordionTrigger className="px-4 py-3 text-sm font-normal text-muted-foreground hover:no-underline data-[state=open]:text-foreground cursor-pointer">
                                        <div className="flex items-center justify-between w-full">
                                            <span>{category}</span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                                                ({filterMetadata[category] || 0})
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 pt-2">
                                        {category === "Unit Price" ? (
                                            // Unit Price slider
                                            <div className="space-y-3">
                                                <RangeSlider
                                                    value={unitPriceRange}
                                                    onChange={setUnitPriceRange}
                                                    min={getRangeValues(category).min}
                                                    max={getRangeValues(category).max}
                                                    step={100}
                                                    disabled={isLoading}
                                                    formatValue={(val) => `$${val.toLocaleString()}`}
                                                />
                                                <div className="pt-3 border-t border-gray-200">
                                                    <Button
                                                        onClick={handleApplyFilters}
                                                        disabled={isLoading}
                                                        className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? 'Applying...' : 'Apply Filter'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : category === "Quantity" ? (
                                            // Quantity slider
                                            <div className="space-y-3">
                                                <RangeSlider
                                                    value={quantityRange}
                                                    onChange={setQuantityRange}
                                                    min={getRangeValues(category).min}
                                                    max={getRangeValues(category).max}
                                                    step={1}
                                                    disabled={isLoading}
                                                    formatValue={(val) => val.toLocaleString()}
                                                />
                                                <div className="pt-3 border-t border-gray-200">
                                                    <Button
                                                        onClick={handleApplyFilters}
                                                        disabled={isLoading}
                                                        className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? 'Applying...' : 'Apply Filter'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : category === "H S Code" ? (
                                            // Special hierarchical component for HS Code
                                            <div className="space-y-3">
                                                <HierarchicalHSCode
                                                    hsCodes={Array.isArray(options) ? options.map(extractOptionValue) : []}
                                                    selectedCodes={Array.isArray(filterValues[category]) ? filterValues[category] as string[] : []}
                                                    onSelectionChange={(selectedCodes) => {
                                                        dispatch(setFilterValues({ category, values: selectedCodes }));
                                                    }}
                                                    disabled={isLoading}
                                                />
                                                {/* Apply Filter Button for HS Code */}
                                                <div className="pt-3 border-t border-gray-200">
                                                    <Button
                                                        onClick={handleApplyFilters}
                                                        disabled={isLoading}
                                                        className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? (
                                                            <div className="flex items-center gap-2">
                                                                Applying...
                                                            </div>
                                                        ) : (
                                                            'Apply Filter'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Default filter component for other categories
                                            <>
                                                <SearchInput
                                                    category={category}
                                                    value={searchTerm}
                                                    onChange={(value) => handleSearchChange(category, value)}
                                                    onDebouncedSearch={handleDebouncedSearch}
                                                />

                                                <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200 mb-2 cursor-pointer">
                                                    <Label
                                                        htmlFor={`select-all-${category}`}
                                                        className="flex items-center gap-2 font-normal cursor-pointer text-sm"
                                                    >
                                                        <Checkbox
                                                            id={`select-all-${category}`}
                                                            checked={
                                                                filteredOptions.length > 0 &&
                                                                Array.isArray(filterValues[category]) &&
                                                                filteredOptions.every((option) =>
                                                                    (filterValues[category] as string[])?.includes(option)
                                                                )
                                                            }
                                                            onCheckedChange={(checked: boolean) =>
                                                                handleSelectAll(category, checked)
                                                            }
                                                            disabled={isLoading}
                                                            className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                                                        />
                                                        Select All
                                                    </Label>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearSelection(category);
                                                        }}
                                                        disabled={isLoading}
                                                        aria-label="Clear selection"
                                                    >
                                                        <Eraser className="h-4 w-4" />
                                                        <span className="sr-only">Clear selection</span>
                                                    </Button>
                                                </div>

                                                <ScrollArea className="max-h-64 overflow-auto">
                                                    <div className="p-3 space-y-2">
                                                        {filteredOptions.length > 0 ? (
                                                            <>
                                                                {filteredOptions.map((option, index) => {
                                                                    // Get the original option object from displayedObjects array
                                                                    const originalOption = displayedObjects[index];
                                                                    const count = originalOption ? extractOptionCount(originalOption) : null;

                                                                    return (
                                                                        <Label
                                                                            key={option}
                                                                            htmlFor={`${category}-${option}`}
                                                                            className="flex items-center justify-between text-sm text-gray-600 cursor-pointer py-1 px-2 rounded-md hover:bg-accent/50 transition-colors duration-150 font-normal gap-2"
                                                                        >
                                                                            <div className="flex items-center space-x-4 flex-1 min-w-0 overflow-hidden">
                                                                                <Checkbox
                                                                                    id={`${category}-${option}`}
                                                                                    checked={Array.isArray(filterValues[category]) && (filterValues[category] as string[])?.includes(option) || false}
                                                                                    onCheckedChange={(checked: boolean) =>
                                                                                        handleCheckboxChange(category, option, checked)
                                                                                    }
                                                                                    disabled={isLoading}
                                                                                    className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300 flex-shrink-0"
                                                                                />
                                                                                <div className="relative">
                                                                                    <span
                                                                                        className="truncate block max-w-[120px] cursor-default"
                                                                                        onMouseEnter={(e) => {
                                                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                                                            setHoveredOption({
                                                                                                text: option,
                                                                                                x: rect.left + rect.width / 2,
                                                                                                y: rect.top
                                                                                            });
                                                                                        }}
                                                                                        onMouseLeave={() => setHoveredOption(null)}
                                                                                    >
                                                                                        {option}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            {count !== null && (
                                                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                                                                                    {count}
                                                                                </span>
                                                                            )}
                                                                        </Label>
                                                                    );
                                                                })}
                                                                {hasMore && (
                                                                    <div className="pt-2 text-center">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleLoadMore(category)}
                                                                            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                        >
                                                                            Load More ({filteredOptions.length} of {totalOptions})
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <p className="text-center text-muted-foreground py-4 text-sm">
                                                                No options found.
                                                            </p>
                                                        )}
                                                    </div>
                                                </ScrollArea>

                                                {/* Apply Filter Button */}
                                                <div className="px-3 pt-3 pb-1 border-t border-gray-200 mt-2">
                                                    <Button
                                                        onClick={handleApplyFilters}
                                                        disabled={isLoading}
                                                        className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? (
                                                            <div className="flex items-center gap-2">
                                                                Applying...
                                                            </div>
                                                        ) : (
                                                            'Apply Filter'
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </CardContent>
            </Card>
        ),
        [
            openAccordionItem,
            categorySearchTerms,
            filterValues,
            unitPriceRange,
            quantityRange,
            handleAccordionChange,
            handleSearchChange,
            handleSelectAll,
            handleClearSelection,
            handleClearAllFilters,
            handleCheckboxChange,
            getFilteredOptions,
            filterOptions,
            isLoading,
            dispatch,
            filterMetadata,
            handleApplyFilters,
            handleDebouncedSearch,
            getRangeValues,
            handleLoadMore,
            visibleFilterKeys,
        ]
    );

    return (
        <>
            <div className="flex text-foreground w-full max-w-[16rem]">
                <aside className="hidden md:block w-full">{FilterPanelContent}</aside>
                <div className="fixed bottom-4 right-4 z-50 md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="default"
                                size="icon"
                                className="w-14 h-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                                aria-label="Open filters"
                            >
                                <Filter className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-72 sm:w-80 border-none outline-none"
                        >
                            {FilterPanelContent}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            {/* Tooltip Portal */}
            {hoveredOption && (
                <div
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        left: `${hoveredOption.x}px`,
                        top: `${hoveredOption.y - 10}px`,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2 whitespace-nowrap">
                        <p className="text-xs font-medium text-gray-900">
                            {hoveredOption.text}
                        </p>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45"></div>
                </div>
            )}
        </>
    );
}