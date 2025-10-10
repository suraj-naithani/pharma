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
