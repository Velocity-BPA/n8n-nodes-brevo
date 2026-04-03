/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Brevo } from '../nodes/Brevo/Brevo.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Brevo Node', () => {
  let node: Brevo;

  beforeAll(() => {
    node = new Brevo();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Brevo');
      expect(node.description.name).toBe('brevo');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Contact Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.brevo.com/v3' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create contact successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createContact')
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce({ attributesValues: [{ name: 'FIRSTNAME', value: 'John' }] })
      .mockReturnValueOnce('1,2');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 123 });

    const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.brevo.com/v3/contacts',
      headers: {
        'api-key': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        email: 'test@example.com',
        attributes: { FIRSTNAME: 'John' },
        listIds: [1, 2],
      },
    });

    expect(result).toEqual([{ json: { id: 123 }, pairedItem: { item: 0 } }]);
  });

  it('should handle createContact error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createContact')
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce({})
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should get contact successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getContact')
      .mockReturnValueOnce('test@example.com');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      email: 'test@example.com',
      id: 123 
    });

    const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.brevo.com/v3/contacts/test%40example.com',
      headers: {
        'api-key': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{ json: { email: 'test@example.com', id: 123 }, pairedItem: { item: 0 } }]);
  });

  it('should get all contacts successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllContacts')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('2023-01-01T00:00:00Z')
      .mockReturnValueOnce('createdAt:desc');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ contacts: [] });

    const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.brevo.com/v3/contacts?limit=10&offset=0&modifiedSince=2023-01-01T00%3A00%3A00Z&sort=createdAt%3Adesc',
      headers: {
        'api-key': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{ json: { contacts: [] }, pairedItem: { item: 0 } }]);
  });

  it('should create contact list successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createContactList')
      .mockReturnValueOnce('Test List')
      .mockReturnValueOnce(1);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 456 });

    const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.brevo.com/v3/contacts/lists',
      headers: {
        'api-key': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        name: 'Test List',
        folderId: 1,
      },
    });

    expect(result).toEqual([{ json: { id: 456 }, pairedItem: { item: 0 } }]);
  });

  it('should delete contact successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteContact')
      .mockReturnValueOnce('test@example.com');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

    const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.brevo.com/v3/contacts/test%40example.com',
      headers: {
        'api-key': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
  });
});

describe('Campaign Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.brevo.com/v3',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createEmailCampaign', () => {
		it('should create email campaign successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createEmailCampaign')
				.mockReturnValueOnce('Test Campaign')
				.mockReturnValueOnce('Test Subject')
				.mockReturnValueOnce('Test Sender')
				.mockReturnValueOnce('test@example.com')
				.mockReturnValueOnce('<h1>Test Content</h1>')
				.mockReturnValueOnce('listIds')
				.mockReturnValueOnce('1,2,3')
				.mockReturnValueOnce('');

			const mockResponse = { id: 123, name: 'Test Campaign' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.brevo.com/v3/emailCampaigns',
				headers: {
					'api-key': 'test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Test Campaign',
					subject: 'Test Subject',
					sender: { name: 'Test Sender', email: 'test@example.com' },
					htmlContent: '<h1>Test Content</h1>',
					recipients: { listIds: [1, 2, 3] },
				},
				json: true,
			});
		});

		it('should handle createEmailCampaign error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createEmailCampaign');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getCampaign', () => {
		it('should get campaign successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCampaign')
				.mockReturnValueOnce('123');

			const mockResponse = { id: 123, name: 'Test Campaign' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.brevo.com/v3/emailCampaigns/123',
				headers: { 'api-key': 'test-api-key' },
				json: true,
			});
		});
	});

	describe('getAllCampaigns', () => {
		it('should get all campaigns with filters', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllCampaigns')
				.mockReturnValueOnce('classic')
				.mockReturnValueOnce('sent')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-12-31')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			const mockResponse = { campaigns: [] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.brevo.com/v3/emailCampaigns?type=classic&status=sent&startDate=2023-01-01&endDate=2023-12-31&limit=10&offset=0',
				headers: { 'api-key': 'test-api-key' },
				json: true,
			});
		});
	});

	describe('updateCampaign', () => {
		it('should update campaign successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateCampaign')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('Updated Campaign')
				.mockReturnValueOnce('Updated Subject')
				.mockReturnValueOnce('<h1>Updated Content</h1>');

			const mockResponse = { id: 123, name: 'Updated Campaign' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.brevo.com/v3/emailCampaigns/123',
				headers: {
					'api-key': 'test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Updated Campaign',
					subject: 'Updated Subject',
					htmlContent: '<h1>Updated Content</h1>',
				},
				json: true,
			});
		});
	});

	describe('deleteCampaign', () => {
		it('should delete campaign successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteCampaign')
				.mockReturnValueOnce('123');

			const mockResponse = {};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.brevo.com/v3/emailCampaigns/123',
				headers: { 'api-key': 'test-api-key' },
				json: true,
			});
		});
	});

	describe('sendCampaign', () => {
		it('should send campaign successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendCampaign')
				.mockReturnValueOnce('123');

			const mockResponse = { id: 123, status: 'sent' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.brevo.com/v3/emailCampaigns/123/sendNow',
				headers: { 'api-key': 'test-api-key' },
				json: true,
			});
		});
	});

	describe('sendTestCampaign', () => {
		it('should send test campaign successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendTestCampaign')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('test1@example.com,test2@example.com');

			const mockResponse = { success: true };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.brevo.com/v3/emailCampaigns/123/sendTest',
				headers: {
					'api-key': 'test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					emailTo: ['test1@example.com', 'test2@example.com'],
				},
				json: true,
			});
		});
	});
});

