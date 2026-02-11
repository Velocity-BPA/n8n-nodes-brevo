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
            name: 'Contacts',
            value: 'contacts',
          },
          {
            name: 'ContactLists',
            value: 'contactLists',
          },
          {
            name: 'EmailCampaigns',
            value: 'emailCampaigns',
          },
          {
            name: 'TransactionalEmails',
            value: 'transactionalEmails',
          },
          {
            name: 'SMS',
            value: 'sMS',
          }
        ],
        default: 'contacts',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
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
  displayOptions: {
    show: {
      resource: ['sMS'],
    },
  },
  options: [
    {
      name: 'Send Transactional SMS',
      value: 'sendTransactionalSMS',
      description: 'Send a transactional SMS message',
      action: 'Send transactional SMS',
    },
    {
      name: 'Get SMS Events',
      value: 'getSMSEvents',
      description: 'Get SMS events and statistics',
      action: 'Get SMS events',
    },
    {
      name: 'Create SMS Campaign',
      value: 'createSMSCampaign',
      description: 'Create a new SMS campaign',
      action: 'Create SMS campaign',
    },
    {
      name: 'Get All SMS Campaigns',
      value: 'getAllSMSCampaigns',
      description: 'Get all SMS campaigns',
      action: 'Get all SMS campaigns',
    },
    {
      name: 'Get SMS Campaign',
      value: 'getSMSCampaign',
      description: 'Get details of a specific SMS campaign',
      action: 'Get SMS campaign',
    },
    {
      name: 'Update SMS Campaign',
      value: 'updateSMSCampaign',
      description: 'Update an SMS campaign',
      action: 'Update SMS campaign',
    },
    {
      name: 'Delete SMS Campaign',
      value: 'deleteSMSCampaign',
      description: 'Delete an SMS campaign',
      action: 'Delete SMS campaign',
    },
    {
      name: 'Send SMS Campaign Now',
      value: 'sendSMSCampaignNow',
      description: 'Send SMS campaign immediately',
      action: 'Send SMS campaign now',
    },
  ],
  default: 'sendTransactionalSMS',
},
      // Parameter definitions
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
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
      resource: ['contacts'],
      operation: ['createContact', 'updateContact'],
    },
  },
  default: {},
  description: 'Contact attributes',
  options: [
    {
      name: 'attribute',
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
      resource: ['contacts'],
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
      resource: ['contacts'],
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
      resource: ['contacts'],
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
      resource: ['contacts'],
      operation: ['getAllContacts'],
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
      resource: ['contacts'],
      operation: ['getAllContacts'],
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
      resource: ['contacts'],
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
      resource: ['contacts'],
      operation: ['getAllContacts'],
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
  displayName: 'File URL',
  name: 'fileUrl',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
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
      resource: ['contacts'],
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
      resource: ['contacts'],
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
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['sendTransactionalSMS'],
    },
  },
  default: '',
  description: 'Name of the sender (max 11 characters)',
},
{
  displayName: 'Recipient',
  name: 'recipient',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['sendTransactionalSMS'],
    },
  },
  default: '',
  description: 'Mobile number to send the SMS (with country code)',
},
{
  displayName: 'Content',
  name: 'content',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['sendTransactionalSMS', 'createSMSCampaign', 'updateSMSCampaign'],
    },
  },
  default: '',
  description: 'Text content of the SMS',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['sendTransactionalSMS'],
    },
  },
  options: [
    {
      name: 'Transactional',
      value: 'transactional',
    },
    {
      name: 'Marketing',
      value: 'marketing',
    },
  ],
  default: 'transactional',
  description: 'Type of SMS',
},
{
  displayName: 'Tag',
  name: 'tag',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['sendTransactionalSMS'],
    },
  },
  default: '',
  description: 'Tag to identify the SMS',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getSMSEvents', 'getAllSMSCampaigns'],
    },
  },
  default: 50,
  description: 'Number of items to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getSMSEvents', 'getAllSMSCampaigns'],
    },
  },
  default: 0,
  description: 'Index to start from',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getSMSEvents'],
    },
  },
  default: '',
  description: 'Start date for filtering events',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getSMSEvents'],
    },
  },
  default: '',
  description: 'End date for filtering events',
},
{
  displayName: 'Phone Number',
  name: 'phoneNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getSMSEvents'],
    },
  },
  default: '',
  description: 'Filter events by phone number',
},
{
  displayName: 'Event',
  name: 'event',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getSMSEvents'],
    },
  },
  options: [
    {
      name: 'Sent',
      value: 'sent',
    },
    {
      name: 'Delivered',
      value: 'delivered',
    },
    {
      name: 'Bounce',
      value: 'bounce',
    },
    {
      name: 'Blocked',
      value: 'blocked',
    },
  ],
  default: 'sent',
  description: 'Type of event to filter',
},
{
  displayName: 'Campaign Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['createSMSCampaign'],
    },
  },
  default: '',
  description: 'Name of the SMS campaign',
},
{
  displayName: 'Campaign Name',
  name: 'name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['updateSMSCampaign'],
    },
  },
  default: '',
  description: 'Updated name of the SMS campaign',
},
{
  displayName: 'Campaign Sender',
  name: 'sender',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['createSMSCampaign'],
    },
  },
  default: '',
  description: 'Name of the sender for the campaign',
},
{
  displayName: 'Recipients',
  name: 'recipients',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['createSMSCampaign'],
    },
  },
  default: '',
  description: 'Recipients for the campaign (JSON format)',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getAllSMSCampaigns'],
    },
  },
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
  ],
  default: 'draft',
  description: 'Filter campaigns by status',
},
{
  displayName: 'Campaign ID',
  name: 'campaignId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['sMS'],
      operation: ['getSMSCampaign', 'updateSMSCampaign', 'deleteSMSCampaign', 'sendSMSCampaignNow'],
    },
  },
  default: 0,
  description: 'ID of the SMS campaign',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'contacts':
        return [await executeContactsOperations.call(this, items)];
      case 'contactLists':
        return [await executeContactListsOperations.call(this, items)];
      case 'emailCampaigns':
        return [await executeEmailCampaignsOperations.call(this, items)];
      case 'transactionalEmails':
        return [await executeTransactionalEmailsOperations.call(this, items)];
      case 'sMS':
        return [await executeSMSOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeContactsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  const credentials = await this.getCredentials('brevoApi');
  const baseUrl = 'https://api.brevo.com/v3';
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createContact':
          const email = this.getNodeParameter('email', i) as string;
          const attributes = this.getNodeParameter('attributes', i) as any;
          const listIds = this.getNodeParameter('listIds', i) as string;
          const updateEnabled = this.getNodeParameter('updateEnabled', i) as boolean;
          
          const createBody: any = { email };
          
          if (attributes.attribute?.length) {
            createBody.attributes = {};
            attributes.attribute.forEach((attr: any) => {
              createBody.attributes[attr.name] = attr.value;
            });
          }
          
          if (listIds) {
            createBody.listIds = listIds.split(',').map((id: string) => parseInt(id.trim()));
          }
          
          if (updateEnabled) {
            createBody.updateEnabled = updateEnabled;
          }
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/contacts`,
            body: createBody,
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'getContact':
          const identifier = this.getNodeParameter('identifier', i) as string;
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/contacts/${encodeURIComponent(identifier)}`,
            headers: {
              'accept': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'getAllContacts':
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const modifiedSince = this.getNodeParameter('modifiedSince', i) as string;
          const sort = this.getNodeParameter('sort', i) as string;
          
          const queryParams: any = { limit, offset };
          
          if (modifiedSince) {
            queryParams.modifiedSince = new Date(modifiedSince).toISOString();
          }
          
          if (sort) {
            queryParams.sort = sort;
          }
          
          const queryString = new URLSearchParams(queryParams).toString();
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/contacts?${queryString}`,
            headers: {
              'accept': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'updateContact':
          const updateIdentifier = this.getNodeParameter('identifier', i) as string;
          const updateAttributes = this.getNodeParameter('attributes', i) as any;
          const updateListIds = this.getNodeParameter('listIds', i) as string;
          
          const updateBody: any = {};
          
          if (updateAttributes.attribute?.length) {
            updateBody.attributes = {};
            updateAttributes.attribute.forEach((attr: any) => {
              updateBody.attributes[attr.name] = attr.value;
            });
          }
          
          if (updateListIds) {
            updateBody.listIds = updateListIds.split(',').map((id: string) => parseInt(id.trim()));
          }
          
          result = await this.helpers.httpRequest({
            method: 'PUT',
            url: `${baseUrl}/contacts/${encodeURIComponent(updateIdentifier)}`,
            body: updateBody,
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'deleteContact':
          const deleteIdentifier = this.getNodeParameter('identifier', i) as string;
          
          result = await this.helpers.httpRequest({
            method: 'DELETE',
            url: `${baseUrl}/contacts/${encodeURIComponent(deleteIdentifier)}`,
            headers: {
              'accept': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'importContacts':
          const fileUrl = this.getNodeParameter('fileUrl', i) as string;
          const importListIds = this.getNodeParameter('listIds', i) as string;
          const notifyUrl = this.getNodeParameter('notifyUrl', i) as string;
          const newList = this.getNodeParameter('newList', i) as any;
          
          const importBody: any = { fileUrl };
          
          if (importListIds) {
            importBody.listIds = importListIds.split(',').map((id: string) => parseInt(id.trim()));
          }
          
          if (notifyUrl) {
            importBody.notifyUrl = notifyUrl;
          }
          
          if (newList.listData) {
            importBody.newList = {
              listName: newList.listData.listName,
              folderId: newList.listData.folderId,
            };
          }
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/contacts/import`,
            body: importBody,
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeContactListsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  const credentials = await this.getCredentials('brevoApi');
  const baseUrl = 'https://api.brevo.com/v3';
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createList':
          const createName = this.getNodeParameter('name', i) as string;
          const createFolderId = this.getNodeParameter('folderId', i) as number;
          
          const createBody: any = { name: createName };
          if (createFolderId) {
            createBody.folderId = createFolderId;
          }
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/contacts/lists`,
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': credentials.apiKey,
            },
            body: createBody,
            json: true,
          });
          break;
          
        case 'getAllLists':
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          
          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());
          if (sort) queryParams.append('sort', sort);
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/contacts/lists?${queryParams.toString()}`,
            headers: {
              'accept': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'getList':
          const getListId = this.getNodeParameter('listId', i) as string;
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/contacts/lists/${getListId}`,
            headers: {
              'accept': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'updateList':
          const updateListId = this.getNodeParameter('listId', i) as string;
          const updateName = this.getNodeParameter('name', i) as string;
          const updateFolderId = this.getNodeParameter('folderId', i) as number;
          
          const updateBody: any = {};
          if (updateName) updateBody.name = updateName;
          if (updateFolderId) updateBody.folderId = updateFolderId;
          
          result = await this.helpers.httpRequest({
            method: 'PUT',
            url: `${baseUrl}/contacts/lists/${updateListId}`,
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': credentials.apiKey,
            },
            body: updateBody,
            json: true,
          });
          break;
          
        case 'deleteList':
          const deleteListId = this.getNodeParameter('listId', i) as string;
          
          result = await this.helpers.httpRequest({
            method: 'DELETE',
            url: `${baseUrl}/contacts/lists/${deleteListId}`,
            headers: {
              'accept': 'application/json',
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;
          
        case 'addContactsToList':
          const addListId = this.getNodeParameter('listId', i) as string;
          const addEmails = this.getNodeParameter('emails', i) as string;
          
          const addEmailsArray = addEmails.split(',').map(email => email.trim());
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/contacts/lists/${addListId}/contacts/add`,
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': credentials.apiKey,
            },
            body: {
              emails: addEmailsArray,
            },
            json: true,
          });
          break;
          
        case 'removeContactsFromList':
          const removeListId = this.getNodeParameter('listId', i) as string;
          const removeEmails = this.getNodeParameter('emails', i) as string;
          
          const removeEmailsArray = removeEmails.split(',').map(email => email.trim());
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/contacts/lists/${removeListId}/contacts/remove`,
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': credentials.apiKey,
            },
            body: {
              emails: removeEmailsArray,
            },
            json: true,
          });
          break;
          
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeEmailCampaignsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  const credentials = await this.getCredentials('brevoApi');
  const baseUrl = 'https://api.brevo.com/v3';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createCampaign':
          const name = this.getNodeParameter('name', i) as string;
          const subject = this.getNodeParameter('subject', i) as string;
          const senderName = this.getNodeParameter('senderName', i) as string;
          const senderEmail = this.getNodeParameter('senderEmail', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const htmlContent = this.getNodeParameter('htmlContent', i) as string;
          const recipients = this.getNodeParameter('recipients', i) as string;

          const recipientLists = recipients.split(',').map(id => parseInt(id.trim()));

          const createBody = {
            name,
            subject,
            sender: {
              name: senderName,
              email: senderEmail,
            },
            type,
            htmlContent,
            recipients: {
              listIds: recipientLists,
            },
          };

          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/emailCampaigns`,
            headers: {
              'api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: createBody,
            json: true,
          });
          break;

        case 'getAllCampaigns':
          const typeFilter = this.getNodeParameter('typeFilter', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (typeFilter) queryParams.append('type', typeFilter);
          if (status) queryParams.append('status', status);
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/emailCampaigns?${queryParams.toString()}`,
            headers: {
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;

        case 'getCampaign':
          const campaignId = this.getNodeParameter('campaignId', i) as string;

          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/emailCampaigns/${campaignId}`,
            headers: {
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;

        case 'updateCampaign':
          const updateCampaignId = this.getNodeParameter('campaignId', i) as string;
          const updateName = this.getNodeParameter('name', i) as string;
          const updateSubject = this.getNodeParameter('subject', i) as string;
          const updateSenderName = this.getNodeParameter('senderName', i) as string;
          const updateSenderEmail = this.getNodeParameter('senderEmail', i) as string;
          const updateHtmlContent = this.getNodeParameter('htmlContent', i) as string;

          const updateBody: any = {};
          if (updateName) updateBody.name = updateName;
          if (updateSubject) updateBody.subject = updateSubject;
          if (updateSenderName || updateSenderEmail) {
            updateBody.sender = {};
            if (updateSenderName) updateBody.sender.name = updateSenderName;
            if (updateSenderEmail) updateBody.sender.email = updateSenderEmail;
          }
          if (updateHtmlContent) updateBody.htmlContent = updateHtmlContent;

          result = await this.helpers.httpRequest({
            method: 'PUT',
            url: `${baseUrl}/emailCampaigns/${updateCampaignId}`,
            headers: {
              'api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: updateBody,
            json: true,
          });
          break;

        case 'deleteCampaign':
          const deleteCampaignId = this.getNodeParameter('campaignId', i) as string;

          result = await this.helpers.httpRequest({
            method: 'DELETE',
            url: `${baseUrl}/emailCampaigns/${deleteCampaignId}`,
            headers: {
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;

        case 'sendCampaignNow':
          const sendCampaignId = this.getNodeParameter('campaignId', i) as string;

          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/emailCampaigns/${sendCampaignId}/sendNow`,
            headers: {
              'api-key': credentials.apiKey,
            },
            json: true,
          });
          break;

        case 'sendTestEmail':
          const testCampaignId = this.getNodeParameter('campaignId', i) as string;
          const emailTo = this.getNodeParameter('emailTo', i) as string;

          const testBody = {
            emailTo: [emailTo],
          };

          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/emailCampaigns/${testCampaignId}/sendTest`,
            headers: {
              'api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: testBody,
            json: true,
          });
          break;

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionalEmailsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  const credentials = await this.getCredentials('brevoApi');
  const baseUrl = credentials.baseUrl as string;
  const apiKey = credentials.apiKey as string;
  
  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
  };

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'sendTransactionalEmail':
          const sender = JSON.parse(this.getNodeParameter('sender', i) as string);
          const to = JSON.parse(this.getNodeParameter('to', i) as string);
          const subject = this.getNodeParameter('subject', i) as string;
          const htmlContent = this.getNodeParameter('htmlContent', i) as string;
          const textContent = this.getNodeParameter('textContent', i) as string;
          const templateId = this.getNodeParameter('templateId', i) as number;
          const params = JSON.parse(this.getNodeParameter('params', i) as string);

          const emailData: any = {
            sender,
            to,
          };

          if (templateId) {
            emailData.templateId = templateId;
            if (Object.keys(params).length > 0) {
              emailData.params = params;
            }
          } else {
            emailData.subject = subject;
            if (htmlContent) emailData.htmlContent = htmlContent;
            if (textContent) emailData.textContent = textContent;
          }

          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/smtp/email`,
            headers,
            json: emailData,
          });
          break;

        case 'getAllTemplates':
          const templateStatus = this.getNodeParameter('templateStatus', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const templateParams: any = {};
          if (templateStatus) templateParams.templateStatus = templateStatus;
          if (limit) templateParams.limit = limit.toString();
          if (offset) templateParams.offset = offset.toString();

          const templateQuery = new URLSearchParams(templateParams).toString();
          const templateUrl = `${baseUrl}/smtp/templates${templateQuery ? '?' + templateQuery : ''}`;

          result = await this.helpers.httpRequest({
            method: 'GET',
            url: templateUrl,
            headers,
          });
          break;

        case 'getTemplate':
          const getTemplateId = this.getNodeParameter('templateId', i) as number;
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/smtp/templates/${getTemplateId}`,
            headers,
          });
          break;

        case 'createTemplate':
          const createTemplateName = this.getNodeParameter('templateName', i) as string;
          const createSubject = this.getNodeParameter('subject', i) as string;
          const createSender = JSON.parse(this.getNodeParameter('sender', i) as string);
          const createHtmlContent = this.getNodeParameter('htmlContent', i) as string;

          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/smtp/templates`,
            headers,
            json: {
              templateName: createTemplateName,
              subject: createSubject,
              sender: createSender,
              htmlContent: createHtmlContent,
            },
          });
          break;

        case 'updateTemplate':
          const updateTemplateId = this.getNodeParameter('templateId', i) as number;
          const updateTemplateName = this.getNodeParameter('templateName', i) as string;
          const updateSubject = this.getNodeParameter('subject', i) as string;
          const updateHtmlContent = this.getNodeParameter('htmlContent', i) as string;

          result = await this.helpers.httpRequest({
            method: 'PUT',
            url: `${baseUrl}/smtp/templates/${updateTemplateId}`,
            headers,
            json: {
              templateName: updateTemplateName,
              subject: updateSubject,
              htmlContent: updateHtmlContent,
            },
          });
          break;

        case 'deleteTemplate':
          const deleteTemplateId = this.getNodeParameter('templateId', i) as number;

          result = await this.helpers.httpRequest({
            method: 'DELETE',
            url: `${baseUrl}/smtp/templates/${deleteTemplateId}`,
            headers,
          });
          break;

        case 'getEmailEvents':
          const eventsLimit = this.getNodeParameter('limit', i) as number;
          const eventsOffset = this.getNodeParameter('offset', i) as number;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const event = this.getNodeParameter('event', i) as string;

          const eventsParams: any = {};
          if (eventsLimit) eventsParams.limit = eventsLimit.toString();
          if (eventsOffset) eventsParams.offset = eventsOffset.toString();
          if (startDate) eventsParams.startDate = startDate;
          if (endDate) eventsParams.endDate = endDate;
          if (email) eventsParams.email = email;
          if (event) eventsParams.event = event;

          const eventsQuery = new URLSearchParams(eventsParams).toString();
          const eventsUrl = `${baseUrl}/smtp/statistics/events${eventsQuery ? '?' + eventsQuery : ''}`;

          result = await this.helpers.httpRequest({
            method: 'GET',
            url: eventsUrl,
            headers,
          });
          break;

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
            itemIndex: i,
          });
      }

      returnData.push({ 
        json: result || {}, 
        pairedItem: { item: i } 
      });

    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeSMSOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  const credentials = await this.getCredentials('brevoApi');
  const baseUrl = 'https://api.brevo.com/v3';
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'sendTransactionalSMS':
          const sender = this.getNodeParameter('sender', i) as string;
          const recipient = this.getNodeParameter('recipient', i) as string;
          const content = this.getNodeParameter('content', i) as string;
          const type = this.getNodeParameter('type', i, 'transactional') as string;
          const tag = this.getNodeParameter('tag', i, '') as string;
          
          const smsData: any = {
            sender,
            recipient,
            content,
            type,
          };
          
          if (tag) {
            smsData.tag = tag;
          }
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/transactionalSMS/sms`,
            headers: {
              'api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: smsData,
          });
          break;
          
        case 'getSMSEvents':
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const startDate = this.getNodeParameter('startDate', i, '') as string;
          const endDate = this.getNodeParameter('endDate', i, '') as string;
          const phoneNumber = this.getNodeParameter('phoneNumber', i, '') as string;
          const event = this.getNodeParameter('event', i, '') as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          
          if (startDate) queryParams.append('startDate', startDate);
          if (endDate) queryParams.append('endDate', endDate);
          if (phoneNumber) queryParams.append('phoneNumber', phoneNumber);
          if (event) queryParams.append('event', event);
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/transactionalSMS/statistics/events?${queryParams.toString()}`,
            headers: {
              'api-key': credentials.apiKey,
            },
          });
          break;
          
        case 'createSMSCampaign':
          const campaignName = this.getNodeParameter('name', i) as string;
          const campaignSender = this.getNodeParameter('sender', i) as string;
          const campaignContent = this.getNodeParameter('content', i) as string;
          const recipients = this.getNodeParameter('recipients', i) as string;
          
          let parsedRecipients;
          try {
            parsedRecipients = JSON.parse(recipients);
          } catch (error) {
            throw new NodeOperationError(this.getNode(), 'Recipients must be valid JSON');
          }
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/smsCampaigns`,
            headers: {
              'api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              name: campaignName,
              sender: campaignSender,
              content: campaignContent,
              recipients: parsedRecipients,
            },
          });
          break;
          
        case 'getAllSMSCampaigns':
          const campaignStatus = this.getNodeParameter('status', i, '') as string;
          const campaignLimit = this.getNodeParameter('limit', i, 50) as number;
          const campaignOffset = this.getNodeParameter('offset', i, 0) as number;
          
          const campaignParams = new URLSearchParams();
          campaignParams.append('limit', campaignLimit.toString());
          campaignParams.append('offset', campaignOffset.toString());
          
          if (campaignStatus) campaignParams.append('status', campaignStatus);
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/smsCampaigns?${campaignParams.toString()}`,
            headers: {
              'api-key': credentials.apiKey,
            },
          });
          break;
          
        case 'getSMSCampaign':
          const getCampaignId = this.getNodeParameter('campaignId', i) as number;
          
          result = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/smsCampaigns/${getCampaignId}`,
            headers: {
              'api-key': credentials.apiKey,
            },
          });
          break;
          
        case 'updateSMSCampaign':
          const updateCampaignId = this.getNodeParameter('campaignId', i) as number;
          const updateName = this.getNodeParameter('name', i, '') as string;
          const updateContent = this.getNodeParameter('content', i, '') as string;
          
          const updateData: any = {};
          if (updateName) updateData.name = updateName;
          if (updateContent) updateData.content = updateContent;
          
          result = await this.helpers.httpRequest({
            method: 'PUT',
            url: `${baseUrl}/smsCampaigns/${updateCampaignId}`,
            headers: {
              'api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: updateData,
          });
          break;
          
        case 'deleteSMSCampaign':
          const deleteCampaignId = this.getNodeParameter('campaignId', i) as number;
          
          result = await this.helpers.httpRequest({
            method: 'DELETE',
            url: `${baseUrl}/smsCampaigns/${deleteCampaignId}`,
            headers: {
              'api-key': credentials.apiKey,
            },
          });
          break;
          
        case 'sendSMSCampaignNow':
          const sendCampaignId = this.getNodeParameter('campaignId', i) as number;
          
          result = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/smsCampaigns/${sendCampaignId}/sendNow`,
            headers: {
              'api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
          });
          break;
          
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}
