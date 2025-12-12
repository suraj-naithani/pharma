import { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
    transformHSCodeToHierarchy,
    getSelectedCodesFromHierarchy,
    getParentCheckState,
    getCountForItem,
    type HSCodeHierarchy
} from '@/utils/hsCodeUtils';

interface HierarchicalHSCodeProps {
    hsCodes: string[];
    selectedCodes: string[];
    onSelectionChange: (selectedCodes: string[]) => void;
    disabled?: boolean;
}

interface ExpandedState {
    [key: string]: boolean;
}

export default function HierarchicalHSCode({
    hsCodes,
    selectedCodes,
    onSelectionChange,
    disabled = false
}: HierarchicalHSCodeProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState<ExpandedState>({});

    // Transform flat array to hierarchy
    const hierarchy = useMemo(() => transformHSCodeToHierarchy(hsCodes), [hsCodes]);

    // Filter hierarchy based on search term
    const filteredHierarchy = useMemo(() => {
        if (!searchTerm.trim()) return hierarchy;

        const filtered: HSCodeHierarchy = {};
        const searchLower = searchTerm.toLowerCase();

        Object.entries(hierarchy).forEach(([chapter, chapterData]) => {
            Object.entries(chapterData).forEach(([heading, headingData]) => {
                Object.entries(headingData).forEach(([subheading, codes]) => {
                    const matchingCodes = codes.filter(code =>
                        code.toLowerCase().includes(searchLower) ||
                        chapter.includes(searchLower) ||
                        heading.includes(searchLower) ||
                        subheading.includes(searchLower)
                    );

                    if (matchingCodes.length > 0) {
                        if (!filtered[chapter]) filtered[chapter] = {};
                        if (!filtered[chapter][heading]) filtered[chapter][heading] = {};
                        filtered[chapter][heading][subheading] = matchingCodes;
                    }
                });
            });
        });

        return filtered;
    }, [hierarchy, searchTerm]);

    const toggleExpanded = useCallback((key: string) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const handleSelectionChange = useCallback((item: string, checked: boolean) => {
        let newSelection: string[];

        if (checked) {
            // Add item and all its children
            const childCodes = getSelectedCodesFromHierarchy(hierarchy, [item]);
            newSelection = [...new Set([...selectedCodes, ...childCodes])];
        } else {
            // Remove item and all its children
            const childCodes = getSelectedCodesFromHierarchy(hierarchy, [item]);
            newSelection = selectedCodes.filter(code => !childCodes.includes(code));
        }

        onSelectionChange(newSelection);
    }, [hierarchy, selectedCodes, onSelectionChange]);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            const allCodes = getSelectedCodesFromHierarchy(filteredHierarchy,
                Object.keys(filteredHierarchy)
            );
            onSelectionChange([...new Set([...selectedCodes, ...allCodes])]);
        } else {
            const allCodes = getSelectedCodesFromHierarchy(filteredHierarchy,
                Object.keys(filteredHierarchy)
            );
            onSelectionChange(selectedCodes.filter(code => !allCodes.includes(code)));
        }
    }, [filteredHierarchy, selectedCodes, onSelectionChange]);

    const handleClearAll = useCallback(() => {
        onSelectionChange([]);
    }, [onSelectionChange]);

    // Calculate select all state
    const selectAllState = useMemo(() => {
        const allFilteredCodes = getSelectedCodesFromHierarchy(filteredHierarchy,
            Object.keys(filteredHierarchy)
        );
        const selectedFilteredCodes = allFilteredCodes.filter(code => selectedCodes.includes(code));

        return {
            checked: selectedFilteredCodes.length === allFilteredCodes.length && allFilteredCodes.length > 0,
            indeterminate: selectedFilteredCodes.length > 0 && selectedFilteredCodes.length < allFilteredCodes.length
        };
    }, [filteredHierarchy, selectedCodes]);

    return (
        <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search HS Codes..."
                    className="pl-9 pr-3 py-2 rounded-md border border-input focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled}
                />
            </div>

            {/* Select All / Clear All Controls */}
            <div className="flex items-center justify-between px-2 py-1 border-b border-gray-200">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                        checked={selectAllState.checked}
                        // @ts-ignore - indeterminate is a valid prop but not in types
                        indeterminate={selectAllState.indeterminate}
                        onCheckedChange={handleSelectAll}
                        disabled={disabled}
                        className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                    />
                    Select All
                </label>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={disabled || selectedCodes.length === 0}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    Clear All
                </Button>
            </div>

            {/* Hierarchical Tree */}
            <ScrollArea className="max-h-96 overflow-auto">
                <div className="space-y-1 p-2">
                    {Object.entries(filteredHierarchy).map(([chapter, chapterData]) => {
                        const chapterKey = `chapter-${chapter}`;
                        const isChapterExpanded = expanded[chapterKey];
                        const chapterCheckState = getParentCheckState(chapterData, selectedCodes);

                        return (
                            <div key={chapter} className="space-y-1">
                                {/* Chapter Level */}
                                <div className="flex items-center justify-between gap-2 py-1 px-2 hover:bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleExpanded(chapterKey)}
                                            className="p-1 hover:bg-gray-200 rounded"
                                            disabled={disabled}
                                        >
                                            {isChapterExpanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </button>
                                        <Checkbox
                                            checked={chapterCheckState.checked}
                                            // @ts-ignore
                                            indeterminate={chapterCheckState.indeterminate}
                                            onCheckedChange={(checked) => handleSelectionChange(chapter, !!checked)}
                                            disabled={disabled}
                                            className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                                        />
                                        <span className="text-sm font-medium">{chapter}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {getCountForItem(hierarchy, chapter)}
                                    </span>
                                </div>

                                {/* Headings Level */}
                                {isChapterExpanded && (
                                    <div className="ml-3 space-y-1">
                                        {Object.entries(chapterData).map(([heading, headingData]) => {
                                            const headingKey = `heading-${heading}`;
                                            const isHeadingExpanded = expanded[headingKey];
                                            const headingCheckState = getParentCheckState(headingData, selectedCodes);

                                            return (
                                                <div key={heading} className="space-y-1">
                                                    {/* Heading Level */}
                                                    <div className="flex items-center justify-between gap-2 py-1 px-2 hover:bg-gray-50 rounded">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => toggleExpanded(headingKey)}
                                                                className="p-1 hover:bg-gray-200 rounded"
                                                                disabled={disabled}
                                                            >
                                                                {isHeadingExpanded ? (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronRight className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                            <Checkbox
                                                                checked={headingCheckState.checked}
                                                                // @ts-ignore
                                                                indeterminate={headingCheckState.indeterminate}
                                                                onCheckedChange={(checked) => handleSelectionChange(heading, !!checked)}
                                                                disabled={disabled}
                                                                className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                                                            />
                                                            <span className="text-sm">{heading}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                            {getCountForItem(hierarchy, heading)}
                                                        </span>
                                                    </div>

                                                    {/* Subheadings Level */}
                                                    {isHeadingExpanded && (
                                                        <div className="ml-3 space-y-1">
                                                            {Object.entries(headingData).map(([subheading, codes]) => {
                                                                const subheadingKey = `subheading-${subheading}`;
                                                                const isSubheadingExpanded = expanded[subheadingKey];
                                                                const subheadingCheckState = getParentCheckState(codes, selectedCodes);

                                                                return (
                                                                    <div key={subheading} className="space-y-1">
                                                                        {/* Subheading Level */}
                                                                        <div className="flex items-center justify-between gap-2 py-1 px-2 hover:bg-gray-50 rounded">
                                                                            <div className="flex items-center gap-2">
                                                                                <button
                                                                                    onClick={() => toggleExpanded(subheadingKey)}
                                                                                    className="p-1 hover:bg-gray-200 rounded"
                                                                                    disabled={disabled}
                                                                                >
                                                                                    {isSubheadingExpanded ? (
                                                                                        <ChevronDown className="h-4 w-4" />
                                                                                    ) : (
                                                                                        <ChevronRight className="h-4 w-4" />
                                                                                    )}
                                                                                </button>
                                                                                <Checkbox
                                                                                    checked={subheadingCheckState.checked}
                                                                                    // @ts-ignore
                                                                                    indeterminate={subheadingCheckState.indeterminate}
                                                                                    onCheckedChange={(checked) => handleSelectionChange(subheading, !!checked)}
                                                                                    disabled={disabled}
                                                                                    className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                                                                                />
                                                                                <span className="text-sm">{subheading}</span>
                                                                            </div>
                                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                                {getCountForItem(hierarchy, subheading)}
                                                                            </span>
                                                                        </div>

                                                                        {/* Individual Codes Level */}
                                                                        {isSubheadingExpanded && (
                                                                            <div className="ml-3 space-y-1">
                                                                                {codes.map((code) => (
                                                                                    <div key={code} className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded">
                                                                                        <div className="w-6" /> {/* Spacer for alignment */}
                                                                                        <Checkbox
                                                                                            checked={selectedCodes.includes(code)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                if (checked) {
                                                                                                    onSelectionChange([...selectedCodes, code]);
                                                                                                } else {
                                                                                                    onSelectionChange(selectedCodes.filter(c => c !== code));
                                                                                                }
                                                                                            }}
                                                                                            disabled={disabled}
                                                                                            className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                                                                                        />
                                                                                        <span className="text-sm font-mono">{code}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

        </div>
    );
}
