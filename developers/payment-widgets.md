# Payment Widgets

Add a **"Pay with Crypto"** button to any website. Your customers click, a payment window opens, and they pay. Simple as that.

---

## What is it for?

| Ideal for | Example |
|-----------|---------|
| **Online stores** | Wix, Shopify, WooCommerce, PrestaShop |
| **Landing pages** | Sales pages, conversion funnels |
| **Donation buttons** | NGOs, content creators |
| **Digital services** | SaaS, courses, subscriptions |

---

## Option 1: No-Code (Copy and Paste)

For non-developers. Works on WordPress, Wix, Shopify, or plain HTML.

### Step 1 — Copy the code

```html
<!-- Achylo Payment Widget -->
<script src="https://achylo.com/achylo.js?v=5"></script>

<achylo-button
  merchant-id="achylo_YOUR_WIDGET_ID"
  amount="29.99"
  currency="USDC"
  label="💳 Pay with Crypto"
  description="Payment for order #1234">
</achylo-button>
```

### Step 2 — Get your Widget ID

1. Go to [achylo.com](https://achylo.com) and log in
2. Open your **User Profile** → **"Payment Widgets"** section
3. Click **"Create new widget"**
4. Add the domains where you'll use the widget (e.g. `https://yourstore.com`)
5. Copy the **Widget ID** (starts with `achylo_`)

### Step 3 — Customize

Replace in the code:

```html
<achylo-button
  merchant-id="achylo_cv80520f"    <!-- Your Widget ID -->
  amount="50.00"                    <!-- Value in USDC -->
  currency="USDC"                     <!-- Always USDC -->
  label="💳 Pay now"                  <!-- Button text -->
  description="Monthly subscription"  <!-- Payment description -->
  color="#6366f1">                  <!-- Button color (optional) -->
</achylo-button>
```

### Step 4 — Paste on your site

#### 🟣 Wix (Detailed step-by-step)

1. **In the Wix Editor**, click the **"+ Add"** button
2. Select **"Embed"** → **"Embed HTML"** or **"HTML Code"**
3. Click **"Enter Code"**
4. Paste the widget code:

```html
<script src="https://achylo.com/achylo.js?v=5"></script>
<achylo-button
  merchant-id="achylo_YOUR_WIDGET_ID"
  amount="29.99"
  currency="USDC"
  label="💳 Pay with Crypto"
  description="Payment for order #1234">
</achylo-button>
```

5. Click **"Apply"** or **"Update"**
6. Position the button where you want on the page
7. **Publish** the site to see it working

> 💡 **Tip**: If the button doesn't appear, check that the domain `yoursite.wixsite.com` was added to the widget whitelist.

---

| Platform | How to add |
|----------|------------|
| **WordPress** | Editor → "Custom HTML" |
| **Wix** | See detailed guide above ↑ |
| **Shopify** | Theme → Edit code → New snippet |
| **Plain HTML** | Inside the `<body>` |

### Step 5 — Test

1. Open your site in the browser
2. Click the button
3. A payment modal should open
4. ✅ Ready!

---

## Option 2: JavaScript (Programmatic Control)

For developers who need to listen to events or control the flow.

### Available attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `merchant-id` | ✅ | Your Widget ID (`achylo_...`) |
| `amount` | ✅* | Value in USDC (e.g. `"10.50"`). Ignored if `amount-from` is set. |
| `currency` | ✅ | Always `"USDC"` |
| `label` | — | Button text (default: `"Pay with Crypto"`) |
| `description` | — | Custom payment description (optional) |
| `color` | — | Hex color (default: `#ff7f41`) |
| `amount-from` | — | CSS selector of the element that contains the cart total. The value is read at click time. `$`, `€`, `£`, `,` symbols are removed automatically. |

### DOM events

The button emits custom DOM events you can listen to. All event data is available in `e.detail`.

| Event | `e.detail` | When |
|-------|-----------|------|
| `achylo:payment-success` | `txHash, amount, token, chainId, paymentId` | Payment confirmed on-chain |
| `achylo:payment-error` | `error, paymentId` | Payment failed or was rejected |
| `achylo:payment-cancelled` | `paymentId` | User closed the modal without paying |
| `achylo:opened` | `paymentId, mode, url` | Modal or tab opened |

```html
<achylo-button
  id="pay-btn"
  merchant-id="achylo_cv80520f"
  amount="25.00"
  currency="USDC">
</achylo-button>

<script>
  const btn = document.getElementById('pay-btn');

  // Payment confirmed on-chain
  btn.addEventListener('achylo:payment-success', (e) => {
    console.log('TX hash:', e.detail.txHash);
    console.log('Amount:', e.detail.amount, e.detail.token);
    console.log('Chain ID:', e.detail.chainId);
    window.location.href = '/thank-you?tx=' + e.detail.txHash;
  });

  // Payment error
  btn.addEventListener('achylo:payment-error', (e) => {
    console.error('❌ Error:', e.detail.error);
    alert('Payment failed. Try again.');
  });

  // User closed the modal
  btn.addEventListener('achylo:payment-cancelled', () => {
    console.log('User cancelled');
  });
</script>
```

---

## Option 3: API (Backend Integration)

For developers who need to create and manage widgets programmatically from their backend.

> **Authentication**: All endpoints accept `X-API-Key` header. See [API Keys →](api-keys.md)

### Step 1 — Create a Widget

```javascript
const response = await fetch('https://api.achylo.com/api/widget-merchants', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    origins: [
      'https://yourstore.com',
      'https://www.yourstore.com'
    ],
    payoutAddress: '0x...YOUR_SMART_ACCOUNT_ADDRESS'
  })
});

const widget = await response.json();
console.log('Widget ID:', widget.merchantId); // achylo_a1b2c3d4
```

**Response:**

```json
{
  "id": 1,
  "merchantId": "achylo_a1b2c3d4",
  "creatorAddress": "0x...",
  "payoutAddress": "0x...",
  "origins": ["https://yourstore.com", "https://www.yourstore.com"],
  "active": true,
  "createdAt": "2025-06-19T00:00:00.000Z"
}
```

### Step 2 — List Your Widgets

```javascript
const response = await fetch('https://api.achylo.com/api/widget-merchants', {
  headers: { 'X-API-Key': 'YOUR_API_KEY' }
});

const data = await response.json();
console.log(data.merchants);
```

### Step 3 — Update Widget Origins

```javascript
await fetch('https://api.achylo.com/api/widget-merchants/achylo_a1b2c3d4', {
  method: 'PATCH',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    origins: ['https://yourstore.com', 'https://newdomain.com']
  })
});
```

### Step 4 — Deactivate Widget

```javascript
await fetch('https://api.achylo.com/api/widget-merchants/achylo_a1b2c3d4', {
  method: 'DELETE',
  headers: { 'X-API-Key': 'YOUR_API_KEY' }
});
```

### Step 5 — Create a Payment Link (Programmatic)

If you need to create payment links from your backend (instead of using the embed button):

```javascript
const response = await fetch('https://api.achylo.com/api/payment-links', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: '10000000',            // 10 USDC (in micro-units: 1 USDC = 1000000)
    receiver: '0x...YOUR_SMART_ACCOUNT',
    description: 'Order #1234',
    expiresInMinutes: 60,          // Optional: expires in 1 hour
    webhookUrl: 'https://yourserver.com/webhooks/achylo'  // Optional
  })
});

const link = await response.json();
console.log('Payment URL:', link.paymentUrl);
// → https://achylo.com/#/pay/be66da05-...
```

**Response:**

```json
{
  "paymentId": "be66da05-9590-437a-a557-f83c34de45d7",
  "paymentUrl": "https://achylo.com/#/pay/be66da05-...",
  "amount": "10000000",
  "receiver": "0x...",
  "description": "Order #1234",
  "status": "pending",
  "chainId": 8453,
  "createdAt": "2025-06-19T00:00:00.000Z",
  "expiresAt": "2025-06-19T01:00:00.000Z",
  "webhookUrl": "https://yourserver.com/webhooks/achylo",
  "webhookSecret": "auto_generated_hex_secret"
}
```

> 💡 **Amount format**: Use micro-units. `1 USDC = 1000000`. So `"29990000"` = 29.99 USDC.

### Step 6 — Check Payment Status

```javascript
const response = await fetch('https://api.achylo.com/api/payment-links/be66da05-...');
const link = await response.json();
console.log('Status:', link.status); // pending | paid | expired | cancelled
```

### Step 7 — List Payment History

```javascript
const response = await fetch('https://api.achylo.com/api/payment-links/history?limit=50', {
  headers: { 'X-API-Key': 'YOUR_API_KEY' }
});

const data = await response.json();
console.log(data.links); // Array of payment links with status, txHash, etc.
```

### Step 8 — Cancel a Payment Link

```javascript
await fetch('https://api.achylo.com/api/payment-links/be66da05-...', {
  method: 'DELETE',
  headers: { 'X-API-Key': 'YOUR_API_KEY' }
});
```

### API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/widget-merchants` | API Key | Create widget |
| `GET` | `/api/widget-merchants` | API Key | List your widgets |
| `GET` | `/api/widget-merchants/:id` | Public | Get widget info |
| `PATCH` | `/api/widget-merchants/:id` | API Key | Update origins |
| `DELETE` | `/api/widget-merchants/:id` | API Key | Deactivate widget |
| `POST` | `/api/payment-links` | API Key | Create payment link |
| `GET` | `/api/payment-links/:id` | Public | Get payment status |
| `GET` | `/api/payment-links/history` | API Key | List payment history |
| `DELETE` | `/api/payment-links/:id` | API Key | Cancel payment link |

> See [Payment Links API →](payment-links.md) for full documentation and code examples in Python, PHP, and TypeScript.

---

## Dynamic Cart

Use `amount-from` to automatically read the cart total from the page. The value is captured at click time — no additional JavaScript.

```html
<script async src="https://achylo.com/achylo.js?v=5"></script>

<!-- Replace #cartTotal with your total element's ID/selector -->
<achylo-button
  merchant-id="achylo_YOUR_WIDGET_ID"
  amount-from="#cartTotal"
  currency="USDC">
</achylo-button>
```

> 💡 **Not capturing the total?** Right-click the cart total → Inspect. The highlighted code will show `id="something"`. Use `#something` in `amount-from`.

### Manual control via JavaScript

If you need full programmatic control (e.g. the total is not visible on the page):

```html
<achylo-button
  id="checkout-btn"
  merchant-id="achylo_YOUR_WIDGET_ID"
  currency="USDC">
</achylo-button>

<script>
  // Updates the amount when the cart changes
  function updateCheckout(total) {
    document.getElementById('checkout-btn')
      .setAttribute('amount', total.toFixed(2));
  }

  // Redirect after payment
  document.getElementById('checkout-btn')
    .addEventListener('achylo:payment-success', (e) => {
      window.location.href = '/thank-you?tx=' + e.detail.txHash;
    });
</script>
```

---

## Multiple Products

Load the script once and add as many buttons as you need. Each works independently.

```html
<script async src="https://achylo.com/achylo.js?v=5"></script>

<!-- Product A -->
<achylo-button
  merchant-id="achylo_YOUR_WIDGET_ID"
  amount="19.99"
  currency="USDC"
  label="Buy Product A"
  description="Product A - Basic Plan">
</achylo-button>

<!-- Product B -->
<achylo-button
  merchant-id="achylo_YOUR_WIDGET_ID"
  amount="49.99"
  currency="USDC"
  label="Buy Product B"
  description="Product B - Pro Plan">
</achylo-button>

<!-- Donation (variable amount via amount-from) -->
<achylo-button
  merchant-id="achylo_YOUR_WIDGET_ID"
  amount-from="#donationInput"
  currency="USDC"
  label="Make Donation">
</achylo-button>
```

---

### Create button dynamically

```javascript
// Create element programmatically
const btn = document.createElement('achylo-button');
btn.setAttribute('merchant-id', 'achylo_cv80520f');
btn.setAttribute('amount', '100.00');
btn.setAttribute('currency', 'USDC');
btn.setAttribute('label', 'Pay $100.00');
btn.setAttribute('description', 'Annual subscription');
btn.setAttribute('color', '#10b981');

document.getElementById('container').appendChild(btn);
```

---

## Security: Allowed Domains

For security, the widget only works on authorized domains:

1. Go to **Profile → Payment Widgets**
2. Edit your widget
3. In **"Allowed Origins"**, add:
   - `https://yourstore.com`
   - `https://www.yourstore.com`
   - `https://checkout.yourstore.com`

> ⚠️ **Important**: Without the domain in the list, the widget will show an error. Use `*` only in development (never in production).

---

## Value Limits

| Limit | Value |
|-------|-------|
| Minimum | 1 USDC |
| Maximum | 100,000 USDC |
| Decimals | Up to 6 decimal places |

---

## Webhooks (Server Confirmation)

Receive notifications when the payment is confirmed on-chain.

### 1. Configure the webhook

When creating a payment link via API, include `webhookUrl` and optionally `webhookSecret`:

```javascript
const link = await fetch('https://api.achylo.com/api/payment-links', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: '10000000',
    receiver: '0x...YOUR_SMART_ACCOUNT',
    description: 'Order #1234',
    webhookUrl: 'https://yourserver.com/webhooks/achylo',
    webhookSecret: 'your_hex_secret_32_to_64_chars'  // Optional — auto-generated if omitted
  })
});
```

### 2. Verify the signature

Achylo uses a **Stripe-compatible** signing scheme with replay protection:

- **Signing string**: `${timestamp}.${jsonBody}`
- **Header**: `X-Achylo-Signature: sha256=<hex>`
- **Header**: `X-Achylo-Timestamp: <unix_seconds>`

```javascript
// Node.js / Express
import crypto from 'crypto';

app.post('/webhooks/achylo', express.json(), (req, res) => {
  const signature = req.headers['x-achylo-signature'];
  const timestamp = req.headers['x-achylo-timestamp'];
  const rawBody = JSON.stringify(req.body);

  // Replay protection: reject if older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return res.status(401).send('Timestamp expired');
  }

  // Verify HMAC-SHA256 signature
  const signingString = `${timestamp}.${rawBody}`;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.ACHYLO_WEBHOOK_SECRET)
    .update(signingString, 'utf8')
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return res.status(401).send('Invalid signature');
  }

  // Payment confirmed
  const { payment_link_id, amount_usdc, tx_hash, payer_address } = req.body.data;

  console.log(`Payment ${payment_link_id} confirmed: ${amount_usdc} USDC`);
  console.log(`TX: ${tx_hash}, Payer: ${payer_address}`);

  // Update your database
  await markOrderAsPaid(payment_link_id, tx_hash);

  res.status(200).send('OK');
});
```

### Webhook payload example

```json
{
  "id": "delivery-uuid",
  "event": "payment.completed",
  "created_at": "2025-06-19T00:00:00.000Z",
  "data": {
    "payment_link_id": "be66da05-9590-437a-a557-f83c34de45d7",
    "amount": "10000000",
    "amount_usdc": "10.000000",
    "receiver": "0x...",
    "description": "Order #1234",
    "chain_id": 8453,
    "tx_hash": "0x1234...abcd",
    "payer_address": "0xabc...",
    "block_number": 12345678,
    "paid_at": "2025-06-19T00:05:00.000Z"
  }
}
```

> ⚠️ **Webhooks require Redis** on the server. Delivery retries up to 5 times with exponential backoff.

See full documentation at [Webhooks →](webhooks.md)

---

## Examples by Framework

### React

```jsx
import { useEffect, useRef } from 'react';

export function PaymentButton({ amount, orderId, description }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const btn = document.createElement('achylo-button');
    btn.setAttribute('merchant-id', process.env.REACT_APP_ACHYLO_WIDGET_ID);
    btn.setAttribute('amount', amount);
    btn.setAttribute('currency', 'USDC');
    btn.setAttribute('label', '💳 Pay with Crypto');
    btn.setAttribute('description', description || `Payment for order ${orderId}`);

    btn.addEventListener('achylo:success', () => {
      markOrderAsPaid(orderId);
    });

    containerRef.current.appendChild(btn);

    return () => btn.remove();
  }, [amount, orderId, description]);

  return <div ref={containerRef} />;
}
```

### Vue

```vue
<template>
  <div ref="widgetContainer" />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({ amount: String, description: String });
const widgetContainer = ref(null);

onMounted(() => {
  const btn = document.createElement('achylo-button');
  btn.setAttribute('merchant-id', import.meta.env.VITE_ACHYLO_WIDGET_ID);
  btn.setAttribute('amount', props.amount);
  btn.setAttribute('currency', 'USDC');
  btn.setAttribute('description', props.description || 'Payment');

  btn.addEventListener('achylo:success', (e) => {
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

export function AchyloButton({ amount, description }: { amount: string; description?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const btn = document.createElement('achylo-button');
    btn.setAttribute('merchant-id', process.env.NEXT_PUBLIC_ACHYLO_WIDGET_ID!);
    btn.setAttribute('amount', amount);
    btn.setAttribute('currency', 'USDC');
    btn.setAttribute('description', description || 'Payment');

    ref.current.appendChild(btn);
    return () => btn.remove();
  }, [amount, description]);

  return <div ref={ref} />;
}
```

---

## Troubleshooting

### The button doesn't appear
- ✅ Check if the `achylo.js` script loaded (console F12)
- ✅ Confirm the `merchant-id` is correct

### "Domain not authorized"
- ✅ Add your domain to the widget whitelist
- ✅ Include `https://` (e.g. `https://yourstore.com`)

### The modal doesn't open
- ✅ Check popup blockers
- ✅ The click must be a direct user action (not via script)

---

## Quick Reference

```html
<achylo-button
  merchant-id="achylo_YOUR_ID"     <!-- ✅ Required -->
  amount="10.00"                    <!-- ✅ Required (or use amount-from) -->
  currency="USDC"                  <!-- ✅ Required -->
  amount-from="#cartTotal"         <!-- Optional: reads total from DOM -->
  label="💳 Pay"                   <!-- Optional -->
  description="Description"        <!-- Optional -->
  color="#ff7f41">                 <!-- Optional -->
</achylo-button>
```

### Events

| Event | `e.detail` | When it fires |
|-------|-----------|---------------|
| `achylo:payment-success` | `txHash, amount, token, chainId, paymentId` | Payment confirmed on-chain |
| `achylo:payment-error` | `error, paymentId` | Processing error |
| `achylo:payment-cancelled` | `paymentId` | User closed the modal |
| `achylo:opened` | `paymentId, mode, url` | Modal or tab opened |
| `achylo:ready` | — | Script loaded and ready |

> ℹ️ The events `achylo:success`, `achylo:error`, and `achylo:cancel` are still emitted for backward compatibility.

---

## Related Resources

- [Payment Links API →](payment-links.md) – Programmatic payment links
- [Webhooks →](webhooks.md) – Real-time notifications
- [API Keys →](api-keys.md) – Manage API keys
