# CLAUDE.md - Instructions for n8n-nodes-twenty

## Project Overview

This is an n8n community node package for **Twenty CRM** - an Open Source CRM platform.

- **Package**: `@linkedpromo/n8n-nodes-twenty`
- **Version**: 0.3.4
- **npm**: https://www.npmjs.com/package/@linkedpromo/n8n-nodes-twenty
- **GitHub**: https://github.com/vomos-ua/n8n-nodes-twenty
- **Compatibility**: n8n 2.4.6+, Node.js 18.10+

## Project Structure

```
n8n-nodes-twenty/
├── nodes/
│   └── TwentyCrm/
│       ├── TwentyCrm.node.ts        # Main node (CRUD operations)
│       ├── TwentyCrmTrigger.node.ts # Trigger node (webhooks)
│       ├── GenericFunctions.ts      # API helpers
│       ├── types.ts                 # TypeScript interfaces
│       └── resources/
│           ├── company/             # Company resource
│           ├── person/              # Person/Contact resource
│           ├── opportunity/         # Opportunity/Deal resource
│           ├── note/                # Note resource
│           ├── task/                # Task resource
│           ├── activity/            # Activity resource
│           └── bulk/                # Bulk operations
├── credentials/
│   └── TwentyCrmApi.credentials.ts  # API credentials
├── package.json
└── tsconfig.json
```

## Available Resources & Operations

### TwentyCrm Node

| Resource | Operations |
|----------|------------|
| Company | Create, Get, Get Many, Update, Delete, Upsert |
| Person | Create, Get, Get Many, Update, Delete, Upsert |
| Opportunity | Create, Get, Get Many, Update, Delete, Upsert |
| Note | Create, Get, Get Many, Update, Delete |
| Task | Create, Get, Get Many, Update, Delete |
| Activity | Create, Get, Get Many, Update, Delete |
| Bulk | Bulk Create, Bulk Update, Bulk Delete |

### TwentyCrmTrigger Node

Webhook events for: Company, Person, Opportunity, Task, Note, Activity
- `.created` - when record is created
- `.updated` - when record is updated
- `.deleted` - when record is deleted

## Development Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode (development)
npm run dev

# Lint
npm run lint
npm run lintfix

# Format code
npm run format
```

## Publishing to npm

```bash
# 1. Update version in package.json
# 2. Build
npm run build

# 3. Publish (requires npm login)
npm publish
```

## Testing with n8n

### Local Testing
1. Build the project: `npm run build`
2. Link to n8n: `npm link` in project, then `npm link @linkedpromo/n8n-nodes-twenty` in n8n
3. Restart n8n

### Production Testing
- n8n instance: https://n8n.abm24.cloud
- Install from npm: Community Nodes → Install → `@linkedpromo/n8n-nodes-twenty`

## MCP Servers Available

The `.mcp.json` file contains MCP servers for testing and development:

| Server | Purpose | Use Case |
|--------|---------|----------|
| `mcp-twenty` | Twenty CRM API | Test CRUD operations directly |
| `mcp-twenty-lpcrm` | Twenty CRM (LP instance) | Alternative CRM instance |
| `mcp-abm24-n8n` | n8n automation | Execute n8n workflows |
| `mcp-supabase` | Supabase database | Backend testing |
| `mcp-qdrant` | Vector database | Search functionality |

## Credentials Configuration (ВАЖЛИВО!)

### Налаштування в n8n

1. Перейди в **Credentials** → **Add Credential** → **Twenty CRM API**
2. Заповни поля:

| Поле | Значення | Приклад |
|------|----------|---------|
| **API URL** | URL Twenty CRM інстансу (БЕЗ `/rest`) | `https://global.crm.linked.promo` |
| **API Key** | API ключ (JWT token) | `eyJhbGciOiJIUzI1NiIs...` |

### Відомі проблеми

#### Нода висить / timeout
**Симптом**: Нода довго виконується і не повертає результат

**Причина**: Неправильний API URL в credentials

**Рішення**:
1. Перевір що API URL вказує на правильний Twenty CRM інстанс
2. URL має бути БЕЗ trailing slash (`/`) в кінці
3. URL має бути БЕЗ `/rest` - нода додає це автоматично
4. Переконайся що Twenty CRM сервер доступний

**Приклад правильного URL**: `https://global.crm.linked.promo`
**Приклад неправильного URL**: `https://crm.abm24.cloud/` (trailing slash, неправильний домен)

