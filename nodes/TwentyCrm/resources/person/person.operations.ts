import type { INodeProperties } from 'n8n-workflow';

export const personOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['person'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new person',
				action: 'Create a person',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a person',
				action: 'Delete a person',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a person by ID',
				action: 'Get a person',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many people',
				action: 'Get many people',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a person',
				action: 'Update a person',
			},
		],
		default: 'create',
	},
];
