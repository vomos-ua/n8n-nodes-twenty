import type { INodeProperties } from 'n8n-workflow';

export const customObjectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customObject'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new record in a custom object',
				action: 'Create a custom object record',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a record from a custom object',
				action: 'Delete a custom object record',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a record from a custom object by ID',
				action: 'Get a custom object record',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many records from a custom object',
				action: 'Get many custom object records',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a record in a custom object',
				action: 'Update a custom object record',
			},
		],
		default: 'getAll',
	},
];
