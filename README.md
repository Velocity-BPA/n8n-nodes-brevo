# n8n-nodes-brevo

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides utilities for working with Brevo (formerly Sendinblue) email marketing and transactional email services. With 1 resource implemented, it offers essential utility functions for managing your Brevo integrations, handling API responses, and streamlining email automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Brevo API](https://img.shields.io/badge/Brevo-API%20v3-orange)
![Email Marketing](https://img.shields.io/badge/Email-Marketing-green)
![Transactional](https://img.shields.io/badge/Transactional-Email-green)

## Features

- **API Response Validation** - Validate and parse Brevo API responses with comprehensive error checking
- **Data Transformation** - Convert between n8n data formats and Brevo-compatible structures  
- **Error Code Translation** - Transform Brevo error codes into human-readable messages
- **Batch Processing Support** - Handle multiple operations with proper rate limiting and retry logic
- **Template Helper Functions** - Utilities for working with Brevo email templates and dynamic content
- **Webhook Payload Parsing** - Parse and validate incoming Brevo webhook notifications
- **Contact Data Normalization** - Standardize contact information for consistent data handling
- **Campaign Analytics Formatting** - Format campaign statistics and metrics for downstream processing

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
| Environment | API environment (production/sandbox) | No |
| Timeout | Request timeout in milliseconds (default: 30000) | No |

## Resources & Operations

### 1. Utility

| Operation | Description |
|-----------|-------------|
| Validate Response | Validate and parse Brevo API responses with error checking |
| Transform Data | Convert data between n8n and Brevo formats |
| Parse Error | Convert Brevo error codes to readable messages |
| Format Contact | Normalize contact data for Brevo compatibility |
| Parse Webhook | Parse and validate Brevo webhook payloads |
| Format Template Data | Prepare dynamic content for email templates |
| Calculate Rate Limit | Determine optimal request timing based on API limits |
| Batch Process | Handle multiple operations with proper queuing |

## Usage Examples

```javascript
// Validate and parse a Brevo API response
{
  "operation": "validateResponse",
  "response": {
    "statusCode": 200,
    "body": {
      "id": 123,
      "email": "user@example.com",
      "attributes": {}
    }
  },
  "expectedFields": ["id", "email"]
}
```

```javascript
// Transform contact data for Brevo format
{
  "operation": "transformData",
  "inputData": {
    "firstName": "John",
    "lastName": "Doe", 
    "emailAddress": "john.doe@example.com",
    "company": "Acme Corp"
  },
  "targetFormat": "brevoContact"
}
```

```javascript
// Parse Brevo webhook payload
{
  "operation": "parseWebhook",
  "webhookData": {
    "event": "delivered",
    "email": "recipient@example.com",
    "id": 456,
    "date": "2024-01-15T10:30:00Z"
  },
  "validateSignature": true
}
```

```javascript
// Format template data with dynamic content
{
  "operation": "formatTemplateData",
  "templateId": 15,
  "dynamicData": {
    "FNAME": "John",
    "COMPANY": "Acme Corp",
    "PRODUCT": "Premium Plan"
  },
  "personalizations": {
    "subject": "Welcome {{FNAME}} to {{COMPANY}}"
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key in Brevo account settings |
| Rate Limit Exceeded | Too many requests sent to Brevo API | Implement exponential backoff or use batch processing |
| Invalid Email Format | Email address doesn't meet Brevo requirements | Validate email format before sending |
| Template Not Found | Referenced email template doesn't exist | Check template ID and ensure template is active |
| Webhook Signature Invalid | Webhook payload signature verification failed | Verify webhook secret and payload integrity |
| Data Format Error | Input data doesn't match expected Brevo format | Use transform data operation to normalize input |

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
- **Brevo API Documentation**: [https://developers.brevo.com/](https://developers.brevo.com/)
- **Brevo Community**: [https://community.brevo.com/](https://community.brevo.com/)