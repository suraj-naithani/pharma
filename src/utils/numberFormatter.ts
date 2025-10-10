/**
 * Formats large numbers into simplified terms (K, M, B, T)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with appropriate suffix
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
    if (value === 0) return '0';

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    // Trillion
    if (absValue >= 1000000000000) {
        return `${sign}${(absValue / 1000000000000).toFixed(decimals)}T`;
    }
    // Billion
    else if (absValue >= 1000000000) {
        return `${sign}${(absValue / 1000000000).toFixed(decimals)}B`;
    }
    // Million
    else if (absValue >= 1000000) {
        return `${sign}${(absValue / 1000000).toFixed(decimals)}M`;
    }
    // Thousand
    else if (absValue >= 1000) {
        return `${sign}${(absValue / 1000).toFixed(0)}K`;
    }
    // Less than thousand
    else {
        return value.toString();
    }
}

/**
 * Formats numbers specifically for chart display
 * Converts values like 10409.8M to 10.4B for better readability
 * @param value - The raw number value
 * @returns Formatted string for chart display
 */
export function formatChartValue(value: number): string {
    return formatLargeNumber(value, 1);
}

/**
 * Example usage and test cases:
 * formatLargeNumber(10409800000) -> "10.4B" (instead of "10409.8M")
 * formatLargeNumber(20819600000) -> "20.8B" (instead of "20819.6M")
 * formatLargeNumber(31229500000) -> "31.2B" (instead of "31229.5M")
 * formatLargeNumber(41639300000) -> "41.6B" (instead of "41639.3M")
 */
