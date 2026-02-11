/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-brevo/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';



export class Brevo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Brevo',
    name: 'brevo',
    icon: 'file:brevo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Brevo API',
    defaults: {
      name: 'Brevo',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'brevoApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Utility',
            value: 'utility',
          }
        ],
        default: 'utility',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['utility'],
    },
  },
  options: [
    {
      name: 'Get Contacts',
      value: 'getContacts',
      description: 'Get utility information for contacts',
      action: 'Get contacts utility data',
    },
    {
      name: 'Get Email Campaigns',
      value: 'getEmailCampaigns',
      description: 'Get utility information for email campaigns',
      action: 'Get email campaigns utility data',
    },
    {
      name: 'Get Transactional Emails',
      value: 'getTransactionalEmails',
      description: 'Get utility information for transactional emails',
      action: 'Get transactional emails utility data',
    },
    {
      name: 'Get SMS',
      value: 'getSms',
      description: 'Get utility information for SMS',
      action: 'Get SMS utility data',
    },
    {
      name: 'Get Lists',
      value: 'getLists',
      description: 'Get utility information for lists',
      action: 'Get lists utility data',
    },
  ],
  default: 'getContacts',
},
      // Parameter definitions
,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'utility':
        return [await executeUtilityOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeUtilityOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  const credentials = await this.getCredentials('brevoApi');
  const apiKey = credentials.apiKey as string;
  const baseUrl = (credentials.baseUrl as string) || 'https://api.brevo.com/v3';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      let endpoint: string;
      
      const options: IHttpRequestOptions = {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        url: '',
        json: {},
      };

      switch (operation) {
        case 'getContacts':
          endpoint = '/utility/contacts';
          options.url = `${baseUrl}${endpoint}`;
          result = await this.helpers.httpRequest(options);
          break;

        case 'getEmailCampaigns':
          endpoint = '/utility/emailCampaigns';
          options.url = `${baseUrl}${endpoint}`;
          result = await this.helpers.httpRequest(options);
          break;

        case 'getTransactionalEmails':
          endpoint = '/utility/transactionalEmails';
          options.url = `${baseUrl}${endpoint}`;
          result = await this.helpers.httpRequest(options);
          break;

        case 'getSms':
          endpoint = '/utility/sms';
          options.url = `${baseUrl}${endpoint}`;
          result = await this.helpers.httpRequest(options);
          break;

        case 'getLists':
          endpoint = '/utility/lists';
          options.url = `${baseUrl}${endpoint}`;
          result = await this.helpers.httpRequest(options);
          break;

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}
