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

## Step 1 – Create a Product

Before creating the widget, you need to define a product.

### Via Dashboard

1. Go to [achylo.com](https://achylo.com) and log in
2. Open your **User Profile** → **"Products"** section
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

Now associate the product with a widget.

### Via Dashboard

1. In the same **"Widgets v2"** section, click **"Create Widget"**
2. Configure:
   - **Resource Type**: Select `Product`
   - **Product**: Choose the product created earlier
   - **Origin Whitelist**: Add domains where you'll use the widget
     - `https://yourstore.com`
     - `https://www.yourstore.com`
     - `https://checkout.yourstore.com`
3. Click **"Create"**
4. Copy the **Widget ID** (starts with `wgt_`)
5. Copy the generated **Embed Code**

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
    resourceId: 'prod_abc12345', // Product ID
    originWhitelist: ['https://yourstore.com', 'https://www.yourstore.com'],
    payoutAddress: '0x...SMART_ACCOUNT_ADDRESS' // Optional - uses SA automatically
  })
});

const widget = await response.json();
console.log('Widget ID:', widget.id); // wgt_def67890
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

### Create Widget

```http
POST /api/v1/widgets
X-API-Key: YOUR_API_KEY

{
  "resourceType": "product",
  "resourceId": "prod_abc12345",
  "originWhitelist": ["https://yourstore.com"],
  "payoutAddress": "0x...SMART_ACCOUNT"
}
```

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

- [Payment Links API →](payment-links.md) – Programmatic payment links
- [Webhooks →](webhooks.md) – Real-time notifications
- [API Keys →](api-keys.md) – Manage API keys
- [Payment Widgets V1 →](payment-widgets.md) – Legacy version
