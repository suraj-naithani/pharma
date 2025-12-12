// Utility functions for HS Code hierarchical structure

export interface HSCodeHierarchy {
    [chapter: string]: {
        [heading: string]: {
            [subheading: string]: string[];
        };
    };
}

/**
 * Transforms flat HS Code array into hierarchical structure
 * @param hsCodes - Array of HS Code strings (e.g., ["28011000", "28012000", ...])
 * @returns Hierarchical structure grouped by chapter, heading, and subheading
 */
export function transformHSCodeToHierarchy(hsCodes: string[]): HSCodeHierarchy {
    const hierarchy: HSCodeHierarchy = {};

    hsCodes.forEach(code => {
        if (!code || code.length < 6) return; // Skip invalid codes

        const chapter = code.substring(0, 2);
        const heading = code.substring(0, 4);
        const subheading = code.substring(0, 6);

        // Initialize chapter if not exists
        if (!hierarchy[chapter]) {
            hierarchy[chapter] = {};
        }

        // Initialize heading if not exists
        if (!hierarchy[chapter][heading]) {
            hierarchy[chapter][heading] = {};
        }

        // Initialize subheading if not exists
        if (!hierarchy[chapter][heading][subheading]) {
            hierarchy[chapter][heading][subheading] = [];
        }

        // Add the full code to the subheading
        hierarchy[chapter][heading][subheading].push(code);
    });

    return hierarchy;
}

/**
 * Flattens hierarchical HS Code structure back to array
 * @param hierarchy - Hierarchical HS Code structure
 * @returns Flat array of HS Code strings
 */
export function flattenHSCodeHierarchy(hierarchy: HSCodeHierarchy): string[] {
    const flatCodes: string[] = [];

    Object.values(hierarchy).forEach(chapterData => {
        Object.values(chapterData).forEach(headingData => {
            Object.values(headingData).forEach(subheadingCodes => {
                flatCodes.push(...subheadingCodes);
            });
        });
    });

    return flatCodes;
}

/**
 * Gets selected codes from hierarchical structure based on selected items
 * @param hierarchy - Hierarchical HS Code structure
 * @param selectedItems - Array of selected items (can be chapters, headings, subheadings, or full codes)
 * @returns Array of full HS Code strings that match the selection
 */
export function getSelectedCodesFromHierarchy(
    hierarchy: HSCodeHierarchy,
    selectedItems: string[]
): string[] {
    const selectedCodes: string[] = [];

    selectedItems.forEach(item => {
        if (item.length === 2) {
            // Chapter level selection
            const chapterData = hierarchy[item];
            if (chapterData) {
                Object.values(chapterData).forEach(headingData => {
                    Object.values(headingData).forEach(subheadingCodes => {
                        selectedCodes.push(...subheadingCodes);
                    });
                });
            }
        } else if (item.length === 4) {
            // Heading level selection
            const chapter = item.substring(0, 2);
            const chapterData = hierarchy[chapter];
            if (chapterData && chapterData[item]) {
                Object.values(chapterData[item]).forEach(subheadingCodes => {
                    selectedCodes.push(...subheadingCodes);
                });
            }
        } else if (item.length === 6) {
            // Subheading level selection
            const chapter = item.substring(0, 2);
            const heading = item.substring(0, 4);
            const chapterData = hierarchy[chapter];
            if (chapterData && chapterData[heading] && chapterData[heading][item]) {
                selectedCodes.push(...chapterData[heading][item]);
            }
        } else {
            // Full code selection (8+ digits)
            selectedCodes.push(item);
        }
    });

    return [...new Set(selectedCodes)]; // Remove duplicates
}

/**
 * Checks if a parent item should be checked based on its children's selection state
 * @param childrenData - The children data structure
 * @param selectedItems - Array of currently selected items
 * @returns Object with checked state and indeterminate state
 */
export function getParentCheckState(
    childrenData: any,
    selectedItems: string[]
): { checked: boolean; indeterminate: boolean } {
    const allChildCodes: string[] = [];

    if (typeof childrenData === 'object' && !Array.isArray(childrenData)) {
        // For chapters and headings
        Object.values(childrenData).forEach((data: any) => {
            if (Array.isArray(data)) {
                allChildCodes.push(...data);
            } else {
                Object.values(data).forEach((codes: any) => {
                    if (Array.isArray(codes)) {
                        allChildCodes.push(...codes);
                    }
                });
            }
        });
    } else if (Array.isArray(childrenData)) {
        // For subheadings
        allChildCodes.push(...childrenData);
    }

    const selectedChildCodes = allChildCodes.filter(code => selectedItems.includes(code));
    const isFullySelected = selectedChildCodes.length === allChildCodes.length && allChildCodes.length > 0;
    const isPartiallySelected = selectedChildCodes.length > 0 && selectedChildCodes.length < allChildCodes.length;

    return {
        checked: isFullySelected,
        indeterminate: isPartiallySelected
    };
}

