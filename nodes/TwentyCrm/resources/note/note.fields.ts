import type { INodeProperties } from 'n8n-workflow';

export const noteFields: INodeProperties[] = [
	// ----------------------------------
	//         note:create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the note',
	},
	{
		displayName: 'Body (Deprecated)',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: false,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Note: This field is not supported by Twenty CRM API and will be ignored',
	},

	// ----------------------------------
	//         note:get, update, delete
	// ----------------------------------
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the note',
	},

	// ----------------------------------
	//         note:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['note'],
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
				resource: ['note'],
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
	//         note:getAll - Filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term for note title or content',
			},
		],
	},

	// ----------------------------------
	//         note:create, update - Additional Fields
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Position for ordering',
			},
		],
	},

	// ----------------------------------
	//         note:update - Main Fields
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the note',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The content of the note',
			},
		],
	},
];
