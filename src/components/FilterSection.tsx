import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { searchTypeOptions } from "@/constants/config"
import { useLazyGetFilterValuesQuery, useLazyGetSuggestionsQuery, useLazyGetSummaryStatsQuery, useLazyGetTopBuyersByQuantityQuery, useLazyGetTopBuyersByValueQuery, useLazyGetTopCountryByQuantityQuery, useLazyGetTopCountryByValueQuery, useLazyGetTopHSCodeByQuantityQuery, useLazyGetTopHSCodeByValueQuery, useLazyGetTopIndianPortByQuantityQuery, useLazyGetTopIndianPortByValueQuery, useLazyGetTopSuppliersByQuantityQuery, useLazyGetTopSuppliersByValueQuery, useLazyGetTopYearsByQuantityQuery, useLazyGetTopYearsByValueQuery } from "@/redux/api/dashboardAPi"
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
    setTopYearsByValue
} from "@/redux/reducers/dashboardReducer"
import { addSearchItem, removeSearchItem, setEndDate, setSelectedChapters, setSelectedDataType, setSelectedSearchType, setSelectedToggle, setShowSuggestions, setStartDate, toggleChapter } from "@/redux/reducers/filterReducer"
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

    const [triggerTopBuyersByQuantity] = useLazyGetTopBuyersByQuantityQuery();
    const [triggerTopYearsByQuantity] = useLazyGetTopYearsByQuantityQuery();
    const [triggerTopHSCodeByQuantity] = useLazyGetTopHSCodeByQuantityQuery();
    const [triggerTopSuppliersByQuantity] = useLazyGetTopSuppliersByQuantityQuery();
    const [triggerTopCountryByQuantity] = useLazyGetTopCountryByQuantityQuery();
    const [triggerTopIndianPortByQuantity] = useLazyGetTopIndianPortByQuantityQuery();

    const [triggerTopBuyersByValue] = useLazyGetTopBuyersByValueQuery();
    const [triggerTopYearsByValue] = useLazyGetTopYearsByValueQuery();
    const [triggerTopHSCodeByValue] = useLazyGetTopHSCodeByValueQuery();
    const [triggerTopSuppliersByValue] = useLazyGetTopSuppliersByValueQuery();
    const [triggerTopCountryByValue] = useLazyGetTopCountryByValueQuery();
    const [triggerTopIndianPortByValue] = useLazyGetTopIndianPortByValueQuery();

    const [triggerSummaryStats] = useLazyGetSummaryStatsQuery();
    const [triggerFilterValues] = useLazyGetFilterValuesQuery();

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

        const data = {
            informationOf: filterState.selectedToggle,
            dataType: filterState.selectedDataType,
            duration: `${moment(filterState.dateRange.from).format("DD/MM/YYYY")}-${moment(filterState.dateRange.to).format("DD/MM/YYYY")}`,
            chapter: filterState.selectedChapters,
            searchType: filterState.selectedSearchType,
            searchValue: filterState.selectedSearchItems.length > 0 ? filterState.selectedSearchItems : [],
            filters: filterState.filters || {},
            session: localStorage.getItem("sessionId"),
        };

        const toastId = toast.loading("Fetching data...");

        try {
            const [summaryRes, filtersRes] = await Promise.all([
                triggerSummaryStats(data).unwrap(),
                triggerFilterValues(data).unwrap(),
            ]);
            dispatch(setSummaryStats(summaryRes.metrics.summary));
            dispatch(setFilterData(filtersRes.filters));

            triggerTopBuyersByQuantity(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopBuyersByQuantity(res.metrics.topBuyersByQuantity))
                );

            triggerTopYearsByQuantity(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopYearsByQuantity(res.metrics.topYearByQuantity))
                );

            triggerTopHSCodeByQuantity(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopHSCodeByQuantity(res.metrics.topHSCodeByQuantity))
                );

            triggerTopSuppliersByQuantity(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopSuppliersByQuantity(res.metrics.topSuppliersByQuantity))
                );

            triggerTopCountryByQuantity(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopCountryByQuantity(res.metrics.topCountryByQuantity))
                );

            triggerTopIndianPortByQuantity(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopIndianPortByQuantity(res.metrics.topIndianPortByQuantity))
                );

            triggerTopBuyersByValue(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopBuyersByValue(res.metrics.topBuyersByValue))
                );

            triggerTopYearsByValue(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopYearsByValue(res.metrics.topYearsByValue))
                );

            triggerTopHSCodeByValue(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopHSCodeByValue(res.metrics.topHSCodeByValue))
                );

            triggerTopSuppliersByValue(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopSuppliersByValue(res.metrics.topSuppliersByValue))
                );

            triggerTopCountryByValue(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopCountryByValue(res.metrics.topCountryByValue))
                );

            triggerTopIndianPortByValue(data)
                .unwrap()
                .then((res) =>
                    dispatch(setTopIndianPortByValue(res.metrics.topIndianPortByValue))
                );
            toast.success("Data fetched successfully!", { id: toastId });
        } catch (err: any) {
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

    useEffect(() => {
        if (!currentInput.trim()) return;

        const debounceTimer = setTimeout(() => {
            triggerSuggestions({
                informationOf: filterState.selectedToggle || "export",
                chapter: filterState.selectedChapters?.[0] || "",
                searchType: filterState.selectedSearchType,
                suggestion: currentInput,
                session: localStorage.getItem("sessionId"),
            });
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [currentInput, filterState.selectedToggle, filterState.selectedChapters, filterState.selectedSearchType]);

    return (
        <div className="p-4 w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-7">
                <ToggleGroup
                    type="single"
                    value={filterState.selectedToggle}
                    onValueChange={(value) => {
                        if (value) dispatch(setSelectedToggle(value as "import" | "export"));
                    }}
                    className="rounded-lg border border-gray-200 overflow-hidden"
                >
                    <ToggleGroupItem
                        value="import"
                        aria-label="Toggle import"
                        className="px-4 py-2 data-[state=on]:bg-blue-800 data-[state=on]:text-white data-[state=off]:bg-white data-[state=off]:text-gray-700 h-auto"
                    >
                        Import
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="export"
                        aria-label="Toggle export"
                        className="px-4 py-2 data-[state=on]:bg-blue-800 data-[state=on]:text-white data-[state=off]:bg-white data-[state=off]:text-gray-700 h-auto"
                    >
                        Export
                    </ToggleGroupItem>
                </ToggleGroup>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`w-[245px] justify-start item-center text-left font-normal border border-gray-200 bg-white rounded-lg ${!filterState.dateRange.from ? "text-gray-500" : ""
                                }`}
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {filterState.dateRange.from ? (
                                filterState.dateRange.to ? (
                                    `${moment(new Date(filterState.dateRange.from)).format("D MMM YYYY")} - ${moment(
                                        new Date(filterState.dateRange.to)
                                    ).format("D MMM YYYY")}`
                                ) : (
                                    moment(new Date(filterState.dateRange.from)).format("D MMM YYYY")
                                )
                            ) : (
                                <span>Select Date Range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 border border-gray-200 bg-white" align="start">
                        <div className="grid gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-[180px] justify-start text-left bg-white border-gray-200 font-normal hover:bg-[#f4f4f5] ${!filterState.dateRange.from ? "text-gray-500" : ""
                                                }`}
                                        >
                                            <CalendarDays className="mr-2 h-4 w-4" />
                                            {filterState.dateRange.from ? (
                                                moment(new Date(filterState.dateRange.from)).format("D MMM YYYY")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white border border-gray-200">
                                        <Calendar
                                            mode="single"
                                            selected={filterState.dateRange.from ? new Date(filterState.dateRange.from) : undefined}
                                            onSelect={(date) =>
                                                dispatch(
                                                    setStartDate(date ? date.toISOString() : moment(new Date(2020, 5, 11)).format("YYYY-MM-DD"))
                                                )
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-[180px] justify-start text-left border-gray-200 font-normal hover:bg-[#f4f4f5] ${!filterState.dateRange.to ? "text-gray-500" : ""
                                                }`}
                                        >
                                            <CalendarDays className="mr-2 h-4 w-4" />
                                            {filterState.dateRange.to ? (
                                                moment(new Date(filterState.dateRange.to)).format("D MMM YYYY")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white border border-gray-200">
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
                    </PopoverContent>
                </Popover>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[140px] justify-between border outline-none border-gray-200 bg-white rounded-lg">
                            {filterState.selectedDataType || "Data Type"} <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[140px] border border-gray-200 bg-white">
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
                            className="w-[180px] relative rounded-lg h-10 px-3 bg-white border border-gray-200 rounded-lg"
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
                    <DropdownMenuContent className="w-[180px] bg-white border border-gray-200">
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
                        <Button variant="outline" className="w-[180px] justify-between rounded-lg border border-gray-200 bg-white">
                            {filterState.selectedSearchType || "Search Type"} <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                {type}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative flex-grow min-w-[550px] max-w-sm">
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
                                <div className="p-2 text-sm text-gray-500">Loading...</div>
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
                                    {suggestions.data.map(({ title }: { title: string }, i: any) => (
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
                        className="absolute right-0 top-0 h-full bg-blue-700 hover:bg-blue-800 text-white rounded-tl-none rounded-bl-none px-4 border-none cursor-pointer disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="outline" size="icon" className="rounded-lg border border-gray-200 bg-white hover:bg-gray-100">
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}