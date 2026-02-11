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

    it('should define 1 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(1);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(1);
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
describe('Utility Resource', () => {
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

  describe('contacts operation', () => {
    it('should successfully get contacts statistics', async () => {
      const mockResponse = {
        totalContacts: 1000,
        activeContacts: 850,
        inactiveContacts: 150,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'contacts';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/utility/contacts',
        headers: {
          'api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle API errors for contacts operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'contacts';
        return undefined;
      });

      const mockError = new Error('API Error');
      mockError.response = { body: { message: 'Invalid API key' } };
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(
        executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('emailCampaigns operation', () => {
    it('should successfully get email campaigns statistics', async () => {
      const mockResponse = {
        totalCampaigns: 50,
        sentCampaigns: 45,
        draftCampaigns: 5,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'emailCampaigns';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.brevo.com/v3/utility/emailCampaigns',
        headers: {
          'api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('transactionalEmails operation', () => {
    it('should successfully get transactional emails statistics', async () => {
      const mockResponse = {
        totalTransactionalEmails: 10000,
        delivered: 9800,
        bounced: 200,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'transactionalEmails';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('sms operation', () => {
    it('should successfully get SMS statistics', async () => {
      const mockResponse = {
        totalSMS: 500,
        sent: 480,
        failed: 20,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'sms';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('lists operation', () => {
    it('should successfully get lists statistics', async () => {
      const mockResponse = {
        totalLists: 25,
        activeLists: 20,
        emptyLists: 5,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'lists';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'unknownOperation';
        return undefined;
      });

      await expect(
        executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'contacts';
        return undefined;
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API Error' });
    });
  });
});
});
