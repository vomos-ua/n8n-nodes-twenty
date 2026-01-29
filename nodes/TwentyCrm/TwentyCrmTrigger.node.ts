import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { twentyCrmApiRequest } from './GenericFunctions';

export class TwentyCrmTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twenty CRM Trigger',
		name: 'twentyCrmTrigger',
		icon: 'file:twentyCrm.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when Twenty CRM events occur',
		defaults: {
			name: 'Twenty CRM Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'twentyCrmApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'company.created',
				options: [
					// Company events
					{
						name: 'Company Created',
						value: 'company.created',
					},
					{
						name: 'Company Updated',
						value: 'company.updated',
					},
					{
						name: 'Company Deleted',
						value: 'company.deleted',
					},
					// Person events
					{
						name: 'Person Created',
						value: 'person.created',
					},
					{
						name: 'Person Updated',
						value: 'person.updated',
					},
					{
						name: 'Person Deleted',
						value: 'person.deleted',
					},
					// Opportunity events
					{
						name: 'Opportunity Created',
						value: 'opportunity.created',
					},
					{
						name: 'Opportunity Updated',
						value: 'opportunity.updated',
					},
					{
						name: 'Opportunity Deleted',
						value: 'opportunity.deleted',
					},
					// Task events
					{
						name: 'Task Created',
						value: 'task.created',
					},
					{
						name: 'Task Updated',
						value: 'task.updated',
					},
					{
						name: 'Task Deleted',
						value: 'task.deleted',
					},
					// Note events
					{
						name: 'Note Created',
						value: 'note.created',
					},
					{
						name: 'Note Updated',
						value: 'note.updated',
					},
					{
						name: 'Note Deleted',
						value: 'note.deleted',
					},
					// Activity events
					{
						name: 'Activity Created',
						value: 'activity.created',
					},
					{
						name: 'Activity Updated',
						value: 'activity.updated',
					},
					{
						name: 'Activity Deleted',
						value: 'activity.deleted',
					},
				],
				description: 'The event that triggers the workflow',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Previous Data',
						name: 'includePreviousData',
						type: 'boolean',
						default: false,
						description: 'Whether to include the previous state of the record (for updates)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				// Try to get existing webhooks
				try {
					const response = await twentyCrmApiRequest.call(
						this,
						'GET',
						'/rest/webhooks',
						{},
						{ limit: 60 },
					);

					const webhooks = response.data || response;

					if (Array.isArray(webhooks)) {
						for (const webhook of webhooks) {
							if (
								webhook.targetUrl === webhookUrl &&
								webhook.operation === event
							) {
								webhookData.webhookId = webhook.id;
								return true;
							}
						}
					}
				} catch (error) {
					// Webhooks endpoint might not exist in some Twenty CRM versions
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const webhookData = this.getWorkflowStaticData('node');

				try {
					const body = {
						targetUrl: webhookUrl,
						operation: event,
					};

					const response = await twentyCrmApiRequest.call(
						this,
						'POST',
						'/rest/webhooks',
						body,
					);

					if (response.id) {
						webhookData.webhookId = response.id;
						return true;
					}
				} catch (error) {
					// If webhook creation fails, we'll use polling fallback
					console.error('Failed to create webhook:', error);
					return false;
				}

				return false;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await twentyCrmApiRequest.call(
							this,
							'DELETE',
							`/rest/webhooks/${webhookData.webhookId}`,
						);
					} catch (error) {
						// Ignore errors during cleanup
					}
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const headerData = this.getHeaderData() as IDataObject;

		// Add metadata to the response
		const returnData: IDataObject = {
			...bodyData,
			_webhookTimestamp: new Date().toISOString(),
			_webhookHeaders: headerData,
		};

		return {
			workflowData: [this.helpers.returnJsonArray([returnData])],
		};
	}
}
