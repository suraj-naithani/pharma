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

export interface DashboardState {
    summary: Summary | null;
    filter: Filters | null;
    topBuyersByQuantity: any | null;
    topBuyersByValue: any | null;
    topYearsByQuantity: any | null;
    topYearsByValue: any | null;
    topHSCodeByQuantity: any | null;
    topHSCodeByValue: any | null;
    topSuppliersByQuantity: any | null;
    topSuppliersByValue: any | null;
    topCountryByQuantity: any | null;
    topCountryByValue: any | null;
    topIndianPortByQuantity: any | null;
    topIndianPortByValue: any | null;
    valueMetrics: any | null;
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