#### Після зміни credentials нода все ще не працює
**Рішення**: Видали ноду і додай нову з правильними credentials

---

## Twenty CRM API Reference

- **Base URL**: `{instance}/rest/`
- **Auth**: Bearer token (API key)
- **Endpoints**:
  - `/rest/companies` - Companies
  - `/rest/people` - People/Contacts
  - `/rest/opportunities` - Opportunities/Deals
  - `/rest/notes` - Notes
  - `/rest/tasks` - Tasks
  - `/rest/activities` - Activities (може не існувати!)

### ВАЖЛИВО: Формат полів Twenty CRM API

Twenty CRM використовує **складні об'єкти** для багатьох полів. Нода автоматично трансформує прості значення:

#### Company Fields
```javascript
// Нода приймає:
{ domainName: "example.com" }

// API очікує:
{ domainName: { primaryLinkUrl: "https://example.com", primaryLinkLabel: "", secondaryLinks: [] } }

// Аналогічно для linkedinUrl → linkedinLink, xUrl → xLink
```

#### Person Fields
```javascript
// Нода приймає:
{ firstName: "John", lastName: "Doe", email: "john@example.com" }

// API очікує:
{
  name: { firstName: "John", lastName: "Doe" },
  emails: { primaryEmail: "john@example.com", additionalEmails: [] }
}
```

#### Note Fields
```javascript
// УВАГА: Twenty CRM Notes API НЕ має поля "body"!
// Підтримуються тільки: title, position
```

### Трансформації в коді

Файл `GenericFunctions.ts` містить функції трансформації:
- `transformCompanyFields()` - для Company
- `transformPersonFields()` - для Person
- `transformNoteFields()` - для Note
- `toLinkObject()` - конвертує URL в Links object

### Filter Syntax
```json
{
  "filter": {
    "fieldName": { "eq": "value" }
  }
}
```

### Pagination
- `limit`: Max 60 per page
- `offset`: Starting position

## Common Tasks

### Adding a New Resource

1. Create folder in `resources/` with:
   - `{resource}.operations.ts` - CRUD operations
   - `{resource}.fields.ts` - Form fields
   - `index.ts` - Exports

2. Import in `TwentyCrm.node.ts`:
   ```typescript
   import { resourceOperations, resourceFields } from './resources/resource';
   ```

3. Add to `properties` array and `execute()` switch

4. Update `types.ts` with new types

### Adding Upsert to a Resource

1. Add 'upsert' to operations in `{resource}.operations.ts`
2. Add matchField, matchValue, and additionalFields in `{resource}.fields.ts`
3. Handle in `execute()` using `findRecordByField()` helper

### Adding Trigger Events

1. Update `TwentyCrmTrigger.node.ts` events array
2. Webhook URL format: `{n8n_url}/webhook/{webhook_id}`

## Troubleshooting

### Build Errors
- Run `npm install` to ensure dependencies
- Check TypeScript version compatibility (~5.3.0)

### API Errors
- Verify API key has correct permissions
- Check endpoint URL (no trailing slash)
- Twenty CRM returns `{ data: [...] }` wrapper

### Webhook Issues
- Ensure n8n instance is publicly accessible
- Check Twenty CRM webhook configuration
- Verify event types match

---

## TESTING METHODOLOGY (ОБОВ'ЯЗКОВО ПІСЛЯ КОЖНОГО ОНОВЛЕННЯ)

### Test Environment

- **Test Workflow**: https://n8n.abm24.cloud/workflow/0Xb21aub9GZWBOLWG-eJ5
- **n8n Instance**: https://n8n.abm24.cloud
- **Twenty CRM**: https://global.crm.linked.promo (доступ через mcp-twenty)
- **Credentials Name**: "Twenty CRM Global LP"

### MCP Tools for Testing

| MCP Server | Для чого використовувати |
|------------|--------------------------|
| `mcp-abm24-n8n` | Запуск workflow, перевірка executions, отримання помилок |
| `mcp-twenty` | Перевірка даних в CRM, логи API, валідація записів |
| `mcp-vps-hostinger` | Логи сервера, docker logs, системні помилки |

### Testing Procedure (Процедура тестування)

#### КРОК 1: Перевірка Build
```bash
npm run build
```
- [ ] Build пройшов без помилок
- [ ] Всі файли згенеровані в `dist/`

#### КРОК 2: Отримати Test Workflow через n8n MCP
```
# Використовуй mcp-abm24-n8n для:
1. Отримати workflow по ID: 0Xb21aub9GZWBOLWG-eJ5
2. Перевірити, які ноди там є
3. Подивитися останні executions
```

