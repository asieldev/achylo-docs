# Bots / Automation

Bots let your **backend** create, accept, confirm, cancel, and dispute **P2P public orders** through the Achylo API — without opening the Achylo UI for every step.

You approve what the bot is allowed to do (and for how long) once in your profile. After that, your server calls Achylo with your API Key.

---

## Who this is for

- Merchants and integrators who already use **API Keys**
- Backends that need to automate the P2P public-order lifecycle

If you only need payment links or widgets, you do **not** need Bots — see [Payment Links](developers/payment-links.md).

---

## How it works (simple)

1. You create an **API Key** in Achylo.
2. In **Bots / Automation**, you turn on the actions you want and click **Activate** (your wallet confirms once).
3. Your server calls `/api/v1/automation/...` with that API Key.
4. Achylo runs the action on Base **as your account**, within the limits you approved.

Permissions belong to **your Achylo wallet account**, not to each API Key separately. Several keys on the same account share the same bot permissions.

---

## Prerequisites

1. An Achylo account (logged in with your wallet).
2. At least one **API Key** ([API Keys](developers/api-keys.md)).
3. Payment methods already saved in your Achylo profile (needed to create or accept orders).
4. For creating public sell orders: merchant status / collateral as required by Achylo.

---

## Step 1 — Create an API Key

1. Open **User Profile → Developer API Keys**
2. Create a key (label e.g. `"Production"`)
3. Copy it once and store it as `ACHYLO_API_KEY`

---

## Step 2 — Enable Bots / Automation

After you have at least one API Key, the same section shows **Bots / Automation**.

| Action | What it allows |
|--------|----------------|
| **Create Public Order** | Create a public P2P order |
| **Accept Public Order** | Accept a public order (you can set a **max amount**) |
| **Confirm Payment** | Mark an order as paid (buyer side) |
| **Cancel Public Order** | Cancel your own public order |
| **Raise Dispute** | Open a dispute |

For each action you can set:

- On / off
- Duration: **7 or 30 days**
- Max number of uses
- Max amount in USDC (for Accept Public Order)

Click **Activate** so Achylo saves those permissions.

Also available:

- **Reload** — refresh status
- **Revoke** (one action) or **Revoke all**

> Activate / Reload **replace** the previous settings for those actions; they do not add extra uses on top.

---

## Step 3 — Call the Automation API

**Base path:** `/api/v1/automation`  
**Auth:** `X-API-Key`  
**Every POST must include:** `Idempotency-Key: <unique-string>` (max 128 characters)

### Check configuration

```http
GET /api/v1/automation/config
```

### Check your bot permissions

```http
GET /api/v1/automation/permissions
X-API-Key: achylo_...
```

### List your payment methods

Use this to discover the IDs (and descriptions) you pass when creating or accepting orders.

```http
GET /api/v1/automation/payment-methods
X-API-Key: achylo_...
```

Optional query:

- `active=true` (default) — only methods you can use in orders  
- `active=false` — include inactive methods too  
- `user=0x…` — Smart Account to query (defaults to the one bound on the API Key)

Example response:

```json
{
  "user": "0xYOUR_SMART_ACCOUNT",
  "activeOnly": true,
  "count": 1,
  "paymentMethods": [
    {
      "id": "0xYOUR_SAVED_PAYMENT_METHOD_ID",
      "methodId": "0xGLOBAL_TYPE_ID",
      "name": "bank_transfer",
      "displayName": "Bank Transfer",
      "description": "**** 1234",
      "displayInfo": "**** 1234",
      "accountInfo": "Account holder / number…",
      "paymentDetails": "Extra notes…",
      "isActive": true,
      "isVerified": true,
      "addedAt": 1710000000
    }
  ]
}
```

Use each item’s `id` as `paymentMethodIds[]` / `takerPaymentMethodId`.  
`description` is the short label (usually the same as `displayInfo`).

### Create a public order

```http
POST /api/v1/automation/orders
X-API-Key: achylo_...
Idempotency-Key: create-order-001
Content-Type: application/json
```

