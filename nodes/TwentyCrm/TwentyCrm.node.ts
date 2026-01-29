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
} from './GenericFunctions';

// Import resource definitions
import { companyOperations, companyFields } from './resources/company';
import { personOperations, personFields } from './resources/person';
import { opportunityOperations, opportunityFields } from './resources/opportunity';
import { noteOperations, noteFields } from './resources/note';
import { taskOperations, taskFields } from './resources/task';
import { searchOperations, searchFields } from './resources/search';

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
				//             company
				// ----------------------------------------
				if (resource === 'company') {
					const endpoint = getResourceEndpoint('company');

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

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${companyId}`, body);
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

						const body = cleanObject({
							firstName,
							lastName,
							...additionalFields,
						});

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

						responseData = await twentyCrmApiRequest.call(this, 'PUT', `${endpoint}/${personId}`, body);
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
				}

				// ----------------------------------------
				//             note
				// ----------------------------------------
				if (resource === 'note') {
					const endpoint = getResourceEndpoint('note');

					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const body = this.getNodeParameter('body', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const requestBody = cleanObject({
							title,
							body,
							...additionalFields,
						});

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
