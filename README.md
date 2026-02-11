# n8n-nodes-brevo

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Brevo (formerly Sendinblue), providing access to 5 core resources for email marketing automation, transactional messaging, and contact management. Manage contacts, lists, email campaigns, transactional emails, and SMS messaging directly from your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Brevo API](https://img.shields.io/badge/Brevo-API%20v3-orange)
![Email Marketing](https://img.shields.io/badge/Email-Marketing-green)
![SMS](https://img.shields.io/badge/SMS-Messaging-purple)

## Features

- **Contact Management** - Create, update, delete, and retrieve contacts with custom attributes and list assignments
- **List Operations** - Manage contact lists, add/remove subscribers, and organize your audience segments
- **Email Campaign Automation** - Create, schedule, and manage email marketing campaigns with templates and targeting
- **Transactional Email Delivery** - Send personalized transactional emails with templates, attachments, and tracking
- **SMS Messaging** - Send SMS messages to contacts with delivery tracking and campaign management
- **Real-time Webhooks** - Handle Brevo webhook events for bounces, opens, clicks, and unsubscribes
- **Batch Operations** - Efficiently process multiple contacts and operations in single requests
- **Advanced Filtering** - Query contacts and campaigns with sophisticated filtering and search capabilities

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-brevo`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-brevo
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-brevo.git
cd n8n-nodes-brevo
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-brevo
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Brevo API key (found in Account → SMTP & API → API Keys) | Yes |
| Environment | API environment (Production or Sandbox) | Yes |

## Resources & Operations

### 1. Contacts

| Operation | Description |
|-----------|-------------|
| Create | Create a new contact with email, attributes, and list assignments |
| Update | Update existing contact information and attributes |
| Get | Retrieve contact details by email or ID |
| Delete | Remove a contact from your account |
| Get All | List contacts with filtering, sorting, and pagination |
| Add to List | Add contact to specific contact lists |
| Remove from List | Remove contact from specific contact lists |

### 2. Contact Lists

| Operation | Description |
|-----------|-------------|
| Create | Create a new contact list with name and folder assignment |
| Update | Update list name, folder, or other properties |
| Get | Retrieve specific list details and statistics |
| Delete | Delete a contact list (contacts remain in account) |
| Get All | List all contact lists with folder organization |
| Get Contacts | Retrieve all contacts within a specific list |
| Add Contacts | Bulk add multiple contacts to a list |
| Remove Contacts | Bulk remove contacts from a list |

### 3. Email Campaigns

| Operation | Description |
|-----------|-------------|
| Create | Create new email campaign with content, recipients, and settings |
| Update | Update campaign content, subject, or targeting before sending |
| Get | Retrieve campaign details, statistics, and performance metrics |
| Delete | Delete a draft campaign (sent campaigns cannot be deleted) |
| Get All | List campaigns with status filtering and pagination |
| Send | Send or schedule a campaign for delivery |
| Send Test | Send test email to specified addresses |
| Get Statistics | Retrieve detailed campaign performance analytics |

### 4. Transactional Emails

| Operation | Description |
|-----------|-------------|
| Send | Send transactional email with template or custom content |
| Get | Retrieve sent email details and delivery status |
| Get All | List sent transactional emails with filtering |
| Get Templates | Retrieve available transactional email templates |
| Get Template | Get specific template content and configuration |
| Send Bulk | Send multiple transactional emails in batch |
| Get SMTP Templates | List SMTP email templates |
| Get Blocked Domains | Retrieve list of blocked email domains |

### 5. SMS

| Operation | Description |
|-----------|-------------|
| Send | Send SMS message to individual recipient or list |
| Get | Retrieve SMS message details and delivery status |
| Get All | List sent SMS messages with filtering and pagination |
| Create Campaign | Create SMS marketing campaign |
| Get Campaign | Retrieve SMS campaign details and statistics |
| Get All Campaigns | List SMS campaigns with status filtering |
| Send Test | Send test SMS to verify content and delivery |
| Get Statistics | Retrieve SMS delivery and engagement analytics |

## Usage Examples

```javascript
// Create a new contact with custom attributes
{
  "email": "john.doe@example.com",
  "attributes": {
    "FIRSTNAME": "John",
    "LASTNAME": "Doe",
    "COMPANY": "Acme Corp"
  },
  "listIds": [1, 3],
  "updateEnabled": true
}
```

```javascript
// Send transactional email with template
{
  "templateId": 1,
  "to": [
    {
      "email": "customer@example.com",
      "name": "Customer Name"
    }
  ],
  "params": {
    "ORDER_ID": "12345",
    "PRODUCT_NAME": "Premium Plan",
    "TOTAL": "$99.99"
  },
  "tags": ["order-confirmation"]
}
```

```javascript
// Create email marketing campaign
{
  "name": "Monthly Newsletter - March 2024",
  "subject": "Your March Updates Are Here!",
  "htmlContent": "<html><body>Newsletter content here...</body></html>",
  "recipients": {
    "listIds": [2, 4]
  },
  "scheduledAt": "2024-03-15T10:00:00Z"
}
```

```javascript
// Send SMS message
{
  "type": "transactional",
  "content": "Your order #12345 has been shipped and will arrive by March 15th.",
  "recipient": "+1234567890",
  "sender": "YourBrand",
  "tag": "shipping-notification"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or missing API key | Verify API key in credentials and check permissions |
| 404 Not Found | Contact, list, or campaign doesn't exist | Confirm resource ID exists and is accessible |
| 400 Bad Request | Invalid email format or missing required fields | Check email format and ensure all required fields are provided |
| 429 Too Many Requests | API rate limit exceeded | Implement delays between requests or reduce request frequency |
| 402 Payment Required | Account credit insufficient for SMS | Add credits to Brevo account or upgrade plan |
| 500 Internal Server Error | Brevo API temporary issue | Retry request after delay or check Brevo status page |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-brevo/issues)
- **Brevo API Documentation**: [developers.brevo.com](https://developers.brevo.com)
- **Brevo Help Center**: [help.brevo.com](https://help.brevo.com)