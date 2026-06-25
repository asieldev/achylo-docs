# Payment Widgets v2

Add a **"Pay with Crypto"** button to any website with the new server-driven architecture. More secure, flexible, and independent from V1 configuration.

---

## What is it for?

| Ideal for | Example |
|------------|---------|
| **Online stores** | Wix, Shopify, WooCommerce, PrestaShop |
| **Landing pages** | Sales pages, conversion funnels |
| **Donation buttons** | NGOs, content creators |
| **Digital services** | SaaS, courses, subscriptions |

---

## 🆕 Server-Driven Architecture

V2 uses a **server-driven** approach for maximum security:

- **SDK only accepts `widget-id`** — no payment configuration exposed in frontend
- **Product and values loaded from backend** — impossible to manipulate on client
- **Smart Account as receiver** — payments go to SA, not merchant's EOA

---

## Dashboard Location

Product and Widget v2 management **is no longer available in the User Profile modal**. Use the dedicated panel instead:

1. Go to [achylo.com](https://achylo.com) and log in
2. Open **Stats** (navigation menu)
3. Select the **Payments** tab
4. Open **Widgets & Products**

From there you can create and manage **Products**, **Widgets v1**, and **Widgets v2** (including embed codes and domain whitelists).

> **Note:** The User Profile modal may still show API Keys and legacy Widget v1 shortcuts, but full product/widget management lives under **Stats → Payments → Widgets & Products**.

---

## Step 1 – Create a Product

Before creating a widget with an existing product, you need to define the product (unless you use the [bundle endpoint](#create-widget--product-in-one-request-recommended) below).

### Via Dashboard

1. Go to **Stats → Payments → Widgets & Products**
2. Open the **Products** tab
3. Click **"Create Product"**
4. Fill in:
   - **Name**: Product name (e.g., "Monthly Subscription")
   - **Description**: Detailed description
   - **Amount**: Fixed amount in USDC (e.g., `29.99`)
   - **Currency**: Always `USDC`
   - **Allow Custom Amount**: Check if you want customers to enter the amount
5. Copy the **Product ID** (starts with `prod_`)

### Via API

```javascript
const response = await fetch('https://api.achylo.com/api/v1/products', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Monthly Subscription',
    description: 'Full platform access',
    amount: '29.99',
    currency: 'USDC',
    allowCustomAmount: false,
    billingInterval: 'monthly' // or 'one_time', 'weekly', 'yearly'
  })
});

const product = await response.json();
console.log('Product ID:', product.id); // prod_abc12345
```

---

## Step 2 – Create the Widget

Associate a product with a widget, or create both in a single API call (see [bundle](#create-widget--product-in-one-request-recommended)).

### Via Dashboard

1. In **Stats → Payments → Widgets & Products**, open the **Widgets v2** tab
2. Click **"Create Widget"**
3. Configure:
   - **Resource Type**: Select `Product`
   - **Product**: Choose the product created earlier
   - **Origin Whitelist**: Add domains where you'll use the widget
     - `https://yourstore.com`
     - `https://www.yourstore.com`
     - `https://checkout.yourstore.com`
4. Click **"Create"**
5. Copy the **Widget ID** (starts with `wgt_`)
6. Copy the generated **Embed Code**

### Via API

```javascript
const response = await fetch('https://api.achylo.com/api/v1/widgets', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    resourceType: 'product',
    resourceId: 'prod_abc12345',                              // Product ID
    originWhitelist: ['https://yourstore.com', 'https://www.yourstore.com'],
    payoutAddress: '0x...SMART_ACCOUNT_ADDRESS',              // Optional - uses SA automatically
    webhookUrl: 'https://yourserver.com/webhooks/achylo',     // Optional
    webhookSecret: 'whsec_your64hexcharsecret'                // Optional — required if webhookUrl is set
  })
});

const widget = await response.json();
console.log('Widget ID:', widget.id); // wgt_def67890
```

**Request body parameters:**

| Field | Required | Description |
|-------|----------|-------------|
| `resourceType` | ✅ | `"product"` or `"payment_link"` |
| `resourceId` | ✅ | Product ID (`prod_...`) or Payment Link ID |
| `originWhitelist` | — | Array of allowed domains |
| `payoutAddress` | — | Smart Account that receives payments (auto-detected if omitted) |
| `webhookUrl` | — | HTTPS endpoint to notify on payment confirmation |
| `webhookSecret` | — | Secret to sign webhook payloads. If `webhookUrl` is set but this is omitted, a secret is auto-generated |

---

## Create Widget + Product in One Request (Recommended)

If you do not need a standalone product record first, use the **bundle** endpoint. It creates the product and the widget in a single request — the same flow used by the dashboard when you create a Widget v2 with a new product.

### Via API

```javascript
const response = await fetch('https://api.achylo.com/api/v1/widgets/bundle', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    resourceType: 'product',
    productDetails: {
      name: 'Monthly Subscription',
      description: 'Full platform access',
      amount: '29.99',
      allowCustomAmount: false
    },
    originWhitelist: ['https://yourstore.com', 'https://www.yourstore.com'],
    payoutAddress: '0x...SMART_ACCOUNT_ADDRESS',              // Required — Smart Account that receives payments
    webhookUrl: 'https://yourserver.com/webhooks/achylo',     // Optional
    webhookSecret: 'whsec_your64hexcharsecret'                // Optional — required if webhookUrl is set
  })
});

const { widget, product } = await response.json();
console.log('Widget ID:', widget.id);   // wgt_def67890
console.log('Product ID:', product.id); // prod_abc12345 (created automatically)
console.log('Embed code:', widget.embedCode);
```

**When to use each endpoint:**

| Endpoint | Use case |
|----------|----------|
| `POST /api/v1/widgets/bundle` | New product + widget in one step (simplest) |
| `POST /api/v1/products` + `POST /api/v1/widgets` | Reuse an existing product across multiple widgets |

**Bundle request body parameters:**

| Field | Required | Description |
|-------|----------|-------------|
| `resourceType` | ✅ | `"product"` or `"payment_link"` |
| `productDetails` | ✅* | Product fields when `resourceType` is `"product"` (*omit when linking an existing payment link) |
| `productDetails.name` | ✅ | Product name |
| `productDetails.description` | — | Optional description |
| `productDetails.amount` | ✅* | Fixed amount in USDC (*required unless `allowCustomAmount` is `true`) |
| `productDetails.allowCustomAmount` | — | Allow payer to enter amount (default `false`) |
| `resourceId` | ✅* | Payment Link UUID when `resourceType` is `"payment_link"` |
| `payoutAddress` | ✅ | Smart Account address that receives payments |
| `originWhitelist` | — | Array of allowed domains |
| `webhookUrl` | — | HTTPS endpoint to notify on payment confirmation |
| `webhookSecret` | — | Secret to sign webhook payloads (max 64 chars) |

**Response (201):**

```json
{
  "widget": {
    "id": "wgt_def67890",
    "merchantId": "0x...",
    "resourceType": "product",
    "resourceId": "prod_abc12345",
    "originWhitelist": ["https://yourstore.com"],
    "webhookUrl": null,
    "active": true,
    "createdAt": "2025-06-19T00:00:00.000Z",
    "embedCode": "<script async src=\"https://achylo.com/widget.js?v=1.4\"></script>\n<achylo-button widget-id=\"wgt_def67890\"></achylo-button>"
  },
  "product": {
    "id": "prod_abc12345",
    "name": "Monthly Subscription",
    "amount": "29.99",
    "currency": "USDC",
    "allowCustomAmount": false,
    "active": true
  }
}
```

---

## Step 3 – Install on Your Site

### Embed Code

```html
<!-- Achylo Widget v2 -->
<script async src="https://achylo.com/widget.js?v=1.4"></script>

<achylo-button widget-id="wgt_def67890"></achylo-button>
```

### 🟣 Wix (Detailed step-by-step)

1. **In Wix Editor**, click the **"+ Add"** button
2. Select **"Embed"** → **"Embed HTML"** or **"HTML Code"**
3. Click **"Enter Code"**
4. Paste the code:

```html
<script async src="https://achylo.com/widget.js?v=1.4"></script>
<achylo-button widget-id="wgt_def634956"></achylo-button>
```

5. Click **"Apply"** or **"Update"**
6. Position the button where you want on the page
7. **Publish** the site

---

## Step 4 – Customization

### Available Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `widget-id` | ✅ | V2 widget ID (`wgt_...`) |
| `label` | — | Button text (default: product name) |
| `color` | — | Hex color (default: `#ff7f41`) |

### Custom Example

```html
<achylo-button 
  widget-id="wgt_def67890"
  label="💳 Subscribe Now"
  color="#10b981">
</achylo-button>
```

---

## 🎯 V2 Payment Flow

1. **Customer clicks button**
2. **SDK loads configuration from backend** using `widget-id`
3. **If product with variable amount**: shows popup to enter amount
4. **Backend creates Payment Link** associated with the product
5. **Payment modal opens** with correct data
6. **Payment goes to merchant's Smart Account**
7. **Success event** is fired on frontend

---

## 🛡️ Advanced Security

### Server-Driven Configuration

- **No values exposed in frontend** — everything comes from backend
- **Impossible to manipulate values** via JavaScript
- **Product validated on server** before creating payment link

### Smart Account Receiver

- **Payments go to SA** — more secure than EOA
- **SA configured automatically** during widget creation
- **Same flow as V1** for end customer

### Origin Whitelist

- **Only works on authorized domains**
- **Protects against unauthorized use**
- **Configure in dashboard or via API**

---

## Products vs Direct Links

| Feature | Product (V2) | Direct Link (V1) |
|---------|--------------|------------------|
| **Configuration** | Server-driven | Client-side |
| **Security** | Maximum | Good |
| **Fixed amounts** | ✅ | ✅ |
| **Variable amounts** | ✅ | ❌ |
| **Recurring billing** | ✅ | ❌ |
| **Smart Account receiver** | ✅ | ✅ |

---

## Framework Examples

### React

```jsx
import { useEffect, useRef } from 'react';

export function ProductButton({ widgetId, label }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const btn = document.createElement('achylo-button');
    btn.setAttribute('widget-id', widgetId);
    if (label) btn.setAttribute('label', label);

    btn.addEventListener('achylo:payment-success', (e) => {
      console.log('Payment successful:', e.detail);
    });

    containerRef.current.appendChild(btn);
    return () => btn.remove();
  }, [widgetId, label]);

  return <div ref={containerRef} />;
}

// Usage
<ProductButton 
  widgetId="wgt_def67890" 
  label="💳 Subscribe Now" 
/>
```

### Vue

```vue
<template>
  <div ref="widgetContainer" />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({ 
  widgetId: String, 
  label: String 
});
const widgetContainer = ref(null);

onMounted(() => {
  const btn = document.createElement('achylo-button');
  btn.setAttribute('widget-id', props.widgetId);
  if (props.label) btn.setAttribute('label', props.label);

  btn.addEventListener('achylo:payment-success', (e) => {
    console.log('Paid:', e.detail);
  });

  widgetContainer.value.appendChild(btn);
});
</script>
```

### Next.js

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function AchyloWidgetButton({ 
  widgetId, 
  label 
}: { 
  widgetId: string; 
  label?: string; 
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const btn = document.createElement('achylo-button');
    btn.setAttribute('widget-id', widgetId);
    if (label) btn.setAttribute('label', label);

    ref.current.appendChild(btn);
    return () => btn.remove();
  }, [widgetId, label]);

  return <div ref={ref} />;
}
```

---

## API Reference

### Create Product

```http
POST /api/v1/products
X-API-Key: YOUR_API_KEY

{
  "name": "Monthly Subscription",
  "description": "Full access",
  "amount": "29.99",
  "currency": "USDC",
  "allowCustomAmount": false,
  "billingInterval": "monthly"
}
```

### Create Widget (link existing product)

```http
POST /api/v1/widgets
X-API-Key: YOUR_API_KEY

{
  "resourceType": "product",
  "resourceId": "prod_abc12345",
  "originWhitelist": ["https://yourstore.com"],
  "payoutAddress": "0x...SMART_ACCOUNT",
  "webhookUrl": "https://yourserver.com/webhooks/achylo",
  "webhookSecret": "whsec_your64hexcharsecret"
}
```

### Create Widget + Product (bundle)

Creates a new product and widget in a single request. No prior `POST /api/v1/products` call needed.

```http
POST /api/v1/widgets/bundle
X-API-Key: YOUR_API_KEY

{
  "resourceType": "product",
  "productDetails": {
    "name": "Monthly Subscription",
    "description": "Full access",
    "amount": "29.99",
    "allowCustomAmount": false
  },
  "originWhitelist": ["https://yourstore.com"],
  "payoutAddress": "0x...SMART_ACCOUNT",
  "webhookUrl": "https://yourserver.com/webhooks/achylo",
  "webhookSecret": "whsec_your64hexcharsecret"
}
```

**Response:** `{ "widget": { ... , "embedCode": "..." }, "product": { ... } }`

> `payoutAddress` is **required** on the bundle endpoint. `webhookUrl` and `webhookSecret` are optional.

### List Widgets

```http
GET /api/v1/widgets
X-API-Key: YOUR_API_KEY
```

---

## Troubleshooting V2

### Widget doesn't appear
- ✅ Check `widget.js?v=1.4` loaded in console
- ✅ Confirm correct `widget-id` (`wgt_...`)
- ✅ Product exists and is active

### "Domain not authorized"
- ✅ Add domain to widget whitelist
- ✅ Include full `https://` prefix

### "Product not found"
- ✅ Check `resourceId` in widget
- ✅ Confirm product is `active=true`

### Popup doesn't open (variable amount)
- ✅ Check popup blockers
- ✅ Click must be direct user action

---

## Migration V1 → V2

| V1 | V2 |
|----|----|
| `merchant-id` + `amount` | `widget-id` |
| Client-side config | Server-driven |
| Fixed amounts only | Fixed + variable |
| Smart Account receiver | Smart Account receiver |

**Migration benefits:**
- ✅ More security (server-driven)
- ✅ Variable amount support
- ✅ Reusable products
- ✅ Native Smart Account

---

## Related Resources

- [Payment Links API →](developers/payment-links.md) – Programmatic payment links
- [Webhooks →](developers/webhooks.md) – Real-time notifications
- [API Keys →](developers/api-keys.md) – Manage API keys
- [Payment Widgets V1 →](developers/payment-widgets.md) – Legacy version
