# Bots / Automation

Bots let your backend create, accept, confirm, cancel, and dispute **P2P public orders** through the Achylo API — without signing every action from your wallet in the UI.

Under the hood, you grant limited on-chain permissions to Achylo’s settlement bot (`OperatorForwarder`). Your API Key then triggers those actions; Achylo submits a sponsored UserOperation on your behalf.

---

## Who this is for

- Merchants and integrators who already use **API Keys**
- Backends that need to automate P2P order lifecycle (not just payment links)

If you only need payment links or widgets, you do **not** need Bots — see [Payment Links](developers/payment-links.md).

---

## How it works

```
Your app                         Achylo                         Base
────────────────────────────────────────────────────────────────────
1. Create API Key            →   Key bound to your Smart Account
2. Profile → Bots / Automation → You Approve setPermissions (UserOp)
3. POST /api/v1/automation/… →   Settlement SA → OperatorForwarder.execute
4.                           →   P2PEscrow runs as YOU (ERC-2771)
```

Important:

| Piece | Role |
|-------|------|
| **API Key** | Authenticates your HTTP calls (`X-API-Key`) |
| **Smart Account** | On-chain identity that owns the permissions |
| **Bot permissions** | On-chain allowlist (actions, duration, max uses, max amount) |
| **Settlement SA** | Achylo operator that calls `execute` (you never share its keys) |

Permissions are **per Smart Account**, not per API Key. If several keys are bound to the same Smart Account, they share the same bot permissions.

---

## Prerequisites

1. An Achylo account with a **Coinbase Smart Wallet** (Smart Account).
2. At least one **API Key** ([API Keys](developers/api-keys.md)).
3. Enough **USDC allowance** on `P2PEscrow` for actions that move funds (approve the escrow contract — **never** the OperatorForwarder).
4. For merchants creating public sell orders: merchant mode / collateral as required by the protocol.

---

## Step 1 — Create an API Key

1. Open **User Profile → Developer API Keys**
2. Create a key (label e.g. `"Production"`)
3. Copy it once and store it as `ACHYLO_API_KEY`

New keys are automatically bound to your current Smart Account when created from the dashboard. That binding is required for automation.

---

## Step 2 — Enable Bots / Automation in the dashboard

After you have at least one API Key, the same accordion shows **Bots / Automation**.

For each action you can:

| Action | What it allows |
|--------|----------------|
| **Create Public Order** | Create a public P2P order |
| **Accept Public Order** | Take / accept a public order (supports **max amount**) |
| **Confirm Payment** | Mark an escrow as paid (buyer) |
| **Cancel Public Order** | Cancel your own public order |
| **Raise Dispute** | Open a dispute on an escrow |

Per action:

- Toggle **on/off**
- **Duration:** 7 or 30 days (hard max 30 days on-chain)
- **Max uses**
- **Max amount** (USDC) — required for Accept Public Order

Then click **Activate**. Your wallet sends **one** UserOperation (`setPermissions`) via the Coinbase paymaster.

Also available:

- **Reload** — refresh on-chain status
- **Revoke** (per action) — clears that permission
- **Revoke all** — invalidates every permission for the Achylo operator

> Reload / Activate **overwrite** previous values for the selected actions; they do not stack uses.

---

## Step 3 — Call the Automation API

**Base path:** `/api/v1/automation`  
**Auth:** `X-API-Key` (required for execute endpoints)  
**Required header on every POST:** `Idempotency-Key: <unique-string>` (max 128 chars)

### Config (public)

```http
GET /api/v1/automation/config
```

Returns operator Smart Account, forwarder address, selectors, and feature flags.

### Permissions (on-chain status)

```http
GET /api/v1/automation/permissions
X-API-Key: achylo_...
```

### Create public order

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
    "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  ]
}
```

Amounts are in **micro-USDC** (1 USDC = `1000000`). `orderType` may be `"Buy"` / `"Sell"` or `0` / `1`.

### Accept public order

```http
POST /api/v1/automation/orders/:orderId/accept
X-API-Key: achylo_...
Idempotency-Key: accept-001
Content-Type: application/json
```

```json
{
  "amount": "10000000",
  "takerPaymentMethodId": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
}
```

### Confirm payment / cancel / dispute

```http
POST /api/v1/automation/orders/:orderId/confirm-payment
POST /api/v1/automation/orders/:orderId/cancel
POST /api/v1/automation/orders/:orderId/dispute
```

Same headers (`X-API-Key` + `Idempotency-Key`). Body can be empty `{}`.

### Operation status

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

## Defaults (recommended for new users)

| Action | Duration | Max uses | Max amount |
|--------|----------|----------|------------|
| Accept Public Order | 7 days | 10 | Set a real USDC cap |
| Confirm Payment | 30 days | 10 | — |
| Raise Dispute | 7 days | 1–3 | — |
| Create / Cancel | 30 days | as needed | — |

Start with short expiries and low use counts. You can Activate again anytime to refresh permissions.

---

## Security checklist

- Store API keys in a secrets manager — never in git
- Prefer **limited** USDC `approve` on **P2PEscrow**, not infinite allowance
- Never approve USDC to the OperatorForwarder
- Use a unique `Idempotency-Key` per logical operation
- Revoke permissions when a bot is no longer needed
- Compromised API key → revoke the key **and** Revoke all bot permissions

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `SMART_ACCOUNT_REQUIRED` | API key has no Smart Account binding — create a new key from the dashboard while logged in with your wallet |
| `PERMISSION_EXPIRED` / `NO_USES_LEFT` | Re-open Bots / Automation and Activate again |
| `AMOUNT_TOO_HIGH` | Accept amount exceeds the max you set on-chain |
| `FORWARDER_MISMATCH` | Achylo config out of sync — contact support / wait for cutover |
| Operator address not configured (UI) | Frontend missing operator config; wait for `/api/v1/automation/config` or ask support |
| Tx succeeds in UI but API fails | Wrong API key (different account) or permission not enabled for that action |

---

## Related

- [API Keys](developers/api-keys.md)
- [Quickstart](developers/quickstart.md)
- [Public Order (P2P)](../p2p/orden-publica.md)
- [Webhooks](developers/webhooks.md)
