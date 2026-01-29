import type { INodeProperties } from 'n8n-workflow';

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['search'],
			},
		},
		options: [
			{
				name: 'Search All',
				value: 'searchAll',
				description: 'Search across multiple object types',
				action: 'Search all records',
			},
		],
		default: 'searchAll',
	},
];
