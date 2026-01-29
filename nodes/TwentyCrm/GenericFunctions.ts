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
		responseData = await twentyCrmApiRequest.call(this, method, endpoint, body, qs);

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
			const response = await twentyCrmApiRequest.call(
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
		const response = await twentyCrmApiRequest.call(
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
			const response = await twentyCrmApiRequest.call(
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
					response = await twentyCrmApiRequest.call(this, 'POST', endpoint, item);
				} else if (operation === 'update') {
					const id = item.id as string;
					const updateData = { ...item };
					delete updateData.id;
					response = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${id}`, updateData);
				} else {
					// delete
					const id = item.id as string;
					response = await twentyCrmApiRequest.call(this, 'DELETE', `${endpoint}/${id}`);
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
