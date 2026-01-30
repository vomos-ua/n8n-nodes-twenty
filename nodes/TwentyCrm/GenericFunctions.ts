import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { ITwentyCrmCredentials } from './types';
import {
	DEFAULT_RETRY_CONFIG,
	isRetryableError,
	calculateDelay,
	sleep,
	extractRateLimitInfo,
	getErrorContext,
	type IRetryConfig,
} from './utils/retry';

/**
 * Make an authenticated request to Twenty CRM API
 */
export async function twentyCrmApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = (await this.getCredentials('twentyCrmApi')) as ITwentyCrmCredentials;

	// Ensure apiUrl doesn't have trailing slash
	const baseUrl = credentials.apiUrl.replace(/\/$/, '');

	const options: IRequestOptions = {
		method,
		headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		},
		uri: `${baseUrl}${endpoint}`,
		qs,
		body,
		json: true,
	};

	// Remove empty body for GET/DELETE requests
	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	// Remove empty query string
	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.request(options);
		return response;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: `Twenty CRM API error: ${errorMessage}`,
		});
	}
}

/**
 * Make an authenticated request to Twenty CRM API with automatic retry on transient errors
 */
export async function twentyCrmApiRequestWithRetry(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	retryConfig: Partial<IRetryConfig> = {},
): Promise<any> {
	const config: IRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
		try {
			return await twentyCrmApiRequest.call(this, method, endpoint, body, qs);
		} catch (error) {
			lastError = error as Error;

			// Check if we should retry
			const shouldRetry = isRetryableError(error) && attempt < config.maxRetries;

			if (!shouldRetry) {
				// Enhance error message with context
				const context = getErrorContext(error, attempt, config.maxRetries);
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';

				throw new NodeApiError(this.getNode(), error as JsonObject, {
					message: `Twenty CRM API error: ${context}${errorMessage}`,
				});
			}

			// Calculate delay (respect rate limit headers if present)
			const rateLimitInfo = extractRateLimitInfo(error);
			const delay = rateLimitInfo.retryAfter || calculateDelay(attempt, config);

			// Wait before retrying
			await sleep(delay);
		}
	}

	// Should never reach here, but just in case
	throw lastError;
}

/**
 * Make an authenticated request and return all items (handles pagination)
 */
export async function twentyCrmApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData;
	qs.limit = qs.limit || 60; // Twenty CRM max per page
	qs.offset = 0;

	do {
		responseData = await twentyCrmApiRequestWithRetry.call(this, method, endpoint, body, qs);

		// Handle different response formats
		const data = responseData.data || responseData;
		const items = Array.isArray(data) ? data : [data];

		returnData.push(...items);

		// Move to next page
		qs.offset = (qs.offset as number) + (qs.limit as number);

		// Check if we have more pages
		// Twenty API returns fewer items than limit when we've reached the end
	} while (
		responseData.data &&
		Array.isArray(responseData.data) &&
		responseData.data.length === qs.limit
	);

	return returnData;
}

/**
 * Search across multiple object types
 */
export async function twentyCrmSearchRecords(
	this: IExecuteFunctions,
	query: string,
	objectTypes: string[],
	limit: number = 20,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];

	// Search each object type in parallel
	const searchPromises = objectTypes.map(async (objectType) => {
		try {
			const response = await twentyCrmApiRequestWithRetry.call(
				this,
				'GET',
				`/rest/${objectType}`,
				{},
				{
					search: query,
					limit,
				},
			);

			const data = response.data || response;
			const items = Array.isArray(data) ? data : [data];

			// Add object type to each result
			return items.map((item: IDataObject) => ({
				...item,
				_objectType: objectType,
			}));
		} catch (error) {
			// If search fails for one type, continue with others
			return [];
		}
	});

	const searchResults = await Promise.all(searchPromises);
	results.push(...searchResults.flat());

	return results;
}

/**
 * Build filter query string for Twenty CRM API
 */
export function buildFilterQuery(filters: IDataObject): IDataObject {
	const qs: IDataObject = {};

	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== null && value !== '') {
			qs[key] = value;
		}
	}

	return qs;
}

/**
 * Clean undefined/null values from object (for request body)
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const cleaned: IDataObject = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			cleaned[key] = value;
		}
	}

	return cleaned;
}

/**
 * Transform a simple URL string to Twenty CRM Links object format
 */
export function toLinkObject(url: string | undefined): IDataObject | undefined {
	if (!url || url === '') {
		return undefined;
	}

	// Ensure URL has protocol
	let formattedUrl = url;
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		formattedUrl = `https://${url}`;
	}

	return {
		primaryLinkLabel: '',
		primaryLinkUrl: formattedUrl,
		secondaryLinks: [],
	};
}

/**
 * Transform company fields to Twenty CRM API format
 * Converts simple strings to complex objects where needed
 */
export function transformCompanyFields(fields: IDataObject): IDataObject {
	const transformed: IDataObject = { ...fields };

	// Transform domainName (string → Links object)
	if (typeof transformed.domainName === 'string') {
		const linkObj = toLinkObject(transformed.domainName as string);
		if (linkObj) {
			transformed.domainName = linkObj;
		} else {
			delete transformed.domainName;
		}
	}

	// Transform linkedinUrl → linkedinLink (Links object)
	if (typeof transformed.linkedinUrl === 'string') {
		const linkObj = toLinkObject(transformed.linkedinUrl as string);
		if (linkObj) {
			transformed.linkedinLink = linkObj;
		}
		delete transformed.linkedinUrl;
	}

	// Transform xUrl → xLink (Links object)
	if (typeof transformed.xUrl === 'string') {
		const linkObj = toLinkObject(transformed.xUrl as string);
		if (linkObj) {
			transformed.xLink = linkObj;
		}
		delete transformed.xUrl;
	}

	return transformed;
}

