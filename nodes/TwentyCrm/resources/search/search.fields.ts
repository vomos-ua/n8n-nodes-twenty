import type { INodeProperties } from 'n8n-workflow';

export const searchFields: INodeProperties[] = [
	// ----------------------------------
	//         search:searchAll
	// ----------------------------------
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['searchAll'],
			},
		},
		default: '',
		description: 'The search query',
	},
	{
		displayName: 'Object Types',
		name: 'objectTypes',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['searchAll'],
			},
		},
		options: [
			{
				name: 'Companies',
				value: 'companies',
			},
			{
				name: 'Notes',
				value: 'notes',
			},
			{
				name: 'Opportunities',
				value: 'opportunities',
			},
			{
				name: 'People',
				value: 'people',
			},
			{
				name: 'Tasks',
				value: 'tasks',
			},
		],
		default: ['people', 'companies'],
		description: 'Object types to search across',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['searchAll'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 60,
		},
		default: 20,
		description: 'Max number of results per object type',
	},
];
