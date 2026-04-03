# n8n-nodes-brevo

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Brevo (formerly Sendinblue), providing access to 6 essential resources for email marketing automation, transactional messaging, and contact management. Features complete CRUD operations for contacts, campaign management, transactional email sending, SMS messaging, webhook handling, and sender management.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Email Marketing](https://img.shields.io/badge/Email%20Marketing-Automation-green)
![SMS](https://img.shields.io/badge/SMS-Messaging-orange)
![Transactional](https://img.shields.io/badge/Transactional-Emails-purple)

## Features

- **Contact Management** - Create, update, delete, and retrieve contacts with list management and attribute handling
- **Campaign Operations** - Create, send, schedule, and monitor email campaigns with detailed analytics
- **Transactional Email** - Send personalized transactional emails with templates, attachments, and tracking
- **SMS Messaging** - Send SMS messages with delivery tracking and campaign management
- **Webhook Management** - Create and manage webhooks for real-time event notifications
- **Sender Management** - Manage sender identities, domain authentication, and email reputation
- **Batch Operations** - Support for bulk contact imports and campaign operations
- **Template Support** - Work with email templates and dynamic content insertion

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
| API Key | Your Brevo API key from account settings | Yes |

## Resources & Operations

### 1. Contact

| Operation | Description |
|-----------|-------------|
| Create | Create a new contact with attributes and list assignments |
| Update | Update existing contact information and attributes |
| Get | Retrieve contact details by email or ID |
| Get All | List contacts with filtering and pagination |
| Delete | Remove a contact from your database |
| Add to List | Add contact to specific lists |
| Remove from List | Remove contact from lists |

### 2. Campaign

| Operation | Description |
|-----------|-------------|
| Create | Create a new email campaign with content and settings |
| Update | Update campaign details and content |
| Send | Send a campaign immediately or schedule for later |
| Get | Retrieve campaign details and statistics |
| Get All | List all campaigns with filtering options |
| Delete | Delete a campaign |
| Get Statistics | Retrieve detailed campaign performance metrics |

### 3. TransactionalEmail

| Operation | Description |
|-----------|-------------|
| Send | Send transactional emails with templates or custom content |
| Get | Retrieve sent email details and delivery status |
| Get All | List transactional emails with filtering |
| Get Statistics | Retrieve transactional email analytics |

### 4. SMS

| Operation | Description |
|-----------|-------------|
| Send | Send SMS messages to individual or multiple recipients |
| Get | Retrieve SMS details and delivery status |
| Get All | List sent SMS messages |
| Get Statistics | Retrieve SMS campaign analytics |

### 5. Webhook

| Operation | Description |
|-----------|-------------|
| Create | Create webhook endpoints for event notifications |
| Update | Update webhook configuration and events |
| Get | Retrieve webhook details and status |
| Get All | List all configured webhooks |
| Delete | Remove webhook endpoints |

### 6. Sender

| Operation | Description |
|-----------|-------------|
| Create | Add new sender identity with domain verification |
| Update | Update sender details and configuration |
| Get | Retrieve sender information and verification status |
| Get All | List all sender identities |
| Delete | Remove sender identity |

## Usage Examples

```javascript
// Create a new contact with attributes
{
  "email": "john.doe@example.com",
  "attributes": {
    "FIRSTNAME": "John",
    "LASTNAME": "Doe",
    "COMPANY": "Acme Corp"
  },
  "listIds": [2, 7],
  "updateEnabled": true
}
```

```javascript
// Send a transactional email with template
{
  "templateId": 12,
  "to": [{"email": "customer@example.com", "name": "Customer Name"}],
  "params": {
    "orderNumber": "ORD-123456",
    "amount": "$99.99"
  },
  "tags": ["order-confirmation"]
}
```

```javascript
// Create and send an email campaign
{
  "name": "Monthly Newsletter",
  "subject": "Your Monthly Update",
  "sender": {"name": "Company Name", "email": "newsletter@company.com"},
  "htmlContent": "<h1>Newsletter Content</h1>",
  "recipients": {"listIds": [2, 5]},
  "scheduledAt": "2024-02-15T10:00:00Z"
}
```

```javascript
// Send SMS with delivery tracking
{
  "sender": "YourBrand",
  "recipient": "+1234567890",
  "content": "Your verification code is: 123456",
  "type": "transactional",
  "tag": "verification"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key in Brevo account settings |
| Rate Limit Exceeded | Too many requests sent in short time period | Implement delays between requests or use batch operations |
| Contact Already Exists | Attempting to create contact with existing email | Use update operation or enable updateEnabled flag |
| Template Not Found | Referenced email template doesn't exist | Verify template ID in Brevo dashboard |
| Invalid Email Format | Email address format validation failed | Ensure email addresses follow RFC standards |
| Insufficient Credits | Account has insufficient email/SMS credits | Add credits to your Brevo account or upgrade plan |

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
- **Brevo Community**: [community.brevo.com](https://community.brevo.com)