```json
{
  "orderType": "Sell",
  "fiatCurrency": 1,
  "exchangeRate": "1000000",
  "minAmount": "1000000",
  "maxAmount": "100000000",
  "totalAmount": "50000000",
  "customReclaimTimeout": 0,
  "merchantOnly": false,
  "paymentMethodIds": [
    "0xYOUR_SAVED_PAYMENT_METHOD_ID"
  ]
}
```

Amounts are in **micro-USDC** (1 USDC = `1000000`).  
`orderType`: `"Buy"` / `"Sell"` (or `0` / `1`).

#### About `paymentMethodIds`

These are the IDs of **payment methods you already registered** in Achylo (Profile → payment methods) — the same ones you pick when creating an order in the app.

- They are **not** invented by your server.
- The example value `0xaaa…` in older snippets was only a placeholder.
- You must send those IDs (1 to 5). Achylo does **not** invent methods for you at create time.

**How to get the IDs:** call [`GET /api/v1/automation/payment-methods`](#list-your-payment-methods) and use each item’s `id` (and `description` / `displayName` to pick the right one). You can also copy them from your Achylo profile.

### Accept a public order

```http
POST /api/v1/automation/orders/:orderId/accept
X-API-Key: achylo_...
Idempotency-Key: accept-001
Content-Type: application/json
```

```json
{
  "amount": "10000000",
  "takerPaymentMethodId": "0xYOUR_SAVED_PAYMENT_METHOD_ID"
}
```

`takerPaymentMethodId` is again one of **your** saved payment methods (the taker’s method that matches the order).

### Confirm payment / cancel / dispute

```http
POST /api/v1/automation/orders/:orderId/confirm-payment
POST /api/v1/automation/orders/:orderId/cancel
POST /api/v1/automation/orders/:orderId/dispute
```

Same headers (`X-API-Key` + `Idempotency-Key`). Body may be `{}`.

### Check an operation

```http
GET /api/v1/automation/operations/:id
X-API-Key: achylo_...
```

---

## Example (Node.js)

```typescript
const ACHYLO_API_KEY = process.env.ACHYLO_API_KEY!;
const BASE = 'https://api.achylo.com';

async function acceptOrder(orderId: string, amount: string, takerPaymentMethodId: string) {
  const res = await fetch(`${BASE}/api/v1/automation/orders/${orderId}/accept`, {
    method: 'POST',
    headers: {
      'X-API-Key': ACHYLO_API_KEY,
      'Idempotency-Key': `accept-${orderId}-${amount}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, takerPaymentMethodId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## Suggested defaults for new users

| Action | Duration | Max uses | Max amount |
|--------|----------|----------|------------|
| Accept Public Order | 7 days | 10 | Set a real USDC cap |
| Confirm Payment | 30 days | 10 | — |
| Raise Dispute | 7 days | 1–3 | — |
| Create / Cancel | 30 days | as needed | — |

Start small. You can Activate again anytime to refresh permissions.

---

## Security checklist

- Keep API keys in environment variables / a secrets manager — never in git
- Prefer a limited USDC spending approval for Achylo trading (avoid unlimited if you can)
- Use a unique `Idempotency-Key` for every logical operation
- Revoke bot permissions when you no longer need automation
- If a key is leaked → revoke the key **and** use **Revoke all** on Bots / Automation

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Error about missing account binding | Create a new API Key while logged into Achylo with your wallet |
| Permission expired / no uses left | Open Bots / Automation and Activate again |
| Amount too high | Accept amount is above the max you set |
| Invalid payment method | Call `GET /api/v1/automation/payment-methods` and use an active `id` |
| Operator not configured (UI) | Temporary config issue — try Reload later or contact support |

---

## Related

- [API Keys](developers/api-keys.md)
- [Quickstart](developers/quickstart.md)
- [Public Order (P2P)](../p2p/orden-publica.md)
- [Webhooks](developers/webhooks.md)
