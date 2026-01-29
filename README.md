# n8n-nodes-twenty

This is an n8n community node for [Twenty CRM](https://twenty.com/) - the open-source CRM.

Twenty CRM is a modern, open-source alternative to Salesforce. This node allows you to automate your Twenty CRM workflows within n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install @linkedpromo/n8n-nodes-twenty
```

### n8n Community Nodes

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `@linkedpromo/n8n-nodes-twenty`
4. Click **Install**

## Nodes

This package includes two nodes:

### Twenty CRM (Regular Node)

For standard CRUD operations and data management.

### Twenty CRM Trigger

Webhook-based trigger for real-time event handling.

## Resources & Operations

### Activity

| Operation | Description |
|-----------|-------------|
| Create | Create a new activity (call, email, meeting, etc.) |
| Delete | Delete an activity |
| Get | Get an activity by ID |
| Get Many | Get many activities |
| Update | Update an activity |

### Bulk Operations

| Operation | Description |
|-----------|-------------|
| Create Many | Create multiple records at once |
| Update Many | Update multiple records at once |
| Delete Many | Delete multiple records by IDs |

### Company

| Operation | Description |
|-----------|-------------|
| Create | Create a new company |
| Delete | Delete a company |
| Get | Get a company by ID |
| Get Many | Get many companies |
| Update | Update a company |
| **Upsert** | Create or update by domain name |

### Person

| Operation | Description |
|-----------|-------------|
| Create | Create a new person/contact |
| Delete | Delete a person |
| Get | Get a person by ID |
| Get Many | Get many people |
| Update | Update a person |
| **Upsert** | Create or update by email/LinkedIn |

### Opportunity

| Operation | Description |
|-----------|-------------|
| Create | Create a new opportunity/deal |
| Delete | Delete an opportunity |
| Get | Get an opportunity by ID |
| Get Many | Get many opportunities |
| Update | Update an opportunity |
| **Upsert** | Create or update by name |

### Note

| Operation | Description |
|-----------|-------------|
| Create | Create a new note |
| Delete | Delete a note |
| Get | Get a note by ID |
| Get Many | Get many notes |
| Update | Update a note |

### Task

| Operation | Description |
|-----------|-------------|
| Create | Create a new task |
| Delete | Delete a task |
| Get | Get a task by ID |
| Get Many | Get many tasks |
| Update | Update a task |

### Search

| Operation | Description |
|-----------|-------------|
| Search All | Search across multiple object types |

## Trigger Events

The Twenty CRM Trigger supports the following events:

| Event | Description |
|-------|-------------|
| company.created | When a new company is created |
| company.updated | When a company is updated |
| company.deleted | When a company is deleted |
| person.created | When a new person is created |
| person.updated | When a person is updated |
| person.deleted | When a person is deleted |
| opportunity.created | When a new opportunity is created |
| opportunity.updated | When an opportunity is updated |
| opportunity.deleted | When an opportunity is deleted |
| task.created | When a new task is created |
| task.updated | When a task is updated |
| task.deleted | When a task is deleted |
| note.created | When a new note is created |
| note.updated | When a note is updated |
| note.deleted | When a note is deleted |
| activity.created | When a new activity is created |
| activity.updated | When an activity is updated |
| activity.deleted | When an activity is deleted |

## Credentials

To use this node, you need to configure Twenty CRM API credentials:

1. Log into your Twenty CRM instance
2. Go to **Settings > APIs & Webhooks**
3. Click **+ Create key**
4. Set a name and expiration date
5. Copy the API key (shown only once)

In n8n, create new credentials:

- **API URL**: Your Twenty CRM instance URL (e.g., `https://api.twenty.com` for cloud or `https://your-instance.com` for self-hosted)
- **API Key**: The API key you created

## Example Usage

### Upsert a Company (Create or Update)

```json
{
  "resource": "company",
  "operation": "upsert",
  "matchField": "domainName",
  "matchValue": "acme.com",
  "name": "Acme Inc",
  "additionalFields": {
    "employees": 150,
    "linkedinUrl": "https://linkedin.com/company/acme"
  }
}
```

### Bulk Create Companies

```json
{
  "resource": "bulk",
  "operation": "bulkCreate",
  "bulkResourceType": "company",
  "bulkItems": "[{\"name\":\"Company A\"},{\"name\":\"Company B\"}]"
}
```

### Create an Activity

```json
{
  "resource": "activity",
  "operation": "create",
  "title": "Sales Call",
  "type": "Call",
  "additionalFields": {
    "body": "Discussed pricing options",
    "companyId": "{{$json.id}}"
  }
}
```

### Search across all records

```json
{
  "resource": "search",
  "operation": "searchAll",
  "query": "John",
  "objectTypes": ["people", "companies"],
  "limit": 20
}
```

## Compatibility

- **n8n version**: 2.4.6+
- **Node.js version**: 18.10+
- **Twenty CRM**: Cloud and self-hosted instances

## Changelog

### v0.3.0
- Added **Activity** resource with full CRUD
- Added **Bulk Operations** (Create Many, Update Many, Delete Many)
- Added **Upsert** operation for Company, Person, Opportunity
- Added **Twenty CRM Trigger** for webhook-based automation
- Improved API error handling

### v0.2.2
- Updated n8n compatibility to 2.4.6+
- Migrated to public GitHub repository

### v0.2.1
- Changed Stage field from dropdown to flexible text input

### v0.2.0
- Initial public release

## Resources

- [Twenty CRM Documentation](https://docs.twenty.com/)
- [Twenty CRM API Documentation](https://docs.twenty.com/developers/extend/capabilities/apis)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- For bugs and feature requests, please [open an issue](https://github.com/vomos-ua/n8n-nodes-twenty/issues)
- For Twenty CRM questions, visit the [Twenty Community](https://twenty.com/community)