/**
 * Gets the highest level parent groups from selected codes
 * @param selectedCodes - Array of selected HS Code strings
 * @param hierarchy - Hierarchical HS Code structure
 * @returns Array of parent group strings (chapters, headings, or subheadings) to display
 */
export function getParentGroupsFromSelectedCodes(
    selectedCodes: string[],
    hierarchy: HSCodeHierarchy
): string[] {
    if (selectedCodes.length === 0) return [];

    const parentGroups = new Set<string>();
    const processedCodes = new Set<string>();
    const selectedCodesSet = new Set(selectedCodes);

    // First, check all chapters to see if they're fully selected
    Object.keys(hierarchy).forEach(chapter => {
        const chapterCodes = getSelectedCodesFromHierarchy(hierarchy, [chapter]);
        if (chapterCodes.length > 0 && chapterCodes.every(c => selectedCodesSet.has(c))) {
            parentGroups.add(chapter);
            chapterCodes.forEach(c => processedCodes.add(c));
        }
    });

    // Then, check all headings (only those not already covered by chapters)
    Object.keys(hierarchy).forEach(chapter => {
        Object.keys(hierarchy[chapter]).forEach(heading => {
            // Skip if this heading is already covered by a chapter
            const chapterCodes = getSelectedCodesFromHierarchy(hierarchy, [chapter]);
            const isChapterSelected = chapterCodes.length > 0 && 
                chapterCodes.every(c => selectedCodesSet.has(c));
            
            if (!isChapterSelected) {
                const headingCodes = getSelectedCodesFromHierarchy(hierarchy, [heading]);
                if (headingCodes.length > 0 && 
                    headingCodes.every(c => selectedCodesSet.has(c)) &&
                    headingCodes.every(c => !processedCodes.has(c))) {
                    parentGroups.add(heading);
                    headingCodes.forEach(c => processedCodes.add(c));
                }
            }
        });
    });

    // Then, check all subheadings (only those not already covered)
    Object.keys(hierarchy).forEach(chapter => {
        Object.keys(hierarchy[chapter]).forEach(heading => {
            // Check if heading is already selected
            const headingCodes = getSelectedCodesFromHierarchy(hierarchy, [heading]);
            const isHeadingSelected = headingCodes.length > 0 && 
                headingCodes.every(c => selectedCodesSet.has(c)) &&
                headingCodes.every(c => processedCodes.has(c));
            
            if (!isHeadingSelected) {
                Object.keys(hierarchy[chapter][heading]).forEach(subheading => {
                    const subheadingCodes = getSelectedCodesFromHierarchy(hierarchy, [subheading]);
                    if (subheadingCodes.length > 0 && 
                        subheadingCodes.every(c => selectedCodesSet.has(c)) &&
                        subheadingCodes.every(c => !processedCodes.has(c))) {
                        parentGroups.add(subheading);
                        subheadingCodes.forEach(c => processedCodes.add(c));
                    }
                });
            }
        });
    });

    // Finally, add any remaining individual codes
    selectedCodes.forEach(code => {
        if (!processedCodes.has(code)) {
            parentGroups.add(code);
        }
    });

    return Array.from(parentGroups).sort();
}

/**
 * Counts the total number of codes under a specific item in the hierarchy
 * @param hierarchy - Hierarchical HS Code structure
 * @param item - The item to count (chapter, heading, or subheading)
 * @returns Total count of codes under the item
 */
export function getCountForItem(hierarchy: HSCodeHierarchy, item: string): number {
    if (item.length === 2) {
        // Chapter level
        const chapterData = hierarchy[item];
        if (!chapterData) return 0;
        let count = 0;
        Object.values(chapterData).forEach(headingData => {
            Object.values(headingData).forEach(subheadingCodes => {
                count += subheadingCodes.length;
            });
        });
        return count;
    } else if (item.length === 4) {
        // Heading level
        const chapter = item.substring(0, 2);
        const chapterData = hierarchy[chapter];
        if (!chapterData || !chapterData[item]) return 0;
        let count = 0;
        Object.values(chapterData[item]).forEach(subheadingCodes => {
            count += subheadingCodes.length;
        });
        return count;
    } else if (item.length === 6) {
        // Subheading level
        const chapter = item.substring(0, 2);
        const heading = item.substring(0, 4);
        const chapterData = hierarchy[chapter];
        if (!chapterData || !chapterData[heading] || !chapterData[heading][item]) return 0;
        return chapterData[heading][item].length;
    }
    return 0;
}