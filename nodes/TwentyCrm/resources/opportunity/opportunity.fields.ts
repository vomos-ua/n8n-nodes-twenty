import type { INodeProperties } from 'n8n-workflow';

export const opportunityFields: INodeProperties[] = [
	// ----------------------------------
	//         opportunity:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the opportunity/deal',
	},

	// ----------------------------------
	//         opportunity:get, update, delete
	// ----------------------------------
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the opportunity',
	},

	// ----------------------------------
	//         opportunity:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['opportunity'],
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
				resource: ['opportunity'],
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
	//         opportunity:getAll - Filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'Filter by company ID',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'string',
				default: '',
				description: 'Filter by pipeline stage (e.g., NEW, MEETING, WON, LOST - depends on your Twenty CRM configuration)',
			},
		],
	},

	// ----------------------------------
	//         opportunity:create, update - Additional Fields
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Deal amount in micros (e.g., 1000000 = $1)',
			},
			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Expected close date (ISO 8601)',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the associated company',
			},
			{
				displayName: 'Point of Contact ID',
				name: 'pointOfContactId',
				type: 'string',
				default: '',
				description: 'ID of the contact person',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'string',
				default: '',
				description: 'Pipeline stage (e.g., NEW, MEETING, WON, LOST - depends on your Twenty CRM configuration)',
			},
		],
	},

	// ----------------------------------
	//         opportunity:update - Name Field
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the opportunity',
			},
		],
	},

	// ----------------------------------
	//         opportunity:upsert
	// ----------------------------------
	{
		displayName: 'Match Field',
		name: 'matchField',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['upsert'],
			},
		},
		options: [
			{
				name: 'Name',
				value: 'name',
			},
		],
		default: 'name',
		description: 'Field to match for finding existing opportunity',
	},
	{
		displayName: 'Match Value',
		name: 'matchValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['upsert'],
			},
		},
		default: '',
		description: 'Value to search for in the match field',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['upsert'],
			},
		},
		default: '',
		description: 'The name of the opportunity/deal',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['upsert'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Deal amount in micros (e.g., 1000000 = $1)',
			},
			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Expected close date (ISO 8601)',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the associated company',
			},
			{
				displayName: 'Point of Contact ID',
				name: 'pointOfContactId',
				type: 'string',
				default: '',
				description: 'ID of the contact person',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'string',
				default: '',
				description: 'Pipeline stage (e.g., NEW, MEETING, WON, LOST)',
			},
		],
	},
];
