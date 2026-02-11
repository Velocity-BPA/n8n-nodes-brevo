# n8n-nodes-brevo

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Brevo (formerly Sendinblue), the all-in-one digital marketing platform. With 1 utility resource, it enables seamless email marketing, transactional messaging, SMS campaigns, and CRM operations within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Brevo API](https://img.shields.io/badge/Brevo-API%20v3-orange)
![Email Marketing](https://img.shields.io/badge/Email-Marketing-green)
![SMS](https://img.shields.io/badge/SMS-Campaigns-purple)

## Features

- **Email Campaign Management** - Create, send, and track email marketing campaigns with advanced segmentation
- **Transactional Email Service** - Send automated transactional emails with real-time delivery tracking
- **Contact & List Management** - Organize contacts, manage subscription lists, and handle opt-ins/opt-outs
- **SMS Marketing** - Send SMS campaigns and transactional messages to mobile subscribers
- **Template Operations** - Create and manage reusable email and SMS templates
- **Analytics & Reporting** - Access detailed campaign statistics, delivery reports, and engagement metrics
- **CRM Integration** - Manage deals, companies, and sales pipeline data
- **Webhook Management** - Configure and manage webhooks for real-time event notifications

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
| API Key | Your Brevo API key from Account → SMTP & API → API Keys | ✓ |
| Environment | API environment (production/sandbox) | ✓ |
| Base URL | Brevo API base URL (default: https://api.brevo.com/v3) | ✗ |

## Resources & Operations

### 1. Utility

| Operation | Description |
|-----------|-------------|
| Send Email | Send transactional emails to individual or multiple recipients |
| Send SMS | Send SMS messages to individual or multiple phone numbers |
| Create Contact | Add new contacts to your Brevo account with custom attributes |
| Update Contact | Modify existing contact information and attributes |
| Delete Contact | Remove contacts from your account and all associated lists |
| Get Contact | Retrieve detailed information about a specific contact |
| List Contacts | Fetch contacts with filtering, sorting, and pagination options |
| Create List | Create new contact lists for segmentation and targeting |
| Update List | Modify existing list properties and settings |
| Delete List | Remove contact lists from your account |
| Get List | Retrieve information about a specific contact list |
| List All Lists | Fetch all contact lists with optional filtering |
| Add Contact to List | Subscribe contacts to specific lists |
| Remove Contact from List | Unsubscribe contacts from lists |
| Create Campaign | Create new email marketing campaigns |
| Update Campaign | Modify existing campaign settings and content |
| Delete Campaign | Remove campaigns from your account |
| Send Campaign | Launch email campaigns to targeted audiences |
| Get Campaign | Retrieve detailed campaign information and statistics |
| List Campaigns | Fetch campaigns with filtering and pagination |
| Create Template | Create reusable email or SMS templates |
| Update Template | Modify existing template content and settings |
| Delete Template | Remove templates from your account |
| Get Template | Retrieve specific template information |
| List Templates | Fetch all templates with optional filtering |
| Get Account Info | Retrieve account information and plan details |
| Create Webhook | Set up webhooks for real-time event notifications |
| Update Webhook | Modify existing webhook configurations |
| Delete Webhook | Remove webhooks from your account |
| Get Webhook | Retrieve specific webhook information |
| List Webhooks | Fetch all configured webhooks |
| Get Statistics | Retrieve campaign and account statistics |
| Create Deal | Add new deals to your CRM pipeline |
| Update Deal | Modify existing deal information |
| Delete Deal | Remove deals from your CRM |
| Get Deal | Retrieve specific deal information |
| List Deals | Fetch deals with filtering and pagination |

## Usage Examples

```javascript
// Send a transactional email
{
  "to": [{"email": "customer@example.com", "name": "John Doe"}],
  "subject": "Welcome to Our Service",
  "htmlContent": "<h1>Welcome!</h1><p>Thank you for signing up.</p>",
  "sender": {"email": "noreply@yourcompany.com", "name": "Your Company"},
  "templateId": 1,
  "params": {
    "firstName": "John",
    "welcomeBonus": "$10"
  }
}
```

```javascript
// Create a new contact with attributes
{
  "email": "newuser@example.com",
  "attributes": {
    "FIRSTNAME": "Jane",
    "LASTNAME": "Smith",
    "SMS": "+1234567890",
    "COMPANY": "Acme Corp"
  },
  "listIds": [2, 5, 12],
  "updateEnabled": true
}
```

```javascript
// Send SMS campaign
{
  "recipient": "+1234567890",
  "content": "Hi {{firstName}}, your order #{{orderNumber}} has shipped!",
  "sender": "YourStore",
  "type": "transactional",
  "webUrl": "https://tracking.example.com/{{orderNumber}}"
}
```

```javascript
// Create email campaign
{
  "name": "Summer Sale 2024",
  "subject": "🌞 Summer Sale - Up to 50% Off!",
  "sender": {"email": "marketing@example.com", "name": "Marketing Team"},
  "type": "classic",
  "htmlContent": "<html><body>{{include:header}}Sale content here</body></html>",
  "recipients": {"listIds": [1, 3, 7]},
  "scheduledAt": "2024-06-15T10:00:00Z"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or missing API key | Verify API key in credentials configuration |
| 400 Bad Request | Invalid request parameters or missing required fields | Check request payload format and required parameters |
| 404 Not Found | Resource (contact, campaign, etc.) does not exist | Verify resource ID and ensure it exists in your account |
| 429 Too Many Requests | API rate limit exceeded | Implement delays between requests or reduce request frequency |
| 402 Payment Required | Account limits reached or feature not available in plan | Upgrade account plan or check usage limits |
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
- **Brevo API Documentation**: [https://developers.brevo.com](https://developers.brevo.com)
- **Brevo Support**: [https://help.brevo.com](https://help.brevo.com)