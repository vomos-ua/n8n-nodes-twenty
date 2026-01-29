import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
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
		description: 'Starts the workflow when a Twenty CRM event occurs',
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
				noDataExpression: true,
				required: true,
				default: 'company.created',
				options: [
					// Company events
					{
						name: 'Company Created',
						value: 'company.created',
						description: 'Triggered when a company is created',
					},
					{
						name: 'Company Updated',
						value: 'company.updated',
						description: 'Triggered when a company is updated',
					},
					{
						name: 'Company Deleted',
						value: 'company.deleted',
						description: 'Triggered when a company is deleted',
					},
					// Person events
					{
						name: 'Person Created',
						value: 'person.created',
						description: 'Triggered when a person is created',
					},
					{
						name: 'Person Updated',
						value: 'person.updated',
						description: 'Triggered when a person is updated',
					},
					{
						name: 'Person Deleted',
						value: 'person.deleted',
						description: 'Triggered when a person is deleted',
					},
					// Opportunity events
					{
						name: 'Opportunity Created',
						value: 'opportunity.created',
						description: 'Triggered when an opportunity is created',
					},
					{
						name: 'Opportunity Updated',
						value: 'opportunity.updated',
						description: 'Triggered when an opportunity is updated',
					},
					{
						name: 'Opportunity Deleted',
						value: 'opportunity.deleted',
						description: 'Triggered when an opportunity is deleted',
					},
					// Task events
					{
						name: 'Task Created',
						value: 'task.created',
						description: 'Triggered when a task is created',
					},
					{
						name: 'Task Updated',
						value: 'task.updated',
						description: 'Triggered when a task is updated',
					},
					{
						name: 'Task Deleted',
						value: 'task.deleted',
						description: 'Triggered when a task is deleted',
					},
					// Note events
					{
						name: 'Note Created',
						value: 'note.created',
						description: 'Triggered when a note is created',
					},
					{
						name: 'Note Updated',
						value: 'note.updated',
						description: 'Triggered when a note is updated',
					},
					{
						name: 'Note Deleted',
						value: 'note.deleted',
						description: 'Triggered when a note is deleted',
					},
					// Activity events
					{
						name: 'Activity Created',
						value: 'activity.created',
						description: 'Triggered when an activity is created',
					},
					{
						name: 'Activity Updated',
						value: 'activity.updated',
						description: 'Triggered when an activity is updated',
					},
					{
						name: 'Activity Deleted',
						value: 'activity.deleted',
						description: 'Triggered when an activity is deleted',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const webhookData = this.getWorkflowStaticData('node');

				// Check if webhook already exists
				if (webhookData.webhookId) {
					try {
						await twentyCrmApiRequest.call(
							this,
							'GET',
							`/webhooks/${webhookData.webhookId}`,
						);
						return true;
					} catch (error) {
						// Webhook doesn't exist anymore
						delete webhookData.webhookId;
						return false;
					}
				}

				// Try to find existing webhook with same URL and event
				try {
					const response = await twentyCrmApiRequest.call(
						this,
						'GET',
						'/webhooks',
					) as IDataObject;
					
					const webhooks = (response.data || response) as IDataObject[];
					
					for (const webhook of webhooks) {
						if (webhook.targetUrl === webhookUrl && webhook.operation === event) {
							webhookData.webhookId = webhook.id;
							return true;
						}
					}
				} catch (error) {
					// If we can't list webhooks, assume it doesn't exist
				}

				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const webhookData = this.getWorkflowStaticData('node');

				const body: IDataObject = {
					targetUrl: webhookUrl,
					operation: event,
				};

				try {
					const response = await twentyCrmApiRequest.call(
						this,
						'POST',
						'/webhooks',
						body,
					) as IDataObject;

					const data = (response.data || response) as IDataObject;
					webhookData.webhookId = data.id;
					return true;
				} catch (error) {
					return false;
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await twentyCrmApiRequest.call(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId}`,
						);
					} catch (error) {
						return false;
					}
					delete webhookData.webhookId;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		
		return {
			workflowData: [
				this.helpers.returnJsonArray(bodyData as IDataObject),
			],
		};
	}
}
