import type { INodeProperties } from 'n8n-workflow';

export const bulkFields: INodeProperties[] = [
	// ----------------------------------
	//         bulk: Resource Type (all operations)
	// ----------------------------------
	{
		displayName: 'Resource Type',
		name: 'bulkResourceType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
			},
		},
		options: [
			{ name: 'Activity', value: 'activity' },
			{ name: 'Company', value: 'company' },
			{ name: 'Note', value: 'note' },
			{ name: 'Opportunity', value: 'opportunity' },
			{ name: 'Person', value: 'person' },
			{ name: 'Task', value: 'task' },
		],
		default: 'company',
		description: 'The type of resource to perform bulk operations on',
	},

	// ----------------------------------
	//         bulk:bulkCreate
	// ----------------------------------
	{
		displayName: 'Items (JSON)',
		name: 'bulkItems',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['bulkCreate'],
			},
		},
		default: '[\n  {"name": "Record 1"},\n  {"name": "Record 2"}\n]',
		description: 'JSON array of items to create. Each item should have the required fields for the selected resource type.',
	},

	// ----------------------------------
	//         bulk:bulkUpdate
	// ----------------------------------
	{
		displayName: 'Items (JSON)',
		name: 'bulkUpdateItems',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['bulkUpdate'],
			},
		},
		default: '[\n  {"id": "record-id-1", "name": "Updated Name 1"},\n  {"id": "record-id-2", "name": "Updated Name 2"}\n]',
		description: 'JSON array of items to update. Each item must include "id" field and the fields to update.',
	},

	// ----------------------------------
	//         bulk:bulkDelete
	// ----------------------------------
	{
		displayName: 'Record IDs',
		name: 'bulkDeleteIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['bulkDelete'],
			},
		},
		default: '',
		description: 'Comma-separated list of record IDs to delete',
	},
];
