import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TwentyCrmApi implements ICredentialType {
	name = 'twentyCrmApi';
	displayName = 'Twenty CRM API';
	documentationUrl = 'https://docs.twenty.com/developers/extend/capabilities/apis';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://api.twenty.com',
			placeholder: 'https://api.twenty.com or https://your-instance.com',
			description: 'The URL of your Twenty CRM instance API. Use https://api.twenty.com for cloud or your self-hosted URL.',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API Key from Twenty CRM. Go to Settings → Developers → API Keys to create one.',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/rest/companies',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}
