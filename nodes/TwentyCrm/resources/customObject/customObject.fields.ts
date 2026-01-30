import type { INodeProperties } from 'n8n-workflow';

export const customObjectFields: INodeProperties[] = [
	// ----------------------------------
	//         customObject: all operations
	// ----------------------------------
	{
		displayName: 'Object API Name',
		name: 'customObjectApiName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customObject'],
			},
		},
		default: '',
		placeholder: 'customLeads',
		description: 'The API name of the custom object (e.g., "customLeads", "myCustomObject"). This is the plural name used in the API endpoint.',
		hint: 'Find this in Twenty CRM Settings > Data Model > Your Object > API Name',
	},

	// ----------------------------------
	//         customObject:create
	// ----------------------------------
	{
		displayName: 'Fields (JSON)',
		name: 'customFields',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['customObject'],
				operation: ['create'],
			},
		},
		default: '{\n  "fieldName": "value"\n}',
		description: 'JSON object with field names and values for the new record. Field names must match the API field names in your custom object.',
	},

	// ----------------------------------
	//         customObject:get, update, delete
	// ----------------------------------
	{
		displayName: 'Record ID',
		name: 'customRecordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customObject'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the record',
	},

	// ----------------------------------
	//         customObject:update
	// ----------------------------------
	{
		displayName: 'Update Fields (JSON)',
		name: 'customUpdateFields',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['customObject'],
				operation: ['update'],
			},
		},
		default: '{\n  "fieldName": "newValue"\n}',
		description: 'JSON object with field names and values to update. Only include fields you want to change.',
	},

	// ----------------------------------
	//         customObject:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['customObject'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customObject'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 60,
		},
		default: 20,
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         customObject:getAll - Filters
	// ----------------------------------
	{
		displayName: 'Filters (JSON)',
		name: 'customFilters',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['customObject'],
				operation: ['getAll'],
			},
		},
		default: '',
		placeholder: '{\n  "fieldName": { "eq": "value" }\n}',
		description: 'Optional JSON filter object using Twenty CRM filter syntax. Example: {"status": {"eq": "active"}}',
	},

	// ----------------------------------
	//         customObject: Options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'customOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['customObject'],
			},
		},
		options: [
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'number',
				default: 1,
				description: 'Depth of relations to include in the response (0-2)',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
				},
			},
		],
	},
];
