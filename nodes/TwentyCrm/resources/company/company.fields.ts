import type { INodeProperties } from 'n8n-workflow';

export const companyFields: INodeProperties[] = [
	// ----------------------------------
	//         company:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the company',
	},

	// ----------------------------------
	//         company:get, update, delete
	// ----------------------------------
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the company',
	},

	// ----------------------------------
	//         company:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['company'],
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
				resource: ['company'],
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
	//         company:getAll - Filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term for company name',
			},
		],
	},

	// ----------------------------------
	//         company:create, update - Additional Fields
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Company address',
			},
			{
				displayName: 'Annual Recurring Revenue',
				name: 'annualRecurringRevenue',
				type: 'number',
				default: 0,
				description: 'Annual recurring revenue',
			},
			{
				displayName: 'Domain Name',
				name: 'domainName',
				type: 'string',
				default: '',
				description: 'Company domain (e.g., example.com)',
			},
			{
				displayName: 'Employees',
				name: 'employees',
				type: 'number',
				default: 0,
				description: 'Number of employees',
			},
			{
				displayName: 'Ideal Customer Profile',
				name: 'idealCustomerProfile',
				type: 'boolean',
				default: false,
				description: 'Whether this is an ideal customer profile',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'LinkedIn company page URL',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'X (Twitter) profile URL',
			},
		],
	},

	// ----------------------------------
	//         company:update - Name (optional)
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the company',
			},
		],
	},

	// ----------------------------------
	//         company:upsert
	// ----------------------------------
	{
		displayName: 'Match Field',
		name: 'matchField',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['upsert'],
			},
		},
		options: [
			{
				name: 'Domain Name',
				value: 'domainName',
			},
			{
				name: 'Name',
				value: 'name',
			},
			{
				name: 'LinkedIn URL',
				value: 'linkedinUrl',
			},
		],
		default: 'domainName',
		description: 'Field to match for finding existing company',
	},
	{
		displayName: 'Match Value',
		name: 'matchValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
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
				resource: ['company'],
				operation: ['upsert'],
			},
		},
		default: '',
		description: 'The name of the company (used for create)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['upsert'],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Company address',
			},
			{
				displayName: 'Annual Recurring Revenue',
				name: 'annualRecurringRevenue',
				type: 'number',
				default: 0,
				description: 'Annual recurring revenue',
			},
			{
				displayName: 'Domain Name',
				name: 'domainName',
				type: 'string',
				default: '',
				description: 'Company domain (e.g., example.com)',
			},
			{
				displayName: 'Employees',
				name: 'employees',
				type: 'number',
				default: 0,
				description: 'Number of employees',
			},
			{
				displayName: 'Ideal Customer Profile',
				name: 'idealCustomerProfile',
				type: 'boolean',
				default: false,
				description: 'Whether this is an ideal customer profile',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'LinkedIn company page URL',
			},
			{
				displayName: 'X (Twitter) URL',
				name: 'xUrl',
				type: 'string',
				default: '',
				description: 'X (Twitter) profile URL',
			},
		],
	},
];
