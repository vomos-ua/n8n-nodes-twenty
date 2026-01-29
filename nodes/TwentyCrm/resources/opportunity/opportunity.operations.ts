import type { INodeProperties } from 'n8n-workflow';

export const opportunityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new opportunity',
				action: 'Create an opportunity',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an opportunity',
				action: 'Delete an opportunity',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an opportunity by ID',
				action: 'Get an opportunity',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many opportunities',
				action: 'Get many opportunities',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an opportunity',
				action: 'Update an opportunity',
			},
		],
		default: 'create',
	},
];