describe('TransactionalEmail Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.brevo.com/v3',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should send transactional email successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('sendTransactionalEmail')
			.mockReturnValueOnce('sender@example.com')
			.mockReturnValueOnce('Sender Name')
			.mockReturnValueOnce('recipient@example.com')
			.mockReturnValueOnce('Recipient Name')
			.mockReturnValueOnce('Test Subject')
			.mockReturnValueOnce('<h1>Test HTML</h1>')
			.mockReturnValueOnce('Test text content')
			.mockReturnValueOnce(false);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			messageId: 'test-message-id',
		});

		const result = await executeTransactionalEmailOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.messageId).toBe('test-message-id');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.brevo.com/v3/smtp/email',
			}),
		);
	});

	it('should get email templates successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getEmailTemplates')
			.mockReturnValueOnce('true')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			templates: [{ id: 1, name: 'Test Template' }],
			count: 1,
		});

		const result = await executeTransactionalEmailOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.templates).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/smtp/templates'),
			}),
		);
	});

	it('should create email template successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createEmailTemplate')
			.mockReturnValueOnce('Test Template')
			.mockReturnValueOnce('Test Subject')
			.mockReturnValueOnce('sender@example.com')
			.mockReturnValueOnce('Sender Name')
			.mockReturnValueOnce('<h1>Template HTML</h1>');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 123,
		});

		const result = await executeTransactionalEmailOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe(123);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.brevo.com/v3/smtp/templates',
			}),
		);
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('sendTransactionalEmail');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeTransactionalEmailOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('sendTransactionalEmail');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeTransactionalEmailOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});
});

