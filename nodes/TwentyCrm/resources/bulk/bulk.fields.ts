import type { INodeProperties } from 'n8n-workflow';

export const bulkFields: INodeProperties[] = [
	// ----------------------------------
	//         bulk: Resource Type
	// ----------------------------------
	{
		displayName: 'Resource Type',
		name: 'bulkResourceType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
			},
		},
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
				name: 'Task',
				value: 'task',
			},
		],
		default: 'company',
		description: 'The type of resource to operate on',
	},

	// ----------------------------------
	//         bulk:bulkCreate - Items
	// ----------------------------------
	{
		displayName: 'Items (JSON)',
		name: 'bulkItems',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['bulkCreate', 'bulkUpdate'],
			},
		},
		default: '[\n  {\n    "name": "Company 1"\n  },\n  {\n    "name": "Company 2"\n  }\n]',
		description: 'JSON array of items to create or update. For update, each item must include "id" field.',
	},

	// ----------------------------------
	//         bulk:bulkDelete - IDs
	// ----------------------------------
	{
		displayName: 'Record IDs',
		name: 'bulkIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['bulkDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of record IDs to delete',
	},

	// ----------------------------------
	//         bulk: Options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'bulkOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['bulk'],
			},
		},
		options: [
			{
				displayName: 'Continue On Error',
				name: 'continueOnError',
				type: 'boolean',
				default: true,
				description: 'Whether to continue processing remaining items if one fails',
			},
			{
				displayName: 'Return Failed Items',
				name: 'returnFailedItems',
				type: 'boolean',
				default: true,
				description: 'Whether to include failed items in the output',
			},
		],
	},
];
