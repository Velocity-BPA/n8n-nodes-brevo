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
      name: 'Get Contacts Statistics',
      value: 'contacts',
      description: 'Get contacts statistics and information',
      action: 'Get contacts statistics',
    },
    {
      name: 'Get Email Campaigns Statistics',
      value: 'emailCampaigns',
      description: 'Get email campaigns statistics and information',
      action: 'Get email campaigns statistics',
    },
    {
      name: 'Get Transactional Emails Statistics',
      value: 'transactionalEmails',
      description: 'Get transactional emails statistics and information',
      action: 'Get transactional emails statistics',
    },
    {
      name: 'Get SMS Statistics',
      value: 'sms',
      description: 'Get SMS statistics and information',
      action: 'Get SMS statistics',
    },
    {
      name: 'Get Lists Statistics',
      value: 'lists',
      description: 'Get lists statistics and information',
      action: 'Get lists statistics',
    },
  ],
  default: 'contacts',
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
  const baseUrl = credentials.baseUrl as string || 'https://api.brevo.com/v3';
  const apiKey = credentials.apiKey as string;

  const requestOptions = {
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    json: true,
  };

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      let endpoint: string;

      switch (operation) {
        case 'contacts':
          endpoint = `${baseUrl}/utility/contacts`;
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: endpoint,
            ...requestOptions,
          });
          break;

        case 'emailCampaigns':
          endpoint = `${baseUrl}/utility/emailCampaigns`;
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: endpoint,
            ...requestOptions,
          });
          break;

        case 'transactionalEmails':
          endpoint = `${baseUrl}/utility/transactionalEmails`;
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: endpoint,
            ...requestOptions,
          });
          break;

        case 'sms':
          endpoint = `${baseUrl}/utility/sms`;
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: endpoint,
            ...requestOptions,
          });
          break;

        case 'lists':
          endpoint = `${baseUrl}/utility/lists`;
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: endpoint,
            ...requestOptions,
          });
          break;

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response?.body) {
          throw new NodeApiError(this.getNode(), error.response.body);
        }
        throw error;
      }
    }
  }

  return returnData;
}
