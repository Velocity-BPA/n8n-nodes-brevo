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
  JsonObject,
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
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'ContactLists',
            value: 'contactLists',
          },
          {
            name: 'Campaign',
            value: 'campaign',
          },
          {
            name: 'EmailCampaigns',
            value: 'emailCampaigns',
          },
          {
            name: 'TransactionalEmail',
            value: 'transactionalEmail',
          },
          {
            name: 'TransactionalEmails',
            value: 'transactionalEmails',
          },
          {
            name: 'SMS',
            value: 'sMS',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          },
          {
            name: 'Sender',
            value: 'sender',
          }
        ],
        default: 'contact',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['contact'],
    },
  },
  options: [
    {
      name: 'Create',
      value: 'createContact',
      description: 'Create a new contact',
      action: 'Create contact',
    },
    {
      name: 'Get',
      value: 'getContact',
      description: 'Get contact information',
      action: 'Get contact',
    },
    {
      name: 'Get All',
      value: 'getAllContacts',
      description: 'Get all contacts with filtering',
      action: 'Get all contacts',
    },
    {
      name: 'Update',
      value: 'updateContact',
      description: 'Update contact attributes',
      action: 'Update contact',
    },
    {
      name: 'Delete',
      value: 'deleteContact',
      description: 'Delete a contact',
      action: 'Delete contact',
    },
    {
      name: 'Import',
      value: 'importContacts',
      description: 'Import contacts from file',
      action: 'Import contacts',
    },
    {
      name: 'Get Contact Lists',
      value: 'getContactLists',
      description: 'Get all contact lists',
      action: 'Get contact lists',
    },
    {
      name: 'Create Contact List',
      value: 'createContactList',
      description: 'Create a new contact list',
      action: 'Create contact list',
    },
    {
      name: 'Get Contact List',
      value: 'getContactList',
      description: 'Get specific contact list details',
      action: 'Get contact list',
    },
    {
      name: 'Update Contact List',
      value: 'updateContactList',
      description: 'Update contact list name',
      action: 'Update contact list',
    },
    {
      name: 'Delete Contact List',
      value: 'deleteContactList',
      description: 'Delete a contact list',
      action: 'Delete contact list',
    },
  ],
  default: 'createContact',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
    },
  },
  options: [
    {
      name: 'Create List',
      value: 'createList',
      description: 'Create a new contact list',
      action: 'Create a contact list',
    },
    {
      name: 'Get All Lists',
      value: 'getAllLists',
      description: 'Get all contact lists',
      action: 'Get all contact lists',
    },
    {
      name: 'Get List',
      value: 'getList',
      description: 'Get specific list details',
      action: 'Get a contact list',
    },
    {
      name: 'Update List',
      value: 'updateList',
      description: 'Update list properties',
      action: 'Update a contact list',
    },
    {
      name: 'Delete List',
      value: 'deleteList',
      description: 'Delete a contact list',
      action: 'Delete a contact list',
    },
    {
      name: 'Add Contacts to List',
      value: 'addContactsToList',
      description: 'Add contacts to list',
      action: 'Add contacts to list',
    },
    {
      name: 'Remove Contacts from List',
      value: 'removeContactsFromList',
      description: 'Remove contacts from list',
      action: 'Remove contacts from list',
    },
  ],
  default: 'createList',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['campaign'] } },
  options: [
    { name: 'Create Email Campaign', value: 'createEmailCampaign', description: 'Create a new email campaign', action: 'Create email campaign' },
    { name: 'Get Campaign', value: 'getCampaign', description: 'Get campaign details by ID', action: 'Get campaign' },
    { name: 'Get All Campaigns', value: 'getAllCampaigns', description: 'Get all email campaigns', action: 'Get all campaigns' },
    { name: 'Update Campaign', value: 'updateCampaign', description: 'Update campaign details', action: 'Update campaign' },
    { name: 'Delete Campaign', value: 'deleteCampaign', description: 'Delete a campaign', action: 'Delete campaign' },
    { name: 'Send Campaign', value: 'sendCampaign', description: 'Send campaign immediately', action: 'Send campaign' },
    { name: 'Send Test Campaign', value: 'sendTestCampaign', description: 'Send test campaign to specific emails', action: 'Send test campaign' },
  ],
  default: 'createEmailCampaign',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
    },
  },
  options: [
    {
      name: 'Create Campaign',
      value: 'createCampaign',
      description: 'Create a new email campaign',
      action: 'Create campaign',
    },
    {
      name: 'Get All Campaigns',
      value: 'getAllCampaigns',
      description: 'Get all email campaigns',
      action: 'Get all campaigns',
    },
    {
      name: 'Get Campaign',
      value: 'getCampaign',
      description: 'Get specific campaign details',
      action: 'Get campaign',
    },
    {
      name: 'Update Campaign',
      value: 'updateCampaign',
      description: 'Update an existing campaign',
      action: 'Update campaign',
    },
    {
      name: 'Delete Campaign',
      value: 'deleteCampaign',
      description: 'Delete a campaign',
      action: 'Delete campaign',
    },
    {
      name: 'Send Campaign Now',
      value: 'sendCampaignNow',
      description: 'Send campaign immediately',
      action: 'Send campaign now',
    },
    {
      name: 'Send Test Email',
      value: 'sendTestEmail',
      description: 'Send test campaign email',
      action: 'Send test email',
    },
  ],
  default: 'createCampaign',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
    },
  },
  options: [
    {
      name: 'Send Transactional Email',
      value: 'sendTransactionalEmail',
      description: 'Send a transactional email',
      action: 'Send transactional email',
    },
    {
      name: 'Get Email Templates',
      value: 'getEmailTemplates',
      description: 'Get all email templates',
      action: 'Get email templates',
    },
    {
      name: 'Create Email Template',
      value: 'createEmailTemplate',
      description: 'Create a new email template',
      action: 'Create email template',
    },
    {
      name: 'Get Email Template',
      value: 'getEmailTemplate',
      description: 'Get specific email template',
      action: 'Get email template',
    },
    {
      name: 'Update Email Template',
      value: 'updateEmailTemplate',
      description: 'Update email template',
      action: 'Update email template',
    },
    {
      name: 'Delete Email Template',
      value: 'deleteEmailTemplate',
      description: 'Delete email template',
      action: 'Delete email template',
    },
    {
      name: 'Get Transactional Email Events',
      value: 'getTransactionalEmailEvents',
      description: 'Get email events and statistics',
      action: 'Get transactional email events',
    },
  ],
  default: 'sendTransactionalEmail',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
    },
  },
  options: [
    {
      name: 'Send Transactional Email',
      value: 'sendTransactionalEmail',
      description: 'Send a transactional email',
      action: 'Send transactional email',
    },
    {
      name: 'Get All Templates',
      value: 'getAllTemplates',
      description: 'Get all transactional email templates',
      action: 'Get all templates',
    },
    {
      name: 'Get Template',
      value: 'getTemplate',
      description: 'Get a specific email template',
      action: 'Get template',
    },
    {
      name: 'Create Template',
      value: 'createTemplate',
      description: 'Create an email template',
      action: 'Create template',
    },
    {
      name: 'Update Template',
      value: 'updateTemplate',
      description: 'Update an email template',
      action: 'Update template',
    },
    {
      name: 'Delete Template',
      value: 'deleteTemplate',
      description: 'Delete an email template',
      action: 'Delete template',
    },
    {
      name: 'Get Email Events',
      value: 'getEmailEvents',
      description: 'Get transactional email events',
      action: 'Get email events',
    },
  ],
  default: 'sendTransactionalEmail',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['sMS'] } },
  options: [
    { name: 'Send Transactional SMS', value: 'sendTransactionalSMS', description: 'Send a transactional SMS', action: 'Send transactional SMS' },
    { name: 'Get SMS Events', value: 'getSMSEvents', description: 'Get SMS events and delivery statistics', action: 'Get SMS events' },
    { name: 'Create SMS Campaign', value: 'createSMSCampaign', description: 'Create SMS campaign', action: 'Create SMS campaign' },
    { name: 'Get All SMS Campaigns', value: 'getAllSMSCampaigns', description: 'Get all SMS campaigns', action: 'Get all SMS campaigns' },
    { name: 'Get SMS Campaign', value: 'getSMSCampaign', description: 'Get SMS campaign details', action: 'Get SMS campaign' },
    { name: 'Update SMS Campaign', value: 'updateSMSCampaign', description: 'Update SMS campaign', action: 'Update SMS campaign' },
    { name: 'Delete SMS Campaign', value: 'deleteSMSCampaign', description: 'Delete SMS campaign', action: 'Delete SMS campaign' },
    {
      name: 'Send SMS Campaign Now',
      value: 'sendSMSCampaignNow',
      description: 'Send SMS campaign immediately',
      action: 'Send SMS campaign now',
    },
  ],
  default: 'sendTransactionalSMS',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['webhook'],
    },
  },
  options: [
    {
      name: 'Create Webhook',
      value: 'createWebhook',
      description: 'Create a new webhook',
      action: 'Create webhook',
    },
    {
      name: 'Get All Webhooks',
      value: 'getAllWebhooks',
      description: 'Get all webhooks',
      action: 'Get all webhooks',
    },
    {
      name: 'Get Webhook',
      value: 'getWebhook',
      description: 'Get webhook details',
      action: 'Get webhook',
    },
    {
      name: 'Update Webhook',
      value: 'updateWebhook',
      description: 'Update webhook configuration',
      action: 'Update webhook',
    },
    {
      name: 'Delete Webhook',
      value: 'deleteWebhook',
      description: 'Delete a webhook',
      action: 'Delete webhook',
    },
  ],
  default: 'createWebhook',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['sender'] } },
  options: [
    { name: 'Get All Senders', value: 'getAllSenders', description: 'Get all sender identities', action: 'Get all senders' },
    { name: 'Create Sender', value: 'createSender', description: 'Create a new sender identity', action: 'Create sender' },
    { name: 'Update Sender', value: 'updateSender', description: 'Update sender identity', action: 'Update sender' },
    { name: 'Delete Sender', value: 'deleteSender', description: 'Delete sender identity', action: 'Delete sender' },
    { name: 'Get Sender IPs', value: 'getSenderIps', description: 'Get IPs associated with sender', action: 'Get sender IPs' }
  ],
  default: 'getAllSenders',
},
      // Parameter definitions
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['createContact'],
    },
  },
  default: '',
  description: 'Email address of the contact',
},
{
  displayName: 'Attributes',
  name: 'attributes',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['createContact', 'updateContact'],
    },
  },
  default: {},
  description: 'Contact attributes',
  options: [
    {
      name: 'attributesValues',
      displayName: 'Attribute',
      values: [
        {
          displayName: 'Name',
          name: 'name',
          type: 'string',
          default: '',
          description: 'Attribute name',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'Attribute value',
        },
      ],
    },
  ],
},
{
  displayName: 'List IDs',
  name: 'listIds',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['createContact', 'updateContact', 'importContacts'],
    },
  },
  default: '',
  description: 'Comma-separated list of list IDs to add the contact to',
},
{
  displayName: 'Update Enabled',
  name: 'updateEnabled',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['createContact'],
    },
  },
  default: false,
  description: 'Facilitate to update existing contact in same list',
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['getContact', 'updateContact', 'deleteContact'],
    },
  },
  default: '',
  description: 'Email address or ID of the contact',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['getAllContacts', 'getContactLists'],
    },
  },
  default: 50,
  description: 'Number of documents to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['getAllContacts', 'getContactLists'],
    },
  },
  default: 0,
  description: 'Index of the first document on the page',
},
{
  displayName: 'Modified Since',
  name: 'modifiedSince',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['getAllContacts'],
    },
  },
  default: '',
  description: 'Retrieve only contacts modified since this date',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['getAllContacts', 'getContactLists'],
    },
  },
  options: [
    {
      name: 'Created At Ascending',
      value: 'createdAt:asc',
    },
    {
      name: 'Created At Descending',
      value: 'createdAt:desc',
    },
    {
      name: 'Modified At Ascending',
      value: 'modifiedAt:asc',
    },
    {
      name: 'Modified At Descending',
      value: 'modifiedAt:desc',
    },
  ],
  default: 'createdAt:asc',
  description: 'Sort the results by a specific criteria',
},
{
  displayName: 'File Body',
  name: 'fileBody',
  type: 'string',
  typeOptions: { rows: 4 },
  required: true,
  displayOptions: { show: { resource: ['contact'], operation: ['importContacts'] } },
  default: '',
  description: 'CSV content or file content for bulk import',
},
{
  displayName: 'File URL',
  name: 'fileUrl',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['importContacts'],
    },
  },
  default: '',
  description: 'Mandatory if file is not specified. CSV file URL to import contacts',
},
{
  displayName: 'Notify URL',
  name: 'notifyUrl',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['importContacts'],
    },
  },
  default: '',
  description: 'URL that will be called once the import is finished',
},
{
  displayName: 'New List',
  name: 'newList',
  type: 'fixedCollection',
  displayOptions: {
    show: {
      resource: ['contact'],
      operation: ['importContacts'],
    },
  },
  default: {},
  description: 'Create a new list',
  options: [
    {
      name: 'listData',
      displayName: 'List Data',
      values: [
        {
          displayName: 'List Name',
          name: 'listName',
          type: 'string',
          default: '',
          description: 'Name of the new list',
        },
        {
          displayName: 'Folder ID',
          name: 'folderId',
          type: 'number',
          default: 0,
          description: 'ID of the folder where the list should be created',
        },
      ],
    },
  ],
},
{
  displayName: 'List ID',
  name: 'listId',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['contact'], operation: ['getContactList', 'updateContactList', 'deleteContactList'] } },
  default: 0,
  description: 'Contact list ID',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contact'], operation: ['createContactList', 'updateContactList'] } },
  default: '',
  description: 'Contact list name',
},
{
  displayName: 'Folder ID',
  name: 'folderId',
  type: 'number',
  displayOptions: { show: { resource: ['contact'], operation: ['createContactList'] } },
  default: 0,
  description: 'Folder ID to organize the contact list',
},
{
  displayName: 'List Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['createList'],
    },
  },
  default: '',
  description: 'The name of the contact list',
},
{
  displayName: 'Folder ID',
  name: 'folderId',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['createList'],
    },
  },
  default: '',
  description: 'The ID of the folder where the list should be created',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['getAllLists'],
    },
  },
  default: 10,
  description: 'Number of lists to return (max 50)',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['getAllLists'],
    },
  },
  default: 0,
  description: 'Index of the first list to return',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['getAllLists'],
    },
  },
  options: [
    {
      name: 'Name Ascending',
      value: 'name:asc',
    },
    {
      name: 'Name Descending',
      value: 'name:desc',
    },
  ],
  default: 'name:asc',
  description: 'Sort order for the lists',
},
{
  displayName: 'List ID',
  name: 'listId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['getList'],
    },
  },
  default: '',
  description: 'The ID of the list to retrieve',
},
{
  displayName: 'List ID',
  name: 'listId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['updateList'],
    },
  },
  default: '',
  description: 'The ID of the list to update',
},
{
  displayName: 'List Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['updateList'],
    },
  },
  default: '',
  description: 'The new name of the contact list',
},
{
  displayName: 'Folder ID',
  name: 'folderId',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['updateList'],
    },
  },
  default: '',
  description: 'The ID of the folder where the list should be moved',
},
{
  displayName: 'List ID',
  name: 'listId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['deleteList'],
    },
  },
  default: '',
  description: 'The ID of the list to delete',
},
{
  displayName: 'List ID',
  name: 'listId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['addContactsToList'],
    },
  },
  default: '',
  description: 'The ID of the list to add contacts to',
},
{
  displayName: 'Emails',
  name: 'emails',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['addContactsToList'],
    },
  },
  default: '',
  description: 'Comma-separated list of email addresses to add to the list',
},
{
  displayName: 'List ID',
  name: 'listId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['removeContactsFromList'],
    },
  },
  default: '',
  description: 'The ID of the list to remove contacts from',
},
{
  displayName: 'Emails',
  name: 'emails',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contactLists'],
      operation: ['removeContactsFromList'],
    },
  },
  default: '',
  description: 'Comma-separated list of email addresses to remove from the list',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'] } },
  description: 'Name of the campaign',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'] } },
  description: 'Subject line of the email campaign',
},
{
  displayName: 'Sender Name',
  name: 'senderName',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'] } },
  description: 'Name of the sender',
},
{
  displayName: 'Sender Email',
  name: 'senderEmail',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'] } },
  description: 'Email address of the sender',
},
{
  displayName: 'HTML Content',
  name: 'htmlContent',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'] } },
  description: 'HTML content of the email',
  typeOptions: { rows: 5 },
},
{
  displayName: 'Recipients Type',
  name: 'recipientsType',
  type: 'options',
  required: true,
  default: 'listIds',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'] } },
  options: [
    { name: 'List IDs', value: 'listIds' },
    { name: 'Exclusion List IDs', value: 'exclusionListIds' },
  ],
  description: 'Type of recipients to target',
},
{
  displayName: 'List IDs',
  name: 'listIds',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'], recipientsType: ['listIds'] } },
  description: 'Comma-separated list of contact list IDs to send the campaign to',
},
{
  displayName: 'Exclusion List IDs',
  name: 'exclusionListIds',
  type: 'string',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['createEmailCampaign'] } },
  description: 'Comma-separated list of contact list IDs to exclude from the campaign',
},
{
  displayName: 'Campaign ID',
  name: 'campaignId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['getCampaign', 'updateCampaign', 'deleteCampaign', 'sendCampaign', 'sendTestCampaign'] } },
  description: 'ID of the campaign',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['getAllCampaigns'] } },
  options: [
    { name: 'Classic', value: 'classic' },
    { name: 'Trigger', value: 'trigger' },
  ],
  description: 'Type of campaign to filter by',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['getAllCampaigns'] } },
  options: [
    { name: 'Draft', value: 'draft' },
    { name: 'Sent', value: 'sent' },
    { name: 'Archive', value: 'archive' },
    { name: 'Queued', value: 'queued' },
    { name: 'Suspended', value: 'suspended' },
    { name: 'In Process', value: 'inProcess' },
  ],
  description: 'Status of campaigns to filter by',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['getAllCampaigns'] } },
  description: 'Start date to filter campaigns (YYYY-MM-DD format)',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['getAllCampaigns'] } },
  description: 'End date to filter campaigns (YYYY-MM-DD format)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  default: 50,
  displayOptions: { show: { resource: ['campaign'], operation: ['getAllCampaigns'] } },
  description: 'Number of campaigns to return (max 1000)',
  typeOptions: { minValue: 1, maxValue: 1000 },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  default: 0,
  displayOptions: { show: { resource: ['campaign'], operation: ['getAllCampaigns'] } },
  description: 'Index of the first campaign to return',
  typeOptions: { minValue: 0 },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['updateCampaign'] } },
  description: 'New name of the campaign',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['updateCampaign'] } },
  description: 'New subject line of the email campaign',
},
{
  displayName: 'HTML Content',
  name: 'htmlContent',
  type: 'string',
  required: false,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['updateCampaign'] } },
  description: 'New HTML content of the email',
  typeOptions: { rows: 5 },
},
{
  displayName: 'Email To',
  name: 'emailTo',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['campaign'], operation: ['sendTestCampaign'] } },
  description: 'Comma-separated list of email addresses to send the test campaign to',
},
{
  displayName: 'Campaign Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['createCampaign'],
    },
  },
  default: '',
  description: 'Name of the email campaign',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['createCampaign'],
    },
  },
  default: '',
  description: 'Subject line of the email',
},
{
  displayName: 'Sender Name',
  name: 'senderName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['createCampaign'],
    },
  },
  default: '',
  description: 'Name of the sender',
},
{
  displayName: 'Sender Email',
  name: 'senderEmail',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['createCampaign'],
    },
  },
  default: '',
  description: 'Email address of the sender',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  options: [
    {
      name: 'Classic',
      value: 'classic',
    },
    {
      name: 'Trigger',
      value: 'trigger',
    },
  ],
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['createCampaign'],
    },
  },
  default: 'classic',
  description: 'Type of the campaign',
},
{
  displayName: 'HTML Content',
  name: 'htmlContent',
  type: 'string',
  typeOptions: {
    rows: 5,
  },
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['createCampaign'],
    },
  },
  default: '',
  description: 'HTML content of the email',
},
{
  displayName: 'Recipients',
  name: 'recipients',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['createCampaign'],
    },
  },
  default: '',
  description: 'List IDs for recipients (comma separated)',
},
{
  displayName: 'Type Filter',
  name: 'typeFilter',
  type: 'options',
  options: [
    {
      name: 'Classic',
      value: 'classic',
    },
    {
      name: 'Trigger',
      value: 'trigger',
    },
  ],
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['getAllCampaigns'],
    },
  },
  default: '',
  description: 'Filter campaigns by type',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    {
      name: 'Draft',
      value: 'draft',
    },
    {
      name: 'Sent',
      value: 'sent',
    },
    {
      name: 'Archive',
      value: 'archive',
    },
    {
      name: 'Queued',
      value: 'queued',
    },
    {
      name: 'Suspended',
      value: 'suspended',
    },
    {
      name: 'In Process',
      value: 'in_process',
    },
  ],
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['getAllCampaigns'],
    },
  },
  default: '',
  description: 'Filter campaigns by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['getAllCampaigns'],
    },
  },
  default: 50,
  description: 'Number of campaigns to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['getAllCampaigns'],
    },
  },
  default: 0,
  description: 'Index of the first campaign to retrieve',
},
{
  displayName: 'Campaign ID',
  name: 'campaignId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['getCampaign', 'updateCampaign', 'deleteCampaign', 'sendCampaignNow', 'sendTestEmail'],
    },
  },
  default: '',
  description: 'ID of the campaign',
},
{
  displayName: 'Campaign Name',
  name: 'name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['updateCampaign'],
    },
  },
  default: '',
  description: 'Updated name of the email campaign',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['updateCampaign'],
    },
  },
  default: '',
  description: 'Updated subject line of the email',
},
{
  displayName: 'Sender Name',
  name: 'senderName',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['updateCampaign'],
    },
  },
  default: '',
  description: 'Updated name of the sender',
},
{
  displayName: 'Sender Email',
  name: 'senderEmail',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['updateCampaign'],
    },
  },
  default: '',
  description: 'Updated email address of the sender',
},
{
  displayName: 'HTML Content',
  name: 'htmlContent',
  type: 'string',
  typeOptions: {
    rows: 5,
  },
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['updateCampaign'],
    },
  },
  default: '',
  description: 'Updated HTML content of the email',
},
{
  displayName: 'Test Email Address',
  name: 'emailTo',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailCampaigns'],
      operation: ['sendTestEmail'],
    },
  },
  default: '',
  description: 'Email address to send the test to',
},
{
  displayName: 'Sender Email',
  name: 'senderEmail',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  placeholder: 'sender@example.com',
  description: 'Email address of the sender',
},
{
  displayName: 'Sender Name',
  name: 'senderName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  description: 'Name of the sender',
},
{
  displayName: 'To Email',
  name: 'toEmail',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  placeholder: 'recipient@example.com',
  description: 'Email address of the recipient',
},
{
  displayName: 'To Name',
  name: 'toName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  description: 'Name of the recipient',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail', 'createEmailTemplate'],
    },
  },
  default: '',
  description: 'Subject of the email',
},
{
  displayName: 'HTML Content',
  name: 'htmlContent',
  type: 'string',
  typeOptions: {
    alwaysOpenEditWindow: true,
  },
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail', 'createEmailTemplate', 'updateEmailTemplate'],
    },
  },
  default: '',
  description: 'HTML content of the email',
},
{
  displayName: 'Text Content',
  name: 'textContent',
  type: 'string',
  typeOptions: {
    alwaysOpenEditWindow: true,
  },
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  description: 'Text content of the email',
},
{
  displayName: 'Template ID',
  name: 'templateId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getEmailTemplate', 'updateEmailTemplate', 'deleteEmailTemplate'],
    },
  },
  default: 0,
  description: 'ID of the email template',
},
{
  displayName: 'Use Template ID',
  name: 'useTemplateId',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: false,
  description: 'Whether to use a template ID instead of content',
},
{
  displayName: 'Template ID',
  name: 'templateIdSend',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['sendTransactionalEmail'],
      useTemplateId: [true],
    },
  },
  default: 0,
  description: 'ID of the email template to use',
},
{
  displayName: 'Template Status',
  name: 'templateStatus',
  type: 'options',
  options: [
    {
      name: 'True',
      value: 'true',
    },
    {
      name: 'False',
      value: 'false',
    },
  ],
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getEmailTemplates'],
    },
  },
  default: '',
  description: 'Status of the template',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getEmailTemplates', 'getTransactionalEmailEvents'],
    },
  },
  default: 50,
  description: 'Number of documents to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getEmailTemplates', 'getTransactionalEmailEvents'],
    },
  },
  default: 0,
  description: 'Index of the first document in the page',
},
{
  displayName: 'Template Name',
  name: 'templateName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['createEmailTemplate', 'updateEmailTemplate'],
    },
  },
  default: '',
  description: 'Name of the template',
},
{
  displayName: 'Template Sender Email',
  name: 'templateSenderEmail',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['createEmailTemplate'],
    },
  },
  default: '',
  placeholder: 'sender@example.com',
  description: 'Email address of the sender for the template',
},
{
  displayName: 'Template Sender Name',
  name: 'templateSenderName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['createEmailTemplate'],
    },
  },
  default: '',
  description: 'Name of the sender for the template',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getTransactionalEmailEvents'],
    },
  },
  default: '',
  description: 'Mandatory if endDate is used. Starting date (YYYY-MM-DD) of the statistic events',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getTransactionalEmailEvents'],
    },
  },
  default: '',
  description: 'Mandatory if startDate is used. Ending date (YYYY-MM-DD) of the statistic events',
},
{
  displayName: 'Days',
  name: 'days',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getTransactionalEmailEvents'],
    },
  },
  default: 0,
  description: 'Number of days in the past including today (positive integer)',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmail'],
      operation: ['getTransactionalEmailEvents'],
    },
  },
  default: '',
  description: 'Filter by specific email address',
},
{
  displayName: 'Sender',
  name: 'sender',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '{"email": "sender@example.com", "name": "Sender Name"}',
  description: 'Sender information with email and name',
},
{
  displayName: 'To Recipients',
  name: 'to',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '[{"email": "recipient@example.com", "name": "Recipient Name"}]',
  description: 'Array of recipient objects with email and name',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  description: 'Email subject (not required if using template)',
},
{
  displayName: 'HTML Content',
  name: 'htmlContent',
  type: 'string',
  typeOptions: {
    rows: 4,
  },
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  description: 'HTML content of the email',
},
{
  displayName: 'Text Content',
  name: 'textContent',
  type: 'string',
  typeOptions: {
    rows: 4,
  },
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '',
  description: 'Text content of the email',
},
{
  displayName: 'Template ID',
  name: 'templateId',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: 0,
  description: 'ID of the template to use',
},
{
  displayName: 'Template Parameters',
  name: 'params',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['sendTransactionalEmail'],
    },
  },
  default: '{}',
  description: 'Parameters to pass to the template',
},
{
  displayName: 'Template Status',
  name: 'templateStatus',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getAllTemplates'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'True',
      value: 'true',
    },
    {
      name: 'False',
      value: 'false',
    },
  ],
  default: '',
  description: 'Filter templates by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getAllTemplates', 'getEmailEvents'],
    },
  },
  default: 50,
  description: 'Number of records to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getAllTemplates', 'getEmailEvents'],
    },
  },
  default: 0,
  description: 'Number of records to skip',
},
{
  displayName: 'Template ID',
  name: 'templateId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getTemplate', 'updateTemplate', 'deleteTemplate'],
    },
  },
  default: 0,
  description: 'ID of the template',
},
{
  displayName: 'Template Name',
  name: 'templateName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['createTemplate', 'updateTemplate'],
    },
  },
  default: '',
  description: 'Name of the template',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['createTemplate', 'updateTemplate'],
    },
  },
  default: '',
  description: 'Subject of the template',
},
{
  displayName: 'Sender',
  name: 'sender',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['createTemplate'],
    },
  },
  default: '{"email": "sender@example.com", "name": "Sender Name"}',
  description: 'Sender information with email and name',
},
{
  displayName: 'HTML Content',
  name: 'htmlContent',
  type: 'string',
  typeOptions: {
    rows: 4,
  },
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['createTemplate', 'updateTemplate'],
    },
  },
  default: '',
  description: 'HTML content of the template',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getEmailEvents'],
    },
  },
  default: '',
  description: 'Start date (YYYY-MM-DD format)',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getEmailEvents'],
    },
  },
  default: '',
  description: 'End date (YYYY-MM-DD format)',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getEmailEvents'],
    },
  },
  default: '',
  description: 'Filter events by email address',
},
{
  displayName: 'Event',
  name: 'event',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactionalEmails'],
      operation: ['getEmailEvents'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Bounces',
      value: 'bounces',
    },
    {
      name: 'Hard Bounces',
      value: 'hardBounces',
    },
    {
      name: 'Soft Bounces',
      value: 'softBounces',
    },
    {
      name: 'Delivered',
      value: 'delivered',
    },
    {
      name: 'Spam',
      value: 'spam',
    },
    {
      name: 'Requests',
      value: 'requests',
    },
    {
      name: 'Opened',
      value: 'opened',
    },
    {
      name: 'Clicks',
      value: 'clicks',
    },
    {
      name: 'Invalid',
      value: 'invalid',
    },
    {
      name: 'Deferred',
      value: 'deferred',
    },
    {
      name: 'Blocked',
      value: 'blocked',
    },
    {
      name: 'Unsubscribed',
      value: 'unsubscribed',
    },
  ],
  default: '',
  description: 'Filter events by type',
},
{
  displayName: 'Sender',
  name: 'sender',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['sMS'], operation: ['sendTransactionalSMS'] } },
  default: '',
  description: 'Name of the sender. Only alphanumeric characters.',
},
{
  displayName: 'Recipient',
  name: 'recipient',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['sMS'], operation: ['sendTransactionalSMS'] } },
  default: '',
  description: 'Mobile number to send SMS with the country code',
},
{
  displayName: 'Content',
  name: 'content',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['sMS'], operation: ['sendTransactionalSMS'] } },
  default: '',
  description: 'Content of the SMS',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: { show: { resource: