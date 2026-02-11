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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
describe('Contacts Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should create contact successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createContact';
        case 'email': return 'test@example.com';
        case 'attributes': return { attribute: [{ name: 'FIRSTNAME', value: 'John' }] };
        case 'listIds': return '1,2';
        case 'updateEnabled': return true;
        default: return undefined;
      }
    });

    const mockResponse = { id: 1, email: 'test@example.com' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.brevo.com/v3/contacts',
      body: {
        email: 'test@example.com',
        attributes: { FIRSTNAME: 'John' },
        listIds: [1, 2],
        updateEnabled: true,
      },
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': 'test-api-key',
      },
      json: true,
    });
  });

  test('should get contact successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContact';
        case 'identifier': return 'test@example.com';
        default: return undefined;
      }
    });

    const mockResponse = { id: 1, email: 'test@example.com', attributes: {} };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.brevo.com/v3/contacts/test%40example.com',
      headers: {
        'accept': 'application/json',
        'api-key': 'test-api-key',
      },
      json: true,
    });
  });

  test('should get all contacts successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAllContacts';
        case 'limit': return 50;
        case 'offset': return 0;
        case 'modifiedSince': return '2023-01-01T00:00:00.000Z';
        case 'sort': return 'createdAt:asc';
        default: return undefined;
      }
    });

    const mockResponse = { contacts: [], count: 0 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('https://api.brevo.com/v3/contacts?'),
      })
    );
  });

  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContact';
        case 'identifier': return 'invalid@example.com';
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Contact not found'));

    const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Contact not found');
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContact';
        case 'identifier': return 'invalid@example.com';
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Contact not found'));

    await expect(executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Contact not found');
  });
});

describe('ContactLists Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createList operation', () => {
    it('should create a contact list successfully', async () => {
      const mockResponse = { id: 123, name: 'Test List' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createList';
          case 'name': return 'Test List';
          case 'folderId': return 1;
          default: return undefined;
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const items = [{ json: {} }];
      const result = await executeContactListsOperations.call(mockExecuteFunctions, items);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/contacts/lists',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': 'test-api-key',
        },
        body: { name: 'Test List', folderId: 1 },
        json: true,
      });
    });
  });

  describe('getAllLists operation', () => {
    it('should get all contact lists successfully', async () => {
      const mockResponse = { lists: [{ id: 1, name: 'List 1' }], count: 1 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllLists';
          case 'limit': return 10;
          case 'offset': return 0;
          case 'sort': return 'name:asc';
          default: return undefined;
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const items = [{ json: {} }];
      const result = await executeContactListsOperations.call(mockExecuteFunctions, items);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getList operation', () => {
    it('should get specific list details successfully', async () => {
      const mockResponse = { id: 123, name: 'Test List' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getList';
          case 'listId': return '123';
          default: return undefined;
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const items = [{ json: {} }];
      const result = await executeContactListsOperations.call(mockExecuteFunctions, items);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('addContactsToList operation', () => {
    it('should add contacts to list successfully', async () => {
      const mockResponse = { contacts: { success: ['test@example.com'] } };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'addContactsToList';
          case 'listId': return '123';
          case 'emails': return 'test@example.com,test2@example.com';
          default: return undefined;
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const items = [{ json: {} }];
      const result = await executeContactListsOperations.call(mockExecuteFunctions, items);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/contacts/lists/123/contacts/add',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': 'test-api-key',
        },
        body: {
          emails: ['test@example.com', 'test2@example.com'],
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getList';
          case 'listId': return '999';
          default: return undefined;
        }
      });
      
      const error = new Error('List not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      
      const items = [{ json: {} }];
      
      await expect(
        executeContactListsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('List not found');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getList';
          case 'listId': return '999';
          default: return undefined;
        }
      });
      
      const error = new Error('List not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      
      const items = [{ json: {} }];
      const result = await executeContactListsOperations.call(mockExecuteFunctions, items);
      
      expect(result).toEqual([{ json: { error: 'List not found' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('EmailCampaigns Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createCampaign operation', () => {
    it('should create a campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createCampaign';
          case 'name': return 'Test Campaign';
          case 'subject': return 'Test Subject';
          case 'senderName': return 'John Doe';
          case 'senderEmail': return 'john@example.com';
          case 'type': return 'classic';
          case 'htmlContent': return '<h1>Hello World</h1>';
          case 'recipients': return '1,2,3';
          default: return '';
        }
      });

      const mockResponse = { id: 123, name: 'Test Campaign' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEmailCampaignsOperations.call(mockExecuteFunctions, [{ json: {} }]);

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
          sender: {
            name: 'John Doe',
            email: 'john@example.com',
          },
          type: 'classic',
          htmlContent: '<h1>Hello World</h1>',
          recipients: {
            listIds: [1, 2, 3],
          },
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAllCampaigns operation', () => {
    it('should get all campaigns successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllCampaigns';
          case 'typeFilter': return 'classic';
          case 'status': return 'sent';
          case 'limit': return 25;
          case 'offset': return 0;
          default: return '';
        }
      });

      const mockResponse = { campaigns: [], count: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEmailCampaignsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.brevo.com/v3/emailCampaigns?type=classic&status=sent&limit=25&offset=0',
        headers: {
          'api-key': 'test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getCampaign operation', () => {
    it('should get a specific campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCampaign';
          case 'campaignId': return '123';
          default: return '';
        }
      });

      const mockResponse = { id: 123, name: 'Test Campaign' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEmailCampaignsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.brevo.com/v3/emailCampaigns/123',
        headers: {
          'api-key': 'test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('sendTestEmail operation', () => {
    it('should send test email successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'sendTestEmail';
          case 'campaignId': return '123';
          case 'emailTo': return 'test@example.com';
          default: return '';
        }
      });

      const mockResponse = { message: 'Test email sent' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEmailCampaignsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/emailCampaigns/123/sendTest',
        headers: {
          'api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          emailTo: ['test@example.com'],
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getCampaign';
        if (param === 'campaignId') return '123';
        return '';
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeEmailCampaignsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });

    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'unknownOperation';
        return '';
      });

      await expect(
        executeEmailCampaignsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('TransactionalEmails Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('sendTransactionalEmail', () => {
    it('should send transactional email successfully', async () => {
      const mockResponse = { messageId: 'test-message-id' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'sendTransactionalEmail';
          case 'sender': return '{"email": "sender@example.com", "name": "Sender"}';
          case 'to': return '[{"email": "recipient@example.com", "name": "Recipient"}]';
          case 'subject': return 'Test Subject';
          case 'htmlContent': return '<p>Test HTML content</p>';
          case 'textContent': return 'Test text content';
          case 'templateId': return 0;
          case 'params': return '{}';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionalEmailsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/smtp/email',
        headers: {
          'api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: {
          sender: { email: 'sender@example.com', name: 'Sender' },
          to: [{ email: 'recipient@example.com', name: 'Recipient' }],
          subject: 'Test Subject',
          htmlContent: '<p>Test HTML content</p>',
          textContent: 'Test text content',
        },
      });
    });

    it('should handle send email error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'sendTransactionalEmail';
          case 'sender': return '{"email": "sender@example.com"}';
          case 'to': return '[{"email": "recipient@example.com"}]';
          default: return '';
        }
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionalEmailsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAllTemplates', () => {
    it('should get all templates successfully', async () => {
      const mockResponse = { templates: [{ id: 1, name: 'Template 1' }] };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAllTemplates';
          case 'templateStatus': return 'true';
          case 'limit': return 10;
          case 'offset': return 0;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionalEmailsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTemplate', () => {
    it('should get specific template successfully', async () => {
      const mockResponse = { id: 1, name: 'Template 1', subject: 'Test Subject' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getTemplate';
          case 'templateId': return 1;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionalEmailsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.brevo.com/v3/smtp/templates/1',
        headers: {
          'api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('createTemplate', () => {
    it('should create template successfully', async () => {
      const mockResponse = { id: 123 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createTemplate';
          case 'templateName': return 'New Template';
          case 'subject': return 'New Subject';
          case 'sender': return '{"email": "sender@example.com", "name": "Sender"}';
          case 'htmlContent': return '<p>Template content</p>';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionalEmailsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getEmailEvents', () => {
    it('should get email events successfully', async () => {
      const mockResponse = { events: [{ event: 'delivered', email: 'test@example.com' }] };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getEmailEvents';
          case 'limit': return 50;
          case 'offset': return 0;
          case 'startDate': return '2023-01-01';
          case 'endDate': return '2023-12-31';
          case 'email': return 'test@example.com';
          case 'event': return 'delivered';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionalEmailsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('SMS Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('sendTransactionalSMS', () => {
    it('should send transactional SMS successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'sendTransactionalSMS';
          case 'sender': return 'TestSender';
          case 'recipient': return '+1234567890';
          case 'content': return 'Test SMS message';
          case 'type': return 'transactional';
          case 'tag': return 'test-tag';
          default: return '';
        }
      });

      const mockResponse = { messageId: 'sms-123', credits: 1 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/transactionalSMS/sms',
        headers: {
          'api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          sender: 'TestSender',
          recipient: '+1234567890',
          content: 'Test SMS message',
          type: 'transactional',
          tag: 'test-tag',
        },
      });
    });
  });

  describe('getSMSEvents', () => {
    it('should get SMS events successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getSMSEvents';
          case 'limit': return 10;
          case 'offset': return 0;
          case 'event': return 'delivered';
          default: return '';
        }
      });

      const mockResponse = { events: [], count: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('createSMSCampaign', () => {
    it('should create SMS campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createSMSCampaign';
          case 'name': return 'Test Campaign';
          case 'sender': return 'TestSender';
          case 'content': return 'Campaign message';
          case 'recipients': return '{"listIds": [1, 2]}';
          default: return '';
        }
      });

      const mockResponse = { id: 123, name: 'Test Campaign' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle invalid recipients JSON', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createSMSCampaign';
          case 'recipients': return 'invalid-json';
          default: return '';
        }
      });

      await expect(executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });
  });

  describe('getAllSMSCampaigns', () => {
    it('should get all SMS campaigns successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllSMSCampaigns';
          case 'status': return 'sent';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return '';
        }
      });

      const mockResponse = { campaigns: [], count: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getSMSCampaign', () => {
    it('should get specific SMS campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getSMSCampaign';
          case 'campaignId': return 123;
          default: return '';
        }
      });

      const mockResponse = { id: 123, name: 'Test Campaign' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateSMSCampaign', () => {
    it('should update SMS campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'updateSMSCampaign';
          case 'campaignId': return 123;
          case 'name': return 'Updated Campaign';
          case 'content': return 'Updated content';
          default: return '';
        }
      });

      const mockResponse = { message: 'Campaign updated successfully' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('deleteSMSCampaign', () => {
    it('should delete SMS campaign successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'deleteSMSCampaign';
          case 'campaignId': return 123;
          default: return '';
        }
      });

      const mockResponse = { message: 'Campaign deleted successfully' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('sendSMSCampaignNow', () => {
    it('should send SMS campaign now successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'sendSMSCampaignNow';
          case 'campaignId': return 123;
          default: return '';
        }
      });

      const mockResponse = { message: 'Campaign sent successfully' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'unknownOperation';
        return '';
      });

      await expect(executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'unknownOperation';
        return '';
      });
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSMSOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBeDefined();
    });
  });
});
});
