import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	twentyCrmApiRequest,
	twentyCrmApiRequestAllItems,
	twentyCrmSearchRecords,
	getResourceEndpoint,
	cleanObject,
	buildFilterQuery,
	findRecordByField,
	bulkOperation,
	transformCompanyFields,
	transformPersonFields,
	transformNoteFields,
} from './GenericFunctions';

// Import resource definitions
import { activityOperations, activityFields } from './resources/activity';
import { companyOperations, companyFields } from './resources/company';
import { personOperations, personFields } from './resources/person';
import { opportunityOperations, opportunityFields } from './resources/opportunity';
import { noteOperations, noteFields } from './resources/note';
import { taskOperations, taskFields } from './resources/task';
import { searchOperations, searchFields } from './resources/search';
import { bulkOperations, bulkFields } from './resources/bulk';

export class TwentyCrm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twenty CRM',
		name: 'twentyCrm',
		icon: 'file:twentyCrm.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Twenty CRM - Open Source CRM',
		defaults: {
			name: 'Twenty CRM',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'twentyCrmApi',
				required: true,
			},
		],
		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Activity',
						value: 'activity',
					},
					{
						name: 'Bulk Operations',
						value: 'bulk',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Search',
						value: 'search',
					},
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'company',
			},

			// Operations and fields for each resource
			...activityOperations,
			...activityFields,
			...bulkOperations,
			...bulkFields,
			...companyOperations,
			...companyFields,
			...personOperations,
			...personFields,
			...opportunityOperations,
			...opportunityFields,
			...noteOperations,
			...noteFields,
			...taskOperations,
			...taskFields,
			...searchOperations,
			...searchFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// ----------------------------------------
				//             activity
				// ----------------------------------------
				if (resource === 'activity') {
					const endpoint = getResourceEndpoint('activity');

					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const type = this.getNodeParameter('type', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body = cleanObject({
							title,
							type,
							...additionalFields,
						});

						responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
					}

					if (operation === 'delete') {
						const activityId = this.getNodeParameter('activityId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'DELETE', `${endpoint}/${activityId}`);
					}

					if (operation === 'get') {
						const activityId = this.getNodeParameter('activityId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'GET', `${endpoint}/${activityId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs = buildFilterQuery(filters);

						if (returnAll) {
							responseData = await twentyCrmApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await twentyCrmApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = response.data || response;
						}
					}

					if (operation === 'update') {
						const activityId = this.getNodeParameter('activityId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body = cleanObject({
							...additionalFields,
							...updateFields,
						});

						if (Object.keys(body).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one field must be updated',
								{ itemIndex: i },
							);
						}

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${activityId}`, body);
					}
				}

				// ----------------------------------------
				//             company
				// ----------------------------------------
				if (resource === 'company') {
					const endpoint = getResourceEndpoint('company');

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body = transformCompanyFields(cleanObject({
							name,
							...additionalFields,
						}));

						responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
					}

					if (operation === 'delete') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'DELETE', `${endpoint}/${companyId}`);
					}

					if (operation === 'get') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'GET', `${endpoint}/${companyId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs = buildFilterQuery(filters);

						if (returnAll) {
							responseData = await twentyCrmApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await twentyCrmApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = response.data || response;
						}
					}

					if (operation === 'update') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body = transformCompanyFields(cleanObject({
							...additionalFields,
							...updateFields,
						}));

						if (Object.keys(body).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one field must be updated',
								{ itemIndex: i },
							);
						}

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${companyId}`, body);
					}

					if (operation === 'upsert') {
						const matchField = this.getNodeParameter('matchField', i) as string;
						const matchValue = this.getNodeParameter('matchValue', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Try to find existing record
						const existingRecord = await findRecordByField.call(this, 'company', matchField, matchValue);

						const body = transformCompanyFields(cleanObject({
							name,
							[matchField]: matchValue,
							...additionalFields,
						}));

						if (existingRecord && existingRecord.id) {
							// Update existing record
							responseData = await twentyCrmApiRequest.call(
								this,
								'PUT',
								`${endpoint}/${existingRecord.id}`,
								body,
							);
							(responseData as IDataObject)._upsertAction = 'updated';
						} else {
							// Create new record
							responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
							(responseData as IDataObject)._upsertAction = 'created';
						}
					}
				}

				// ----------------------------------------
				//             person
				// ----------------------------------------
				if (resource === 'person') {
					const endpoint = getResourceEndpoint('person');

					if (operation === 'create') {
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body = transformPersonFields(cleanObject({
							firstName,
							lastName,
							...additionalFields,
						}));

						responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
					}

					if (operation === 'delete') {
						const personId = this.getNodeParameter('personId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'DELETE', `${endpoint}/${personId}`);
					}

					if (operation === 'get') {
						const personId = this.getNodeParameter('personId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'GET', `${endpoint}/${personId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs = buildFilterQuery(filters);

						if (returnAll) {
							responseData = await twentyCrmApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await twentyCrmApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = response.data || response;
						}
					}

					if (operation === 'update') {
						const personId = this.getNodeParameter('personId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body = transformPersonFields(cleanObject({
							...additionalFields,
							...updateFields,
						}));

						if (Object.keys(body).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one field must be updated',
								{ itemIndex: i },
							);
						}

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${personId}`, body);
					}

					if (operation === 'upsert') {
						const matchField = this.getNodeParameter('matchField', i) as string;
						const matchValue = this.getNodeParameter('matchValue', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Try to find existing record
						const existingRecord = await findRecordByField.call(this, 'person', matchField, matchValue);

						const body = transformPersonFields(cleanObject({
							firstName,
							lastName,
							[matchField]: matchValue,
							...additionalFields,
						}));

						if (existingRecord && existingRecord.id) {
							// Update existing record
							responseData = await twentyCrmApiRequest.call(
								this,
								'PUT',
								`${endpoint}/${existingRecord.id}`,
								body,
							);
							(responseData as IDataObject)._upsertAction = 'updated';
						} else {
							// Create new record
							responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
							(responseData as IDataObject)._upsertAction = 'created';
						}
					}
				}

				// ----------------------------------------
				//             opportunity
				// ----------------------------------------
				if (resource === 'opportunity') {
					const endpoint = getResourceEndpoint('opportunity');

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body = cleanObject({
							name,
							...additionalFields,
						});

						responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
					}

					if (operation === 'delete') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'DELETE', `${endpoint}/${opportunityId}`);
					}

					if (operation === 'get') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'GET', `${endpoint}/${opportunityId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs = buildFilterQuery(filters);

						if (returnAll) {
							responseData = await twentyCrmApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await twentyCrmApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = response.data || response;
						}
					}

					if (operation === 'update') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body = cleanObject({
							...additionalFields,
							...updateFields,
						});

						if (Object.keys(body).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one field must be updated',
								{ itemIndex: i },
							);
						}

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${opportunityId}`, body);
					}

					if (operation === 'upsert') {
						const matchField = this.getNodeParameter('matchField', i) as string;
						const matchValue = this.getNodeParameter('matchValue', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Try to find existing record
						const existingRecord = await findRecordByField.call(this, 'opportunity', matchField, matchValue);

						const body = cleanObject({
							name,
							...additionalFields,
						});

						if (existingRecord && existingRecord.id) {
							// Update existing record
							responseData = await twentyCrmApiRequest.call(
								this,
								'PUT',
								`${endpoint}/${existingRecord.id}`,
								body,
							);
							(responseData as IDataObject)._upsertAction = 'updated';
						} else {
							// Create new record
							responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
							(responseData as IDataObject)._upsertAction = 'created';
						}
					}
				}

				// ----------------------------------------
				//             note
				// ----------------------------------------
				if (resource === 'note') {
					const endpoint = getResourceEndpoint('note');

					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						// Note: Twenty CRM notes don't have a 'body' field in the API
						// The 'body' parameter is kept in UI for backwards compatibility but not sent to API
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const requestBody = transformNoteFields(cleanObject({
							title,
							...additionalFields,
						}));

						responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, requestBody);
					}

					if (operation === 'delete') {
						const noteId = this.getNodeParameter('noteId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'DELETE', `${endpoint}/${noteId}`);
					}

					if (operation === 'get') {
						const noteId = this.getNodeParameter('noteId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'GET', `${endpoint}/${noteId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs = buildFilterQuery(filters);

						if (returnAll) {
							responseData = await twentyCrmApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await twentyCrmApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = response.data || response;
						}
					}

					if (operation === 'update') {
						const noteId = this.getNodeParameter('noteId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body = transformNoteFields(cleanObject({
							...additionalFields,
							...updateFields,
						}));

						if (Object.keys(body).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one field must be updated',
								{ itemIndex: i },
							);
						}

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${noteId}`, body);
					}
				}

				// ----------------------------------------
				//             task
				// ----------------------------------------
				if (resource === 'task') {
					const endpoint = getResourceEndpoint('task');

					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body = cleanObject({
							title,
							...additionalFields,
						});

						responseData = await twentyCrmApiRequest.call(this, 'POST', endpoint, body);
					}

					if (operation === 'delete') {
						const taskId = this.getNodeParameter('taskId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'DELETE', `${endpoint}/${taskId}`);
					}

					if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as string;
						responseData = await twentyCrmApiRequest.call(this, 'GET', `${endpoint}/${taskId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs = buildFilterQuery(filters);

						if (returnAll) {
							responseData = await twentyCrmApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await twentyCrmApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = response.data || response;
						}
					}

					if (operation === 'update') {
						const taskId = this.getNodeParameter('taskId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body = cleanObject({
							...additionalFields,
							...updateFields,
						});

						if (Object.keys(body).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one field must be updated',
								{ itemIndex: i },
							);
						}

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${taskId}`, body);
					}
				}

				// ----------------------------------------
				//             search
				// ----------------------------------------
				if (resource === 'search') {
					if (operation === 'searchAll') {
						const query = this.getNodeParameter('query', i) as string;
						const objectTypes = this.getNodeParameter('objectTypes', i) as string[];
						const limit = this.getNodeParameter('limit', i) as number;

						responseData = await twentyCrmSearchRecords.call(this, query, objectTypes, limit);
					}
				}

				// ----------------------------------------
				//             bulk
				// ----------------------------------------
				if (resource === 'bulk') {
					const bulkResourceType = this.getNodeParameter('bulkResourceType', i) as string;

					if (operation === 'bulkCreate') {
						const bulkItemsJson = this.getNodeParameter('bulkItems', i) as string;
						let bulkItems: IDataObject[];

						try {
							bulkItems = JSON.parse(bulkItemsJson);
							if (!Array.isArray(bulkItems)) {
								throw new Error('Items must be an array');
							}
						} catch (parseError) {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid JSON format for bulk items',
								{ itemIndex: i },
							);
						}

						responseData = await bulkOperation.call(this, 'create', bulkResourceType, bulkItems);
					}

					if (operation === 'bulkUpdate') {
						const bulkItemsJson = this.getNodeParameter('bulkUpdateItems', i) as string;
						let bulkItems: IDataObject[];

						try {
							bulkItems = JSON.parse(bulkItemsJson);
							if (!Array.isArray(bulkItems)) {
								throw new Error('Items must be an array');
							}
							// Validate that each item has an ID
							for (const item of bulkItems) {
								if (!item.id) {
									throw new Error('Each item must have an "id" field for update');
								}
							}
						} catch (parseError) {
							const errorMsg = parseError instanceof Error ? parseError.message : 'Invalid JSON';
							throw new NodeOperationError(
								this.getNode(),
								errorMsg,
								{ itemIndex: i },
							);
						}

						responseData = await bulkOperation.call(this, 'update', bulkResourceType, bulkItems);
					}

					if (operation === 'bulkDelete') {
						const bulkIds = this.getNodeParameter('bulkDeleteIds', i) as string;
						const ids = bulkIds.split(',').map((id) => id.trim()).filter((id) => id);

						if (ids.length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one ID must be provided',
								{ itemIndex: i },
							);
						}

						const bulkItems = ids.map((id) => ({ id }));
						responseData = await bulkOperation.call(this, 'delete', bulkResourceType, bulkItems);
					}
				}

				// Return data
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData!),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
