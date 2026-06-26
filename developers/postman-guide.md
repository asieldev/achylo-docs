# Postman Step-by-Step Guide

Complete guide to test the Achylo Pay API using **Postman**. Covers both **V1** and **V2** widget creation flows.

---

## Prerequisites

- [Postman](https://www.postman.com/downloads/) installed
- An Achylo account at [achylo.com](https://achylo.com)
- An **API Key** (created from your User Profile → API Keys)

> ⚠️ **Important**: API Key creation requires JWT authentication (login via wallet). Once created, you can use the API Key for all subsequent requests.

---

## Environment Setup

### 1. Create a Postman Environment

Click **"Environments"** → **"+"** and add these variables:

| Variable | Value |
|----------|-------|
| `base_url` | `https://api.achylo.com` |
| `api_key` | `achylo_YOUR_API_KEY_HERE` |
| `smart_account` | `0xYOUR_SMART_ACCOUNT_ADDRESS` |

### 2. Set the environment as active

Select your environment from the dropdown in the top-right corner of Postman.

---

## Flow A: Create a V1 Widget (Simple)

V1 widgets require amount and currency to be set on the frontend (client-side configuration).

---

### Step 1 — Create Widget Merchant

Creates a V1 widget with domain whitelist.

```
POST {{base_url}}/api/widget-merchants
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |
| `Content-Type` | `application/json` |

**Body (JSON):**

> `origins` is optional. Omit it or send `[]` to create a **public** V1 widget embeddable from any domain.

```json
{
  "origins": [
    "https://yourstore.com",
    "https://www.yourstore.com",
    "http://localhost:3000"
  ],
  "payoutAddress": "{{smart_account}}"
}
```

**Expected Response (201):**

```json
{
  "id": 1,
  "merchantId": "achylo_a1b2c3d4",
  "creatorAddress": "0x...",
  "payoutAddress": "0x...",
  "origins": ["https://yourstore.com", "https://www.yourstore.com", "http://localhost:3000"],
  "active": true,
  "createdAt": "2025-06-19T00:00:00.000Z"
}
```

> 📌 Save the `merchantId` — you'll need it for the embed code.

---

### Step 2 — List Your Widgets

```
GET {{base_url}}/api/widget-merchants
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

**Expected Response (200):**

```json
{
  "merchants": [
    {
      "id": 1,
      "merchantId": "achylo_a1b2c3d4",
      "payoutAddress": "0x...",
      "origins": ["https://yourstore.com"],
      "active": true,
      "createdAt": "2025-06-19T00:00:00.000Z"
    }
  ]
}
```

---

### Step 3 — Update Widget Origins

```
PATCH {{base_url}}/api/widget-merchants/achylo_a1b2c3d4
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |
| `Content-Type` | `application/json` |

**Body (JSON):**

> Send `"origins": []` to make the V1 widget public. If origins are listed, only those domains can use the widget.

```json
{
  "origins": [
    "https://yourstore.com",
    "https://www.yourstore.com",
    "https://newdomain.com"
  ]
}
```

**Expected Response (200):**

```json
{
  "id": 1,
  "merchantId": "achylo_a1b2c3d4",
  "origins": ["https://yourstore.com", "https://www.yourstore.com", "https://newdomain.com"],
  "active": true,
  "updatedAt": "2025-06-19T01:00:00.000Z"
}
```

---

### Step 4 — Get Widget (Public)

This endpoint is public — no authentication needed.

```
GET {{base_url}}/api/widget-merchants/achylo_a1b2c3d4
```

**No headers required.**

**Expected Response (200):**

```json
{
  "merchantId": "achylo_a1b2c3d4",
  "payoutAddress": "0x...",
  "origins": ["https://yourstore.com", "https://www.yourstore.com"]
}
```

---

### Step 5 — Deactivate Widget

```
DELETE {{base_url}}/api/widget-merchants/achylo_a1b2c3d4
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Merchant deactivated"
}
```

---

### Step 6 — Use the Embed Code

Paste this on your website:

```html
<script src="https://achylo.com/achylo.js?v=5"></script>

<achylo-button
  merchant-id="achylo_a1b2c3d4"
  amount="29.99"
  currency="USDC"
  label="💳 Pay with Crypto">
</achylo-button>
```

---

## Flow B: Create a V2 Widget (Server-Driven)

V2 widgets use a **server-driven architecture**: you create a Product first (or use the bundle endpoint), then associate it with a Widget. The frontend only uses the `widget-id` — no amount or currency exposed.

**Dashboard:** manage products and widgets under **Stats → Payments → Widgets & Products** (not in the User Profile modal).

**Two API paths:**

| Path | Endpoints | Best for |
|------|-----------|----------|
| **Bundle (recommended)** | `POST /api/v1/widgets/bundle` | New product + widget in one step |
| **Separate** | `POST /api/v1/products` → `POST /api/v1/widgets` | Reusing an existing product |

---

### Step 1 — Create a Product

```
POST {{base_url}}/api/v1/products
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |
| `Content-Type` | `application/json` |

**Body (JSON) — Fixed Amount:**

```json
{
  "name": "Monthly Subscription",
  "description": "Full platform access for 30 days",
  "amount": "29.99",
  "currency": "USDC",
  "billingInterval": "one_time",
  "allowCustomAmount": false
}
```

**Body (JSON) — Variable Amount (Donation):**

```json
{
  "name": "Donation",
  "description": "Support our project",
  "currency": "USDC",
  "billingInterval": "one_time",
  "allowCustomAmount": true
}
```

**Expected Response (201):**

```json
{
  "id": "prod_e5f6g7h8",
  "merchantId": "0x...",
  "name": "Monthly Subscription",
  "description": "Full platform access for 30 days",
  "amount": "29.99",
  "currency": "USDC",
  "billingInterval": "one_time",
  "allowCustomAmount": true,
  "active": true,
  "createdAt": "2025-06-19T00:00:00.000Z",
  "updatedAt": null
}
```

> 📌 Save the `id` (e.g. `prod_e5f6g7h8`) — you'll need it for the widget.

**Billing Interval options:** `one_time`, `daily`, `weekly`, `monthly`, `yearly`

---

### Step 2 — List Your Products

```
GET {{base_url}}/api/v1/products
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

**Query Params (optional):**

| Key | Value | Description |
|-----|-------|-------------|
| `active` | `true` | Filter by active status (default: `true`) |

**Expected Response (200):**

```json
{
  "products": [
    {
      "id": "prod_e5f6g7h8",
      "name": "Monthly Subscription",
      "amount": "29.99",
      "currency": "USDC",
      "billingInterval": "one_time",
      "allowCustomAmount": true,
      "active": true
    }
  ]
}
```

---

### Step 3 — Get a Single Product

```
GET {{base_url}}/api/v1/products/prod_e5f6g7h8
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

---

### Step 4 — Update a Product

```
PUT {{base_url}}/api/v1/products/prod_e5f6g7h8
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |
| `Content-Type` | `application/json` |

**Body (JSON):**

```json
{
  "name": "Pro Subscription",
  "amount": "49.99",
  "description": "Premium access with all features"
}
```

> Only include fields you want to change. Others keep their current values.

---

### Step 5 — Create a Widget (Associate with Product)

```
POST {{base_url}}/api/v1/widgets
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |
| `Content-Type` | `application/json` |

**Body (JSON):**

> `originWhitelist` is optional. Omit it or send `[]` to create a **public** widget embeddable from any domain.

```json
{
  "resourceType": "product",
  "resourceId": "prod_e5f6g7h8",
  "payoutAddress": "{{smart_account}}",
  "originWhitelist": [
    "https://yourstore.com",
    "https://www.yourstore.com",
    "http://localhost:3000"
  ],
  "webhookUrl": "https://yourserver.com/webhooks/achylo"
}
```

**Expected Response (201):**

```json
{
  "id": "wgt_i9j0k1l2",
  "merchantId": "0x...",
  "resourceType": "product",
  "resourceId": "prod_e5f6g7h8",
  "originWhitelist": ["https://yourstore.com", "https://www.yourstore.com", "http://localhost:3000"],
  "webhookUrl": "https://yourserver.com/webhooks/achylo",
  "active": true,
  "createdAt": "2025-06-19T00:00:00.000Z",
  "embedCode": "<script async src=\"https://achylo.com/widget.js?v=1.6\"></script>\n<achylo-button widget-id=\"wgt_i9j0k1l2\"></achylo-button>"
}
```

> 📌 Save the `id` (e.g. `wgt_i9j0k1l2`) and the `embedCode`.

---

### Step 5 (Alternative) — Create Widget + Product in One Request (Bundle)

Skip Steps 1 and 5 when you do not need a standalone product first. This endpoint creates the product and widget together.

```
POST {{base_url}}/api/v1/widgets/bundle
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |
| `Content-Type` | `application/json` |

**Body (JSON) — Fixed Amount:**

```json
{
  "resourceType": "product",
  "productDetails": {
    "name": "Monthly Subscription",
    "description": "Full platform access for 30 days",
    "amount": "29.99",
    "allowCustomAmount": false
  },
  "payoutAddress": "{{smart_account}}",
  "originWhitelist": [
    "https://yourstore.com",
    "https://www.yourstore.com",
    "http://localhost:3000"
  ],
  "webhookUrl": "https://yourserver.com/webhooks/achylo"
}
```

**Body (JSON) — Variable Amount (Donation):**

```json
{
  "resourceType": "product",
  "productDetails": {
    "name": "Donation",
    "description": "Support our project",
    "allowCustomAmount": true
  },
  "payoutAddress": "{{smart_account}}",
  "originWhitelist": ["https://yourstore.com"]
}
```

> `payoutAddress` (Smart Account) is **required** on the bundle endpoint.

**Expected Response (201):**

```json
{
  "widget": {
    "id": "wgt_i9j0k1l2",
    "merchantId": "0x...",
    "resourceType": "product",
    "resourceId": "prod_e5f6g7h8",
    "originWhitelist": ["https://yourstore.com"],
    "webhookUrl": "https://yourserver.com/webhooks/achylo",
    "active": true,
    "createdAt": "2025-06-19T00:00:00.000Z",
    "embedCode": "<script async src=\"https://achylo.com/widget.js?v=1.6\"></script>\n<achylo-button widget-id=\"wgt_i9j0k1l2\"></achylo-button>"
  },
  "product": {
    "id": "prod_e5f6g7h8",
    "name": "Monthly Subscription",
    "amount": "29.99",
    "currency": "USDC",
    "allowCustomAmount": false,
    "active": true
  }
}
```

> 📌 Save `widget.id`, `widget.embedCode`, and `product.id` if you need to reference the product later.

---

### Step 6 — List Your Widgets

```
GET {{base_url}}/api/v1/widgets
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

---

### Step 7 — Get a Single Widget

```
GET {{base_url}}/api/v1/widgets/wgt_i9j0k1l2
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

---

### Step 8 — Update Widget

```
PUT {{base_url}}/api/v1/widgets/wgt_i9j0k1l2
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |
| `Content-Type` | `application/json` |

**Body (JSON):**

```json
{
  "originWhitelist": [
    "https://yourstore.com",
    "https://newdomain.com"
  ],
  "webhookUrl": "https://newserver.com/webhooks/achylo"
}
```

---

### Step 9 — Resolve Widget (Public)

This is what the SDK calls internally. No authentication needed.

```
GET {{base_url}}/api/payment-links/widget-v2/wgt_i9j0k1l2
```

**No headers required.**

**Expected Response (200):**

```json
{
  "widgetId": "wgt_i9j0k1l2",
  "resourceType": "product",
  "resourceId": "prod_e5f6g7h8",
  "product": {
    "name": "Monthly Subscription",
    "description": "Full platform access for 30 days",
    "amount": "29.99",
    "currency": "USDC",
    "billingInterval": "one_time",
    "allowCustomAmount": true
  }
}
```

---

### Step 10 — Checkout (Public)

This is what the SDK calls when the customer clicks the button. No authentication needed.

```
POST {{base_url}}/api/payment-links/widget-v2/wgt_i9j0k1l2/checkout
```

**Headers:**

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

**Body (JSON) — Fixed Amount Product:**

```json
{}
```

**Body (JSON) — Variable Amount Product (Donation):**

```json
{
  "amount": "15.00"
}
```

**Expected Response (200):**

> **Expiration**: Product and V1 widget checkouts generate a new payment link with a **15-minute** expiry (`expires_at = now + 15 min`). Payment Link widgets reuse an existing link and keep whatever `expiresInMinutes` was set at creation. After expiry, the checkout returns `410 Payment link has expired`.

```json
{
  "checkoutUrl": "https://achylo.com/pay/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "paymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "productId": "prod_e5f6g7h8",
  "amount": "29.990000",
  "currency": "USDC",
  "status": "pending"
}
```

> Open the `checkoutUrl` in a browser to see the payment page. The underlying payment link expires **15 minutes** after this checkout call.

---

### Step 11 — Delete Widget (Soft Delete)

```
DELETE {{base_url}}/api/v1/widgets/wgt_i9j0k1l2
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

**Expected Response (200):**

```json
{
  "deleted": true
}
```

---

### Step 12 — Archive Product (Soft Delete)

```
DELETE {{base_url}}/api/v1/products/prod_e5f6g7h8
```

**Headers:**

| Key | Value |
|-----|-------|
| `X-API-Key` | `{{api_key}}` |

**Expected Response (200):**

```json
{
  "archived": true
}
```

---

### Step 13 — Use the Embed Code

Paste this on your website:

```html
<script async src="https://achylo.com/widget.js?v=1.6"></script>

<achylo-button widget-id="wgt_i9j0k1l2"></achylo-button>
```

---

## API Reference Summary

### V1 Widget Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/widget-merchants` | API Key or JWT | Create V1 widget |
| `GET` | `/api/widget-merchants` | API Key or JWT | List your widgets |
| `GET` | `/api/widget-merchants/:merchantId` | Public | Get widget info |
| `PATCH` | `/api/widget-merchants/:merchantId` | API Key or JWT | Update origins |
| `DELETE` | `/api/widget-merchants/:merchantId` | API Key or JWT | Deactivate widget |

### V2 Product Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/products` | API Key or JWT | Create product |
| `GET` | `/api/v1/products` | API Key or JWT | List products |
| `GET` | `/api/v1/products/:id` | API Key or JWT | Get product |
| `PUT` | `/api/v1/products/:id` | API Key or JWT | Update product |
| `DELETE` | `/api/v1/products/:id` | API Key or JWT | Archive product |

### V2 Widget Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/widgets` | API Key or JWT | Create widget |
| `GET` | `/api/v1/widgets` | API Key or JWT | List widgets |
| `GET` | `/api/v1/widgets/:id` | API Key or JWT | Get widget |
| `PUT` | `/api/v1/widgets/:id` | API Key or JWT | Update widget |
| `DELETE` | `/api/v1/widgets/:id` | API Key or JWT | Delete widget |
| `GET` | `/api/payment-links/widget-v2/:widgetId` | Public | Resolve widget config |
| `POST` | `/api/payment-links/widget-v2/:widgetId/checkout` | Public | Create checkout |

---

## Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| `401` | `API Key inválida o revocada` | Check your API Key is correct and not revoked |
| `400` | `origins must be an array when provided` | Send an array, omit the field, or use `[]` for a public widget |
| `400` | `Valid payoutAddress (Smart Account) is required` | Add a valid Ethereum address |
| `400` | `resourceType must be "payment_link" or "product"` | Use `"product"` or `"payment_link"` |
| `404` | `Product not found or not active` | Check product ID and that it's active |
| `404` | `Widget not found` | Check widget ID |
| `403` | `Origin not allowed` | Add your domain to the widget's origin whitelist |
| `410` | `Payment link has expired` | Link exceeded its `expiresAt` — create a new checkout (Product/V1) or a new payment link |
| `429` | `Too many requests` | Wait and retry — rate limit exceeded |

---

## Tips

- **Test locally**: Add `http://localhost:3000` (or your port) to the origin whitelist
- **Postman variables**: Use `{{variable}}` syntax to avoid hardcoding values
- **Save responses**: Use Postman's **Tests** tab to auto-save IDs:
  ```javascript
  // Auto-save product ID from response
  var json = pm.response.json();
  pm.environment.set("product_id", json.id);
  ```
- **V2 is recommended** for production — server-driven security prevents client-side manipulation
- **Webhook testing**: Use [webhook.site](https://webhook.site) as a temporary `webhookUrl` for testing
