import type { IDataObject } from 'n8n-workflow';

// API Response types
export interface ITwentyApiResponse {
	data: IDataObject | IDataObject[];
	pageInfo?: {
		hasNextPage: boolean;
		endCursor: string;
	};
}

// Company types
export interface ICompany {
	id?: string;
	name: string;
	domainName?: string;
	address?: string;
	employees?: number;
	linkedinUrl?: string;
	xUrl?: string;
	annualRecurringRevenue?: number;
	idealCustomerProfile?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

// Person types
export interface IPerson {
	id?: string;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	city?: string;
	jobTitle?: string;
	linkedinUrl?: string;
	avatarUrl?: string;
	companyId?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Opportunity types
export type OpportunityStage = 'NEW' | 'SCREENING' | 'MEETING' | 'PROPOSAL' | 'CUSTOMER' | string;

export interface IOpportunity {
	id?: string;
	name: string;
	amount?: number;
	closeDate?: string;
	stage?: OpportunityStage;
	companyId?: string;
	pointOfContactId?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Note types
export interface INote {
	id?: string;
	title: string;
	body: string;
	position?: number;
	createdAt?: string;
	updatedAt?: string;
}

// Task types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface ITask {
	id?: string;
	title: string;
	body?: string;
	status?: TaskStatus;
	dueAt?: string;
	assigneeId?: string;
	position?: number;
	createdAt?: string;
	updatedAt?: string;
}

// Search types
export type SearchObjectType = 'people' | 'companies' | 'opportunities' | 'notes' | 'tasks';

export interface ISearchResult {
	objectType: SearchObjectType;
	records: IDataObject[];
}

// Credentials
export interface ITwentyCrmCredentials {
	apiUrl: string;
	apiKey: string;
}

// Resource types for node
export type TwentyResource = 'company' | 'person' | 'opportunity' | 'note' | 'task' | 'search';

export type TwentyOperation = 'create' | 'delete' | 'get' | 'getAll' | 'update' | 'search';