/**
 * Transform person fields to Twenty CRM API format
 * Twenty CRM expects: name: {firstName, lastName}, emails: {primaryEmail}, phones: {primaryPhoneNumber}
 */
export function transformPersonFields(fields: IDataObject): IDataObject {
	const transformed: IDataObject = {};

	// Transform firstName/lastName → name object
	if (fields.firstName || fields.lastName) {
		transformed.name = {
			firstName: fields.firstName || '',
			lastName: fields.lastName || '',
		};
	}

	// Transform email → emails object
	if (typeof fields.email === 'string' && fields.email) {
		transformed.emails = {
			primaryEmail: fields.email,
			additionalEmails: [],
		};
	}

	// Transform phone → phones object
	if (typeof fields.phone === 'string' && fields.phone) {
		transformed.phones = {
			primaryPhoneNumber: fields.phone,
			primaryPhoneCountryCode: '',
			primaryPhoneCallingCode: '',
			additionalPhones: [],
		};
	}

	// Transform linkedinUrl → linkedinLink (Links object)
	if (typeof fields.linkedinUrl === 'string' && fields.linkedinUrl) {
		transformed.linkedinLink = toLinkObject(fields.linkedinUrl);
	}

	// Transform xUrl → xLink (Links object)
	if (typeof fields.xUrl === 'string' && fields.xUrl) {
		transformed.xLink = toLinkObject(fields.xUrl);
	}

	// Copy other fields as-is (jobTitle, city, avatarUrl, companyId, position)
	const directFields = ['jobTitle', 'city', 'avatarUrl', 'companyId', 'position'];
	for (const field of directFields) {
		if (fields[field] !== undefined && fields[field] !== null && fields[field] !== '') {
			transformed[field] = fields[field];
		}
	}

	return transformed;
}

/**
 * Transform note fields to Twenty CRM API format
 * Note: Twenty CRM notes don't have a 'body' field - only 'title' and 'position'
 */
export function transformNoteFields(fields: IDataObject): IDataObject {
	const transformed: IDataObject = { ...fields };

	// Twenty CRM notes API doesn't support 'body' field
	// Remove it to prevent API errors
	if ('body' in transformed) {
		delete transformed.body;
	}

	return transformed;
}

/**
 * Get endpoint for a resource
 */
export function getResourceEndpoint(resource: string): string {
	const endpoints: Record<string, string> = {
		company: '/rest/companies',
		person: '/rest/people',
		opportunity: '/rest/opportunities',
		note: '/rest/notes',
		task: '/rest/tasks',
		activity: '/rest/activities',
		attachment: '/rest/attachments',
	};

	return endpoints[resource] || `/rest/${resource}`;
}

/**
 * Find record by field value (for upsert operations)
 */
export async function findRecordByField(
	this: IExecuteFunctions,
	resource: string,
	fieldName: string,
	fieldValue: string,
): Promise<IDataObject | null> {
	const endpoint = getResourceEndpoint(resource);

	try {
		// Try to search using the API's filter parameter
		const response = await twentyCrmApiRequestWithRetry.call(
			this,
			'GET',
			endpoint,
			{},
			{
				filter: JSON.stringify({ [fieldName]: { eq: fieldValue } }),
				limit: 1,
			},
		);

		const data = response.data || response;
		if (Array.isArray(data) && data.length > 0) {
			return data[0] as IDataObject;
		}

		return null;
	} catch (error) {
		// If filter doesn't work, try search
		try {
			const response = await twentyCrmApiRequestWithRetry.call(
				this,
				'GET',
				endpoint,
				{},
				{
					search: fieldValue,
					limit: 10,
				},
			);

			const data = response.data || response;
			if (Array.isArray(data)) {
				// Find exact match in results
				const match = data.find((item: IDataObject) => {
					const itemValue = item[fieldName];
					if (typeof itemValue === 'string') {
						return itemValue.toLowerCase() === fieldValue.toLowerCase();
					}
					return String(itemValue) === fieldValue;
				});
				return match as IDataObject || null;
			}

			return null;
		} catch (searchError) {
			return null;
		}
	}
}

/**
 * Perform bulk operation (create, update, or delete multiple records)
 */
export async function bulkOperation(
	this: IExecuteFunctions,
	operation: 'create' | 'update' | 'delete',
	resource: string,
	items: IDataObject[],
): Promise<IDataObject[]> {
	const endpoint = getResourceEndpoint(resource);
	const results: IDataObject[] = [];

	// Process items in parallel with concurrency limit
	const concurrencyLimit = 5;
	for (let i = 0; i < items.length; i += concurrencyLimit) {
		const batch = items.slice(i, i + concurrencyLimit);
		const promises = batch.map(async (item) => {
			try {
				let response: IDataObject;

				if (operation === 'create') {
					response = await twentyCrmApiRequestWithRetry.call(this, 'POST', endpoint, item);
				} else if (operation === 'update') {
					const id = item.id as string;
					const updateData = { ...item };
					delete updateData.id;
					response = await twentyCrmApiRequestWithRetry.call(this, 'PUT', `${endpoint}/${id}`, updateData);
				} else {
					// delete
					const id = item.id as string;
					response = await twentyCrmApiRequestWithRetry.call(this, 'DELETE', `${endpoint}/${id}`);
				}

				return { success: true, data: response };
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				return { success: false, error: errorMessage, item };
			}
		});

		const batchResults = await Promise.all(promises);
		results.push(...batchResults);
	}

	return results;
}
