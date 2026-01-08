export interface Company {
    id: number;
    name: string;
    email: string;
    contactPerson: string;
    address: string;
    phone: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateCompanyData {
    name?: string;
    contactPerson?: string;
    address?: string;
    phone?: string;
    status?: string;
}

export interface CreateCompanyData {
    name: string;
    email: string;
    contactPerson: string;
    address: string;
    phone: string;
}

export interface CreateCompanyResponse {
    statusCode: number;
    message: string;
    data: Company;
}

export interface CompaniesResponse {
    statusCode: number;
    data: Company[];
}

export interface UpdateCompanyResponse {
    statusCode: number;
    message: string;
    data: Company;
}

