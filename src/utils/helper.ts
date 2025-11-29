import numeral from 'numeral';

type RawDataItem = {
    count: number;
    [key: string]: unknown;
    total: number;
    totalQuantity?: number;
    totalValue?: number;
};

type TransformedData = {
    labels: string[];
    data: number[];
    trendData: number[];
};

export function transformDynamicData(
    rawInput: RawDataItem | RawDataItem[],
    dynamicKey: string,
    dataType: 'quantity' | 'value' = 'quantity'
): TransformedData {
    const rawData = Array.isArray(rawInput) ? rawInput : [rawInput];

    if (!rawData.length) return { labels: [], data: [], trendData: [] };

    const data = rawData.map((item) => {
        if (dataType === 'quantity') {
            return item.totalQuantity ?? item.total ?? 0;
        } else {
            return item.totalValue ?? item.total ?? 0;
        }
    });

    const labels = rawData.map((item) => String(item[dynamicKey] ?? 0));
    const trendData = rawData.map((item) => item.count ?? 0);

    return { labels, data, trendData };
}

export const formatNumber = (value: number | undefined | null): string => {
    if (value === null || value === undefined || isNaN(value)) return "0";
    return numeral(value).format("0.[0]a").toUpperCase();
};

export const convertFiltersToUrlParams = (filters?: Record<string, string[] | { min: number; max: number }>): Record<string, string> => {
    const urlParams: Record<string, string> = {};

    if (!filters) return urlParams;

    Object.keys(filters).forEach((key) => {
        const filterValues = filters[key];

        // Handle range filters (objects with min/max)
        if (filterValues && typeof filterValues === 'object' && 'min' in filterValues && 'max' in filterValues) {
            const rangeFilter = filterValues as { min: number; max: number };
            urlParams[`filters[${key}][min]`] = rangeFilter.min.toString();
            urlParams[`filters[${key}][max]`] = rangeFilter.max.toString();
        }
        // Handle regular array filters
        else if (Array.isArray(filterValues) && filterValues.length > 0) {
            urlParams[`filters[${key}]`] = filterValues.join(',');
        }
    });

    return urlParams;
};

export const transformSearchTypeForPayload = (searchType: string | null, informationOf: string): string | null => {
    if (!searchType) return searchType;

    if (informationOf === 'export') {
        if (searchType === 'Indian Company (Importer)') {
            return 'buyer';
        }
        if (searchType === 'Foreign Company (Exporter)') {
            return 'seller';
        }
    } else if (informationOf === 'import') {
        if (searchType === 'Indian Company (Importer)') {
            return 'seller';
        }
        if (searchType === 'Foreign Company (Exporter)') {
            return 'buyer';
        }
    }

    return searchType;
};