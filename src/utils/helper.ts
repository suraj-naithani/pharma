import numeral from 'numeral';

type RawDataItem = {
    count: number;
    [key: string]: any;
    total: number;
};

type TransformedData = {
    labels: string[];
    data: number[];
    trendData: number[];
};

export function transformDynamicData(
    rawInput: RawDataItem | RawDataItem[],
    dynamicKey: string,
): TransformedData {
    const rawData = Array.isArray(rawInput) ? rawInput : [rawInput];

    if (!rawData.length) return { labels: [], data: [], trendData: [] };

    const data = rawData.map((item) => item.total ?? 0);
    const labels = rawData.map((item) => item[dynamicKey] ?? 0);
    const trendData = rawData.map((item) => item.count ?? 0);

    return { labels, data, trendData };
}

export const formatNumber = (value: number | undefined | null): string => {
  if (value === null || value === undefined || isNaN(value)) return "0";
    return numeral(value).format("0.[0]a").toUpperCase();
};
