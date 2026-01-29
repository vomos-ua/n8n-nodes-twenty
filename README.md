# n8n-nodes-twenty

This is an n8n community node for [Twenty CRM](https://twenty.com/) - the open-source CRM.

Twenty CRM is a modern, open-source alternative to Salesforce. This node allows you to automate your Twenty CRM workflows within n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install n8n-nodes-twenty
```

### n8n Community Nodes

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-twenty`
4. Click **Install**

## Operations

This node supports the following resources and operations:

### Company

| Operation | Description |
|-----------|-------------|
| Create | Create a new company |
| Delete | Delete a company |
| Get | Get a company by ID |
| Get Many | Get many companies |
| Update | Update a company |

### Person

| Operation | Description |
|-----------|-------------|
| Create | Create a new person/contact |
| Delete | Delete a person |
| Get | Get a person by ID |
| Get Many | Get many people |
| Update | Update a person |

### Opportunity

| Operation | Description |
|-----------|-------------|
| Create | Create a new opportunity/deal |
| Delete | Delete an opportunity |
| Get | Get an opportunity by ID |
| Get Many | Get many opportunities |
| Update | Update an opportunity |

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

### Create a Company

```json
{
  "resource": "company",
  "operation": "create",
  "name": "Acme Inc",
  "additionalFields": {
    "domainName": "acme.com",
    "employees": 100,
    "linkedinUrl": "https://linkedin.com/company/acme"
  }
}
```

### Create a Person linked to Company

```json
{
  "resource": "person",
  "operation": "create",
  "firstName": "John",
  "lastName": "Doe",
  "additionalFields": {
    "email": "john@acme.com",
    "jobTitle": "CEO",
    "companyId": "{{$node.CreateCompany.json.id}}"
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

- **n8n version**: 1.0.0+
- **Node.js version**: 18.10+
- **Twenty CRM**: Cloud and self-hosted instances

## Resources

- [Twenty CRM Documentation](https://docs.twenty.com/)
- [Twenty CRM API Documentation](https://docs.twenty.com/developers/extend/capabilities/apis)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- For bugs and feature requests, please [open an issue](https://github.com/abm24/n8n-nodes-twenty/issues)
- For Twenty CRM questions, visit the [Twenty Community](https://twenty.com/community)
