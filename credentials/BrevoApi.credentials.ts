import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BrevoApi implements ICredentialType {
	name = 'brevoApi';
	displayName = 'Brevo API';
	documentationUrl = 'https://developers.brevo.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Brevo API key. Generate one from your Brevo account dashboard under Settings > API Keys.',
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