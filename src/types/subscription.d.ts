export interface Subscription {
    id: number;
    clientName: string;
    contactPerson: string;
    email: string;
    subscriptionExport: boolean;
    subscriptionImport: boolean;
    dataTypeRaw: boolean;
    dataTypeClean: boolean;
    chapterNumber: number[];
    productCount: number;
    productlimit: number;
    subscribedDurationDownload: number | null;
    subscribedDurationView: number | null;
    accessValidity: string | null;
    subscriptionExpiryNotification: string | null;
    accessExpiryNotification: string | null;
    subscriptionCost: string;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    startDate: string;
    endDate: string | null;
    paymentMethod: string | null;
    paymentId: string | null;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionResponse {
    statusCode: number;
    data: Subscription[];
}