describe('SMS Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('sendTransactionalSMS', () => {
    it('should send transactional SMS successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendTransactionalSMS')
        .mockReturnValueOnce('TestSender')
        .mockReturnValueOnce('+1234567890')
        .mockReturnValueOnce('Test message')
        .mockReturnValueOnce('transactional');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ messageId: 'msg123' });

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/transactionalSMS/sms',
        headers: { 'api-key': 'test-key', 'Content-Type': 'application/json' },
        body: { sender: 'TestSender', recipient: '+1234567890', content: 'Test message', type: 'transactional' },
        json: true,
      });
      expect(result).toEqual([{ json: { messageId: 'msg123' }, pairedItem: { item: 0 } }]);
    });

    it('should handle sendTransactionalSMS error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('sendTransactionalSMS');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getSMSEvents', () => {
    it('should get SMS events successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSMSEvents')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ events: [] });

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { events: [] }, pairedItem: { item: 0 } }]);
    });
  });

  describe('createSMSCampaign', () => {
    it('should create SMS campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createSMSCampaign')
        .mockReturnValueOnce('Test Campaign')
        .mockReturnValueOnce('TestSender')
        .mockReturnValueOnce('Campaign content')
        .mockReturnValueOnce('+1234567890,+0987654321');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'campaign123' });

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { id: 'campaign123' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteSMSCampaign', () => {
    it('should delete SMS campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteSMSCampaign')
        .mockReturnValueOnce('campaign123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.brevo.com/v3/smsCampaigns/campaign123',
        headers: { 'api-key': 'test-key' },
        json: true,
      });
      expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Webhook Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.brevo.com/v3',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createWebhook', () => {
		it('should create a webhook successfully', async () => {
			const mockResponse = { id: 'webhook123', url: 'https://example.com/webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['delivered', 'opened'])
				.mockReturnValueOnce('transactional');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle createWebhook errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['delivered'])
				.mockReturnValueOnce('transactional');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('API Error'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWebhookOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getAllWebhooks', () => {
		it('should get all webhooks successfully', async () => {
			const mockResponse = { webhooks: [{ id: 'webhook123' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllWebhooks')
				.mockReturnValueOnce('transactional');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getWebhook', () => {
		it('should get webhook successfully', async () => {
			const mockResponse = { id: 'webhook123', url: 'https://example.com/webhook' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWebhook')
				.mockReturnValueOnce('webhook123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('updateWebhook', () => {
		it('should update webhook successfully', async () => {
			const mockResponse = { id: 'webhook123' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWebhook')
				.mockReturnValueOnce('webhook123')
				.mockReturnValueOnce('https://example.com/new-webhook')
				.mockReturnValueOnce(['delivered', 'opened']);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('deleteWebhook', () => {
		it('should delete webhook successfully', async () => {
			const mockResponse = { message: 'Webhook deleted' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhook')
				.mockReturnValueOnce('webhook123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWebhookOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('Sender Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.brevo.com/v3' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	test('getAllSenders operation should work correctly', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllSenders')
			.mockReturnValueOnce('192.168.1.1')
			.mockReturnValueOnce('example.com');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			senders: [
				{ id: 1, name: 'Test Sender', email: 'test@example.com' }
			]
		});

		const result = await executeSenderOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.brevo.com/v3/senders?ip=192.168.1.1&domain=example.com',
			headers: {
				'api-key': 'test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});
		expect(result).toHaveLength(1);
	});

	test('createSender operation should work correctly', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createSender')
			.mockReturnValueOnce('Test Sender')
			.mockReturnValueOnce('test@example.com')
			.mockReturnValueOnce('192.168.1.1, 192.168.1.2');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 123,
			name: 'Test Sender'
		});

		const result = await executeSenderOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.brevo.com/v3/senders',
			headers: {
				'api-key': 'test-key',
				'Content-Type': 'application/json'
			},
			body: {
				name: 'Test Sender',
				email: 'test@example.com',
				ips: ['192.168.1.1', '192.168.1.2']
			},
			json: true
		});
		expect(result).toHaveLength(1);
	});

	test('updateSender operation should work correctly', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateSender')
			.mockReturnValueOnce('123')
			.mockReturnValueOnce('Updated Sender')
			.mockReturnValueOnce('updated@example.com');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 123,
			name: 'Updated Sender'
		});

		const result = await executeSenderOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PUT',
			url: 'https://api.brevo.com/v3/senders/123',
			headers: {
				'api-key': 'test-key',
				'Content-Type': 'application/json'
			},
			body: {
				name: 'Updated Sender',
				email: 'updated@example.com'
			},
			json: true
		});
		expect(result).toHaveLength(1);
	});

	test('deleteSender operation should work correctly', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteSender')
			.mockReturnValueOnce('123');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			message: 'Sender deleted successfully'
		});

		const result = await executeSenderOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://api.brevo.com/v3/senders/123',
			headers: {
				'api-key': 'test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});
		expect(result).toHaveLength(1);
	});

	test('getSenderIps operation should work correctly', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSenderIps')
			.mockReturnValueOnce('123');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			ips: ['192.168.1.1', '192.168.1.2']
		});

		const result = await executeSenderOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.brevo.com/v3/senders/123/ips',
			headers: {
				'api-key': 'test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});
		expect(result).toHaveLength(1);
	});

	test('should handle errors correctly when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllSenders');
		mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeSenderOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});
});
