import {
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
			required: true,
			default: '',
			description: 'API key from Brevo dashboard under Account > SMTP & API > API Keys',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://api.brevo.com/v3',
			description: 'Base URL for Brevo API',
		},
	];
}