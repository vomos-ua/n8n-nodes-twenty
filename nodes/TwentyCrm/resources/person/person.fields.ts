import type { INodeProperties } from 'n8n-workflow';

export const personFields: INodeProperties[] = [
	// ----------------------------------
	//         person:create
	// ----------------------------------
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The first name of the person',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The last name of the person',
	},

	// ----------------------------------
	//         person:get, update, delete
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the person',
	},

	// ----------------------------------
	//         person:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['person'],
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
				resource: ['person'],
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
	//         person:getAll - Filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['person'],
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
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term for name or email',
			},
		],
	},

	// ----------------------------------
	//         person:create, update - Additional Fields
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Avatar URL',
				name: 'avatarUrl',
				type: 'string',
				default: '',
				description: 'Avatar image URL',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the company to associate with',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email address',
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				description: 'Job title',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				description: 'LinkedIn profile URL',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
		],
	},

	// ----------------------------------
	//         person:update - Name Fields
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'The first name of the person',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The last name of the person',
			},
		],
	},
];
