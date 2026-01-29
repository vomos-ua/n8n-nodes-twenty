import type { INodeProperties } from 'n8n-workflow';

export const bulkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
			},
		},
		options: [
			{
				name: 'Create Many',
				value: 'bulkCreate',
				description: 'Create multiple records at once',
				action: 'Create many records',
			},
			{
				name: 'Delete Many',
				value: 'bulkDelete',
				description: 'Delete multiple records by IDs',
				action: 'Delete many records',
			},
			{
				name: 'Update Many',
				value: 'bulkUpdate',
				description: 'Update multiple records at once',
				action: 'Update many records',
			},
		],
		default: 'bulkCreate',
	},
];
