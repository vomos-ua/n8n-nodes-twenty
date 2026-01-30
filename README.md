<p align="center">
  <img src="https://twenty.com/images/core/logo.svg" alt="Twenty CRM" width="120" />
</p>

<h1 align="center">n8n-nodes-twenty</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@linkedpromo/n8n-nodes-twenty"><img src="https://badge.fury.io/js/%40linkedpromo%2Fn8n-nodes-twenty.svg" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://n8n.io"><img src="https://img.shields.io/badge/n8n-community%20node-ff6d5a" alt="n8n community node" /></a>
</p>

<p align="center">
  <strong>n8n community node for Twenty CRM</strong> — the Open Source CRM platform
</p>

---

## ✨ Features

| | Feature | Description |
|:---:|---------|-------------|
| 🔄 | **Full CRUD** | Create, Read, Update, Delete for all resources |
| ⚡ | **Auto Transform** | Handles Twenty's complex object formats automatically |
| 📦 | **Bulk Operations** | Process multiple records in a single request |
| 🔍 | **Upsert** | Create or update based on matching field |
| 🔔 | **Webhooks** | Real-time triggers for all CRM events |

---

## 📥 Installation

### Via n8n UI (Recommended)

1. Go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter: `@linkedpromo/n8n-nodes-twenty`
4. Click **Install**

### Via npm

```bash
npm install @linkedpromo/n8n-nodes-twenty
```

---

## 🔑 Configuration

### Step 1: Get Your API Key

1. Log into your Twenty CRM instance
2. Go to **Settings** → **Developers** → **API Keys**
3. Create a new API key or copy an existing one

### Step 2: Add Credentials in n8n

1. Go to **Credentials** → **Add Credential** → **Twenty CRM API**
2. Fill in the fields:

| Field | Value | Example |
|:------|:------|:--------|
| **API URL** | Your Twenty instance URL (without `/rest`) | `https://your-twenty.com` |
| **API Key** | JWT token from Twenty | `eyJhbGciOiJIUzI1NiIs...` |

> ⚠️ **Important**: URL must be WITHOUT trailing slash (`/`) and WITHOUT `/rest`

---

## 📋 Supported Operations

### TwentyCrm Node

| Category | Resource | Operations | Description |
|:--------:|:---------|:-----------|:------------|
| 🏢 | **Company** | Create, Get, Get Many, Update, Delete, Upsert | Manage organizations and businesses |
| 👤 | **Person** | Create, Get, Get Many, Update, Delete, Upsert | Manage contacts and individuals |
| 💰 | **Opportunity** | Create, Get, Get Many, Update, Delete, Upsert | Track deals and sales pipeline |
| 📝 | **Note** | Create, Get, Get Many, Update, Delete | Add notes to records |
| ✅ | **Task** | Create, Get, Get Many, Update, Delete | Manage tasks and to-dos |
| 📊 | **Activity** | Create, Get, Get Many, Update, Delete | Track activities and interactions |
| 📦 | **Bulk** | Bulk Create, Bulk Update, Bulk Delete | Mass operations on records |
| 🔍 | **Search** | Search | Find records across multiple types |

### TwentyCrmTrigger Node

| Category | Events | Description |
|:--------:|:-------|:------------|
| 🏢 | `company.created` `company.updated` `company.deleted` | Company changes |
| 👤 | `person.created` `person.updated` `person.deleted` | Person changes |
| 💰 | `opportunity.created` `opportunity.updated` `opportunity.deleted` | Deal changes |
| ✅ | `task.created` `task.updated` `task.deleted` | Task changes |
| 📝 | `note.created` `note.updated` `note.deleted` | Note changes |

---

## 🔄 Auto Field Transformation

The node automatically transforms simple values to Twenty's complex format:

<table>
<tr>
<td width="50%">

**🏢 Company — You provide:**
```json
{
  "name": "Acme Inc",
  "domainName": "acme.com"
}
```

</td>
<td width="50%">

**📤 Node sends to API:**
```json
{
  "name": "Acme Inc",
  "domainName": {
    "primaryLinkUrl": "https://acme.com",
    "primaryLinkLabel": "",
    "secondaryLinks": []
  }
}
```

</td>
</tr>
<tr>
<td>

**👤 Person — You provide:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

</td>
<td>

**📤 Node sends to API:**
```json
{
  "name": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "emails": {
    "primaryEmail": "john@example.com",
    "additionalEmails": []
  }
}
```

</td>
</tr>
</table>

> ⚠️ **Note**: Twenty CRM Notes API does **NOT** support a `body` field. Only `title` and `position` are available.

---

## 🔧 Troubleshooting

### 🐌 Node hangs / timeout

| | |
|:--|:--|
| **Symptom** | Node runs for a long time without returning results |
| **Cause** | Incorrect API URL in credentials |
| **Solution** | Check URL format (see below) |

```diff
+ ✅ Correct:   https://your-twenty-instance.com
- ❌ Wrong:     https://your-twenty-instance.com/
- ❌ Wrong:     https://your-twenty-instance.com/rest
```

### 🔄 Node still doesn't work after changing credentials

**Solution**: Delete the node completely and add a new one with correct credentials

### ❌ Common API Errors

| Code | Error | Cause | Solution |
|:----:|:------|:------|:---------|
| 401 | Unauthorized | Invalid API key | Check credentials |
| 404 | Not Found | Wrong endpoint | Verify API URL |
| 400 | Bad Request | Invalid data | Check field values |

---

## 📦 Compatibility

| Requirement | Version |
|:------------|:--------|
| n8n | 2.4.6+ |
| Node.js | 18.10+ |
| Twenty CRM | API v1 |

---

## 🔗 Links

| | |
|:--|:--|
| 📦 npm | [npmjs.com/package/@linkedpromo/n8n-nodes-twenty](https://www.npmjs.com/package/@linkedpromo/n8n-nodes-twenty) |
| 💻 GitHub | [github.com/vomos-ua/n8n-nodes-twenty](https://github.com/vomos-ua/n8n-nodes-twenty) |
| 🏠 Twenty CRM | [twenty.com](https://twenty.com) |
| 🐛 Issues | [Report a bug](https://github.com/vomos-ua/n8n-nodes-twenty/issues) |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="mailto:info@abm24.cloud"><strong>abm24</strong></a>
</p>
