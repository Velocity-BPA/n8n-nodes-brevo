import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BrevoApi implements ICredentialType {
	name = 'brevoApi';
	displayName = 'Brevo API';
	documentationUrl = 'https://developers.brevo.com/reference/getting-started-1';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key from your Brevo account dashboard under SMTP & API > API Keys',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.brevo.com/v3',
			url: '/account',
			method: 'GET',
		},
	};
}