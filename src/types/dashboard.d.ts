export interface FilterState {
    dateRange: { from: string; to: string; };
    selectedDataType: string | null;
    selectedChapters: number[];
    selectedSearchType: string | null;
    searchQuery: string;
    selectedSearchItems: string[];
    showSuggestions: boolean;
    selectedToggle: string;
    filters?: {
        [key: string]: string[];
    };
    session: string;
}

// export interface ApiResponse {
//     statusCode: number;
//     filters: Filters;
//     metrics: Metrics;
// }

export interface DashboardState {
    summary: Summary | null;
    filter: Filters | null;

    topBuyersByQuantity: Buyer[] | null;
    topBuyersByValue: Buyer[] | null;

    topSuppliersByQuantity: Supplier[] | null;
    topSuppliersByValue: Supplier[] | null;

    topCountryByQuantity: Country[] | null;
    topCountryByValue: Country[] | null;

    topIndianPortByQuantity: Port[] | null;
    topIndianPortByValue: Port[] | null;

    topYearsByQuantity: Year[] | null;
    topYearsByValue: Year[] | null;

    topHSCodeByQuantity: HSCode[] | null;
    topHSCodeByValue: HSCode[] | null;
}

export interface Filters {
    CASNumber: string[];
    Currency: string[];
    DateOfShipment: string[];
    ForeignCompany: number;
    ForeignCountry: number;
    HsCode: string[];
    IndianCompany: number;
    IndianPort: string[];
    ProductDescription: number;
    ProductName: string[];
    Quantity: string[];
    QuantityUnits: string[];
    UnitPrice: string[];
}

// export interface Metrics {
//     summary: Summary;
//     topBuyersByQuantity: Buyer[];
//     topBuyersByValue: Buyer[];
//     topCountryByQuantity: Country[];
//     topCountryByValue: Country[];
//     topIndianPortByQuantity: Port[];
//     topIndianPortByValue: Port[];
//     topSuppliersByQuantity: Supplier[];
//     topSuppliersByValue: Supplier[];
//     topYearsByQuantity: Year[];
//     topYearsByValue: Year[];
//     topHSCodeByQuantity: HSCode[];
//     topHSCodeByValue: HSCode[];
// }

export interface Summary {
    totalQuantity: number;
    totalRecords: number;
    totalValueUSD: number;
    uniqueBuyers: number;
    uniqueSuppliers: number;
}

export interface Buyer {
    buyer: string;
    count: number;
    total: number;
}

export interface Country {
    buyerCountry: string;
    count: number;
    total: number;
}

export interface Port {
    count: number
    portOfOrigin: string
    total: number
}

export interface Supplier {
    count: number
    supplier: string
    total: number
}

export interface Year {
    count: number
    year: string
    total: number
}

export interface HSCode {
    count: number
    H_S_Code: string
    total: number
}
