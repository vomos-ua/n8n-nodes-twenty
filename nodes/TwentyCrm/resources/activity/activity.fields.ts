import type { INodeProperties } from 'n8n-workflow';

export const activityFields: INodeProperties[] = [
	// ----------------------------------
	//         activity:create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the activity',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Call',
				value: 'Call',
			},
			{
				name: 'Email',
				value: 'Email',
			},
			{
				name: 'Meeting',
				value: 'Meeting',
			},
			{
				name: 'Note',
				value: 'Note',
			},
			{
				name: 'Task',
				value: 'Task',
			},
		],
		default: 'Call',
		description: 'The type of activity',
	},

	// ----------------------------------
	//         activity:get, update, delete
	// ----------------------------------
	{
		displayName: 'Activity ID',
		name: 'activityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the activity',
	},

	// ----------------------------------
	//         activity:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['activity'],
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
				resource: ['activity'],
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
	//         activity:getAll - Filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'Filter by associated company',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'Filter by associated person',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Call',
						value: 'Call',
					},
					{
						name: 'Email',
						value: 'Email',
					},
					{
						name: 'Meeting',
						value: 'Meeting',
					},
					{
						name: 'Note',
						value: 'Note',
					},
					{
						name: 'Task',
						value: 'Task',
					},
				],
				default: 'Call',
				description: 'Filter by activity type',
			},
		],
	},

	// ----------------------------------
	//         activity:create, update - Additional Fields
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Activity description or notes',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				description: 'ID of the associated company',
			},
			{
				displayName: 'Completed At',
				name: 'completedAt',
				type: 'dateTime',
				default: '',
				description: 'When the activity was completed (ISO 8601)',
			},
			{
				displayName: 'Due At',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				description: 'When the activity is due (ISO 8601)',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'ID of the associated person',
			},
			{
				displayName: 'Reminder At',
				name: 'reminderAt',
				type: 'dateTime',
				default: '',
				description: 'When to send a reminder (ISO 8601)',
			},
		],
	},

	// ----------------------------------
	//         activity:update - Update Fields
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the activity',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Call',
						value: 'Call',
					},
					{
						name: 'Email',
						value: 'Email',
					},
					{
						name: 'Meeting',
						value: 'Meeting',
					},
					{
						name: 'Note',
						value: 'Note',
					},
					{
						name: 'Task',
						value: 'Task',
					},
				],
				default: 'Call',
				description: 'The type of activity',
			},
		],
	},
];
