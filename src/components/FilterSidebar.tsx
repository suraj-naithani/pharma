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
import { defaultFilterKeys } from "@/constants/config";
import { useLazyGetAllTopMetricsQuery, useLazyGetFilterValuesQuery, useLazyGetShipmentTableQuery, useLazyGetSummaryStatsQuery, useLazySearchFiltersQuery, useLazyGetFilterMetadataQuery } from "@/redux/api/dashboardAPi";
import { convertFiltersToUrlParams } from "@/utils/helper";
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

    const dispatch = useDispatch();
    const filterState = useSelector((state: RootState) => state.filter);
    const dashboardData = useSelector((state: RootState) => state.dashboard);
    const filterOptions = (dashboardData?.filter ?? {}) as { [key: string]: any[] };
    const filterValues = filterState.filters || {};
    const filterMetadata = dashboardData?.filterMetadata || {};

    const [triggerSummaryStats] = useLazyGetSummaryStatsQuery();
    const [triggerAllTopMetrics] = useLazyGetAllTopMetricsQuery();
    const [triggerFilterValues] = useLazyGetFilterValuesQuery();
    const [triggerShipmentTable] = useLazyGetShipmentTableQuery();
    const [triggerSearchFilters] = useLazySearchFiltersQuery();
    const [triggerFilterMetadata] = useLazyGetFilterMetadataQuery();

    const getRecordData = useCallback(async (filtersOverride?: Record<string, string[]>) => {
        setIsLoading(true);
        const filters = filtersOverride ?? filterValues;

        const data = {
            informationOf: filterState.selectedToggle,
            dataType: filterState.selectedDataType,
            duration: `${moment(filterState.dateRange.from).format("DD/MM/YYYY")}-${moment(
                filterState.dateRange.to
            ).format("DD/MM/YYYY")}`,
            chapter: filterState.selectedChapters,
            searchType: filterState.selectedSearchType,
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
            ...convertFiltersToUrlParams(filters),
        };

        try {
            const [summaryRes, allTopMetricsRes, shipmentTable, filtersRes, metadataRes] = await Promise.all([
                triggerSummaryStats(data).unwrap(),
                triggerAllTopMetrics(data).unwrap(),
                triggerShipmentTable(shipmentParams).unwrap(),
                triggerFilterValues(data).unwrap(),
                triggerFilterMetadata({
                    informationOf: filterState.selectedToggle,
                    startDate: moment(filterState.dateRange.from).format("YYYY-MM-DD"),
                    endDate: moment(filterState.dateRange.to).format("YYYY-MM-DD"),
                }).unwrap()
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
            const currentValues = filterValues[category] || [];
            const updatedValues = checked
                ? [...new Set([...currentValues, value])]
                : currentValues.filter((val) => val !== value);

            dispatch(setFilterValues({ category, values: updatedValues }));
        },
        [dispatch, filterValues]
    );

    const handleSelectAll = useCallback(
        async (category: string, checked: boolean) => {
            const options = filterOptions[category] || [];
            const filteredOptions = options
                .map(String)
                .filter((option) =>
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
            dispatch(clearFilterCategory(category));

            // Create updated filters object for API call
            const updatedFilters = {
                ...filterValues,
                [category]: []
            };

            // Call API immediately with updated filters
            try {
                await getRecordData(updatedFilters);
            } catch (error) {
                console.error("Clear selection API error:", error);
            }
        },
        [dispatch, filterValues, getRecordData]
    );

    const handleClearAllFilters = useCallback(
        async () => {
            setIsLoading(true);
            try {
                // Clear all filter values
                Object.keys(filterValues).forEach(category => {
                    dispatch(clearFilterCategory(category));
                });

                // Clear search terms
                setCategorySearchTerms({});

                // Call API with empty filters (initial payload)
                await getRecordData({});
            } catch (error) {
                console.error("Clear all filters error:", error);
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
            try {
                await getRecordData();
            } catch (error) {
                console.error("Apply filters error:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [getRecordData]
    );

    const handleAccordionChange = useCallback(
        (value: string) => setOpenAccordionItem((prev) => (value === prev ? "" : value)),
        []
    );

    const getFilteredOptions = useCallback(
        (category: string, options: any[] = []) => {
            const searchTerm = categorySearchTerms[category] || "";
            return options
                .map(String)
                .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));
        },
        [categorySearchTerms]
    );

    const FilterPanelContent = useMemo(
        () => (
            <Card className="rounded-xl shadow-lg border-none bg-white text-foreground flex flex-col min-w-[15rem] sticky top-5 z-40 max-h-[calc(100vh-2rem)]">
                <CardHeader className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold">Filters</CardTitle>
                        <Button
                            onClick={handleClearAllFilters}
                            disabled={isLoading}
                            variant="outline"
                            size="sm"
                            className="text-xs px-3 py-1 h-8 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
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
                        {defaultFilterKeys.map((category) => {
                            const options = filterOptions[category] || [];
                            const filteredOptions = getFilteredOptions(category, options);
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
                                                        filteredOptions.every((option) =>
                                                            filterValues[category]?.includes(option)
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
                                                    filteredOptions.map((option) => (
                                                        <Label
                                                            key={option}
                                                            htmlFor={`${category}-${option}`}
                                                            className="flex items-center space-x-4 text-sm text-gray-600 cursor-pointer py-1 px-2 rounded-md hover:bg-accent/50 transition-colors duration-150"
                                                        >
                                                            <Checkbox
                                                                id={`${category}-${option}`}
                                                                checked={filterValues[category]?.includes(option) || false}
                                                                onCheckedChange={(checked: boolean) =>
                                                                    handleCheckboxChange(category, option, checked)
                                                                }
                                                                disabled={isLoading}
                                                                className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                                                            />
                                                            {option}
                                                        </Label>
                                                    ))
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
                                                className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Applying...
                                                    </div>
                                                ) : (
                                                    'Apply Filter'
                                                )}
                                            </Button>
                                        </div>
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
            handleAccordionChange,
            handleSearchChange,
            handleSelectAll,
            handleClearSelection,
            handleClearAllFilters,
            handleCheckboxChange,
            getFilteredOptions,
            filterOptions,
            isLoading,
        ]
    );

    return (
        <div className="flex text-foreground flex-1">
            <aside className="hidden md:block w-full max-w-[20rem]">{FilterPanelContent}</aside>
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
    );
}