#### КРОК 3: Запустити тестові ноди
Для кожного ресурсу (Company, Person, Opportunity, Note, Task, Activity):

**3.1 Create Operation**
- [ ] Створити тестовий запис
- [ ] Перевірити response (має бути ID)
- [ ] Перевірити в Twenty CRM, що запис з'явився

**3.2 Get Operation**
- [ ] Отримати запис по ID
- [ ] Перевірити, що всі поля повернулись

**3.3 Get Many Operation**
- [ ] Отримати список записів
- [ ] Перевірити pagination (limit/offset)
- [ ] Перевірити filters

**3.4 Update Operation**
- [ ] Оновити існуючий запис
- [ ] Перевірити, що зміни збереглись

**3.5 Delete Operation**
- [ ] Видалити тестовий запис
- [ ] Перевірити, що запис видалено в CRM

**3.6 Upsert Operation** (для Company, Person, Opportunity)
- [ ] Upsert нового запису (має створити)
- [ ] Upsert існуючого запису (має оновити)

#### КРОК 4: Тестування Bulk Operations
- [ ] Bulk Create - створити 3+ записи одним запитом
- [ ] Bulk Update - оновити 3+ записи
- [ ] Bulk Delete - видалити 3+ записи

#### КРОК 5: Тестування Trigger Node
- [ ] Webhook реєструється в Twenty CRM
- [ ] При створенні запису - trigger спрацьовує
- [ ] При оновленні - trigger спрацьовує
- [ ] При видаленні - trigger спрацьовує

### Debugging Errors (Діагностика помилок)

#### Якщо нода не працює:

1. **Перевір execution в n8n:**
   ```
   mcp-abm24-n8n: отримати останні executions workflow
   → Подивитись error message
   ```

2. **Перевір Twenty CRM API:**
   ```
   mcp-twenty: зробити той самий API запит напряму
   → Якщо працює - проблема в ноді
   → Якщо не працює - проблема в API/credentials
   ```

3. **Перевір логи сервера:**
   ```
   mcp-vps-hostinger:
   → docker logs n8n (логи n8n)
   → docker logs twenty (логи Twenty CRM)
   ```

### Common Errors & Solutions

| Помилка | Причина | Рішення |
|---------|---------|---------|
| 401 Unauthorized | Невірний API key | Перевірити credentials в n8n |
| 404 Not Found | Невірний endpoint | Перевірити URL в GenericFunctions.ts |
| 400 Bad Request | Невірний формат даних | Перевірити body запиту |
| Connection refused | Сервер недоступний | Перевірити VPS/Docker |
| Timeout | Повільний запит | Збільшити timeout або оптимізувати |
| Invalid object value for "domainName" | domainName має бути Links object | Перевірити transformCompanyFields() |
| Object doesn't have "firstName" field | Person API очікує name: {firstName, lastName} | Перевірити transformPersonFields() |
| Object doesn't have "body" field | Notes не підтримують body | Видалити body з запиту |
| SSRF protection | MCP не може викликати webhook | Тестувати workflow вручну в n8n UI |

### Release Checklist (Перед публікацією)

```
[ ] 1. npm run build - успішно
[ ] 2. npm run lint - без помилок
[ ] 3. Всі CRUD операції працюють для кожного ресурсу
[ ] 4. Bulk operations працюють
[ ] 5. Upsert працює (create + update сценарії)
[ ] 6. Trigger node реєструє webhooks
[ ] 7. Trigger отримує events
[ ] 8. Оновити version в package.json
[ ] 9. npm publish
[ ] 10. Перевірити на production n8n після публікації
```

### Quick Test Commands

```
# Через mcp-abm24-n8n:
- Отримати workflow: get workflow 0Xb21aub9GZWBOLWG-eJ5
- Запустити workflow: execute workflow 0Xb21aub9GZWBOLWG-eJ5
- Останні executions: get executions

# Через mcp-twenty:
- Список компаній: GET /rest/companies
- Створити компанію: POST /rest/companies {name: "Test"}
- Перевірити запис: GET /rest/companies/{id}

# Через mcp-vps-hostinger:
- Логи n8n: docker logs n8n --tail 100
- Логи twenty: docker logs twenty --tail 100
```

---

## Contacts

- **Author**: abm24
- **Email**: info@abm24.cloud
- **Issues**: https://github.com/vomos-ua/n8n-nodes-twenty/issues
