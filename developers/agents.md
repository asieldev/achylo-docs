# Agents

Achylo has **two** permission layers for automation. They are independent:

1. **API Agents (off-chain)** — scopes on an agent bound to an API key. They limit which REST/MCP tools a key may call.
2. **On-chain Forwarder actions** — OperatorForwarder grants for the Settlement SA. They are the hard ceiling for money-moving writes.

Off-chain scopes never grant on-chain power. Forwarder grants never expand API/MCP tool access.

---

## Who this is for

- Merchants and integrators who already use **API Keys**
- Backends / MCP hosts that need least-privilege reads now and P2P writes later
- Teams automating the P2P public-order lifecycle via `/api/v1/automation`

If you only need payment links or widgets, you may still want an API Agent with `payment_links:read` — see [Payment Links](developers/payment-links.md) and [MCP](developers/mcp.md).

---

## How it works (simple)

1. In **User Profile → Developer / Agents**, create an **API Agent**, toggle scopes, optionally set max/daily USDC policy.
2. Connect a client either with a **bound API key** from that agent (`ACHYLO_API_KEY`), or via **OAuth 2.1 + PKCE** (MCP hosts open `/oauth/consent` and you pick the agent).
3. For on-chain writes: under **On-chain Forwarder actions**, enable actions and click **Activate** (wallet confirms once).
4. Your server or MCP host calls Achylo with that API Key or OAuth Bearer. Reads need matching scopes; writes also need live Forwarder perms.

**Legacy unbound keys** (created without an agent) keep full **read** access. Prefer bound keys or OAuth for MCP and new integrations.

---

## Prerequisites

1. An Achylo account (logged in with your wallet).
2. An **API Agent** + bound key, or a legacy unbound key ([API Keys](developers/api-keys.md)).
3. Payment methods already saved in your Achylo profile (needed to create or accept orders).
4. For creating public sell orders: merchant status / collateral as required by Achylo.

---

## Step 1 — Create an API Agent + bound key

1. Open **User Profile → Developer / Agents**
2. Under **API Agents (off-chain)**, create an agent, toggle scopes, save
3. Click **Create bound key**, copy it once, store as `ACHYLO_API_KEY`

### Scope catalog

**Reads (enforced now):**

| Scope | Purpose |
|-------|---------|
| `automation:config` | Automation / Forwarder config |
| `automation:permissions` | On-chain Forwarder permission reads |
| `automation:payment_methods` | List payment methods |
| `automation:operations` | Poll async operations |
| `payment_links:read` | Get / list payment links |
| `oracle:read` | PriceOracle reads |
| `fiat:read` | Active fiat currency catalog (`fiatCurrency` ids) |
| `wallet:balance` | USDC balance reads |
| `p2p:orders:read` | Public order list (subgraph) |

**Writes (enforced on REST + MCP):**  
`payment_links:write`, `p2p:create`, `p2p:accept`, `p2p:confirm`, `p2p:cancel`, `p2p:dispute`, `p2p:update`, `p2p:release`, `p2p:reclaim`

Unbound (legacy) API keys **cannot** call write scopes — bind the key to an agent. Amount-bearing writes also respect agent `policy.maxAmountUsdc` / `dailyCapUsdc` (`403 POLICY_DENIED`). On-chain Forwarder `maxAmount` remains a separate ceiling.

### Agents REST API

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/v1/agents` | JWT |
| `POST` | `/api/v1/agents` | JWT |
| `PATCH` | `/api/v1/agents/:id` | JWT |
| `DELETE` | `/api/v1/agents/:id` | JWT (soft revoke) |
| `POST` | `/api/v1/agents/:id/keys` | JWT (bound key) |
| `GET` | `/api/v1/agents/scopes` | JWT / API key |

Missing scope on an API-key or OAuth request → `403` with `error: "SCOPE_DENIED"`.

Set once:

```bash
export ACHYLO_JWT='eyJhbGciOiJIUzI1NiIs…'   # wallet session JWT from Achylo login
export ACHYLO_API_KEY='achylo_…'             # bound agent key (for scoped reads/writes)
export BASE='https://api.achylo.com'
```

#### `GET /api/v1/agents/scopes`

```bash
curl -sS "$BASE/api/v1/agents/scopes" \
  -H "Authorization: Bearer $ACHYLO_JWT"
# or
curl -sS "$BASE/api/v1/agents/scopes" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

#### `GET /api/v1/agents`

```bash
curl -sS "$BASE/api/v1/agents" \
  -H "Authorization: Bearer $ACHYLO_JWT"
```

#### `POST /api/v1/agents`

```bash
curl -sS -X POST "$BASE/api/v1/agents" \
  -H "Authorization: Bearer $ACHYLO_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trading bot",
    "description": "P2P automation",
    "smartAccountAddress": "0xYOUR_SMART_ACCOUNT",
    "scopes": [
      "automation:config",
      "automation:permissions",
      "automation:payment_methods",
      "automation:operations",
      "oracle:read",
      "fiat:read",
      "p2p:orders:read",
      "p2p:create",
      "p2p:accept",
      "p2p:confirm",
      "p2p:cancel",
      "p2p:dispute",
      "p2p:update",
      "p2p:release",
      "p2p:reclaim"
    ],
    "policy": { "maxAmountUsdc": "100", "dailyCapUsdc": "500" },
    "enabled": true
  }'
```

#### `PATCH /api/v1/agents/:id`

```bash
curl -sS -X PATCH "$BASE/api/v1/agents/AGENT_UUID" \
  -H "Authorization: Bearer $ACHYLO_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "scopes": ["oracle:read", "fiat:read", "p2p:orders:read", "p2p:create"],
    "policy": { "maxAmountUsdc": "50", "dailyCapUsdc": "200" },
    "enabled": true
  }'
```

#### `DELETE /api/v1/agents/:id`

Soft-revokes the agent and unbinds its keys.

```bash
curl -sS -X DELETE "$BASE/api/v1/agents/AGENT_UUID" \
  -H "Authorization: Bearer $ACHYLO_JWT"
```

#### `POST /api/v1/agents/:id/keys`

Creates a **bound** API key. The raw key is returned **once**.

```bash
curl -sS -X POST "$BASE/api/v1/agents/AGENT_UUID/keys" \
  -H "Authorization: Bearer $ACHYLO_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "name": "prod-bot" }'
```

### OAuth grants (MCP)

MCP hosts can use the Achylo Authorization Server instead of storing an API key:

1. Host registers (`POST /oauth/register`) and starts PKCE authorize
2. You approve on **`https://achylo.com/oauth/consent`**, selecting which **API Agent** to bind
3. Host receives an access token (`Authorization: Bearer …`) scoped to that agent

See [MCP → OAuth 2.1](mcp.md#oauth-21-mcp-hosts) for discovery endpoints and the full flow. REST automation writes accept the same OAuth Bearer (`authMethod=oauth`).

### Cached market / wallet reads

TTL ≈ **15 seconds** (Redis when available). Scope required per endpoint (or legacy unbound key).

#### `GET /api/v1/market/oracle/:currencyId` — scope `oracle:read`

```bash
curl -sS "$BASE/api/v1/market/oracle/0" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

#### `GET /api/v1/market/fiat-currencies` — scope `fiat:read`

```bash
curl -sS "$BASE/api/v1/market/fiat-currencies" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

Example response (≈60s Redis cache):

```json
{
  "registry": "0x7b024e8aeD5ADb762C40Ef31071fEbDef3E7b4B1",
  "count": 2,
  "currencies": [
    {
      "id": 0,
      "code": "CUP",
      "name": "Peso Cubano",
      "symbol": "$",
      "decimals": 2,
      "isActive": true,
      "createdAt": 1710000000
    }
  ],
  "cached": false
}
```

Use each item’s `id` as `fiatCurrency` when creating/updating public orders. Pair with [`GET /api/v1/automation/payment-methods`](#list-your-payment-methods) for `paymentMethodIds`.

#### `GET /api/v1/wallet/usdc-balance` — scope `wallet:balance`

```bash
curl -sS "$BASE/api/v1/wallet/usdc-balance?address=0xYOUR_SMART_ACCOUNT" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

#### `GET /api/v1/p2p/public-orders` — scope `p2p:orders:read`

```bash
curl -sS "$BASE/api/v1/p2p/public-orders?limit=20&offset=0" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

---

## Step 2 — Enable on-chain Forwarder actions

Same profile section, panel **On-chain Forwarder actions** (independent of off-chain scopes).

These are the **OperatorForwarder → P2PEscrow** selectors the Settlement SA may execute on your behalf:

| UI action | Escrow function | Selector | Automation scope | Notes |
|-----------|-----------------|----------|------------------|-------|
| **Create Public Order** | `createPublicOrder` | `0xb109086b` | `p2p:create` | Amount-bearing (`totalAmount`) |
| **Accept Public Order** | `acceptPublicOrder` | `0x3587f165` | `p2p:accept` | Set **max amount** (USDC) |
| **Confirm Payment** | `confirmPayment` | `0x3611d088` | `p2p:confirm` | Buyer marks paid |
| **Cancel Public Order** | `cancelPublicOrder` | `0x5db429ca` | `p2p:cancel` | Maker cancels open order |
| **Raise Dispute** | `raiseDispute` | `0xe14f5b7d` | `p2p:dispute` | Open dispute |
| **Update Public Order** | `updatePublicOrder` | `0x27e9301b` | `p2p:update` | Edit live public order params |
| **Release Funds** | `releaseFunds` | `0xc92ee043` | `p2p:release` | Seller releases escrow to buyer |
| **Reclaim Funds** | `reclaimFunds` | `0xd034fd44` | `p2p:reclaim` | Reclaim after timeout / rules |

Live selector map also comes from `GET /api/v1/automation/config` → `selectors`.

For each action you can set:

- On / off
- Duration: **7 or 30 days**
- Max number of uses
- Max amount in USDC (for amount-bearing actions such as Accept / Create / Update)

Click **Activate** so Achylo saves those permissions on-chain.

Also available:

- **Reload** — refresh status
- **Revoke** (one action) or **Revoke all**

> Activate / Reload **replace** the previous settings for those actions; they do not add extra uses on top.

**Also required for Sell / fund flows:** Escrow USDC `approve` (ERC-20 allowance) is **separate** from Forwarder grants. Approve the current Escrow in the profile panel after cutover.

On-chain Forwarder permissions belong to **your Achylo Smart Account**, not to each API Key separately. Several keys on the same account share the same Forwarder grants.

---

## Step 3 — Call the Automation API

**Base URL (production):** `https://api.achylo.com`  
**Path prefix:** `/api/v1/automation`  
**Auth:** `X-API-Key` (or OAuth Bearer)  
**Every write must include:** `Idempotency-Key: <unique-string>` (max 128 characters)

Agent write operations are **asynchronous**. A successful write returns HTTP `202`
with an operation ID. Poll that operation until its status is terminal:

- `queued` — accepted and waiting for the serialized blockchain executor
- `pending` — simulated and being submitted/confirmed on Base
- `success` — confirmed; `transactionHash` is available
- `failed` — failed before broadcast and may be retried with the same idempotency key
- `unknown` — a UserOperation was broadcast but final status could not be confirmed; do not retry automatically

The same `Idempotency-Key` may be retried only with exactly the same operation
parameters. Reusing it for different parameters returns
`IDEMPOTENCY_KEY_REUSED`.

### Check configuration — `GET /api/v1/automation/config`

Scope: `automation:config`.

```bash
curl -sS "$BASE/api/v1/automation/config" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

### Check Forwarder permissions — `GET /api/v1/automation/permissions`

Scope: `automation:permissions`.

```bash
curl -sS "$BASE/api/v1/automation/permissions" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

### List your payment methods — `GET /api/v1/automation/payment-methods`

Scope: `automation:payment_methods`. Use this to discover the IDs you pass when creating or accepting orders.

```bash
curl -sS "$BASE/api/v1/automation/payment-methods?active=true" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

Optional query:

- `active=true` (default) — only methods you can use in orders  
- `active=false` — include inactive methods too  
- `user=0x…` — wallet address to query (defaults to the one bound on the API Key)

Example response:

```json
{
  "user": "0xYOUR_WALLET_ADDRESS",
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

### Create a public order — `POST /api/v1/automation/orders`

Scope: `p2p:create` + Forwarder `createPublicOrder`.

```bash
curl -sS -X POST "$BASE/api/v1/automation/orders" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: create-order-001" \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "Sell",
    "fiatCurrency": 0,
    "exchangeRate": "1000000",
    "minAmount": "1000000",
    "maxAmount": "100000000",
    "totalAmount": "50000000",
    "customReclaimTimeout": 0,
    "merchantOnly": false,
    "paymentMethodIds": [
      "0xYOUR_SAVED_PAYMENT_METHOD_ID"
    ]
  }'
```

Amounts are in **micro-USDC** (1 USDC = `1000000`).  
`orderType`: `"Buy"` / `"Sell"` (or `0` / `1`).

#### About `paymentMethodIds`

These are the IDs of **payment methods you already registered** in Achylo (Profile → payment methods) — the same ones you pick when creating an order in the app.

- They are **not** invented by your server.
- You must send those IDs (1 to 5). Achylo does **not** invent methods for you at create time.

**How to get the IDs:** call [`GET /api/v1/automation/payment-methods`](#list-your-payment-methods) and use each item’s `id`.

### Accept a public order — `POST /api/v1/automation/orders/:orderId/accept`

Scope: `p2p:accept` + Forwarder `acceptPublicOrder`.

```bash
curl -sS -X POST "$BASE/api/v1/automation/orders/0xORDER_ID/accept" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: accept-001" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "10000000",
    "takerPaymentMethodId": "0xYOUR_SAVED_PAYMENT_METHOD_ID"
  }'
```

`takerPaymentMethodId` is again one of **your** saved payment methods (the taker’s method that matches the order).

### Confirm payment — `POST /api/v1/automation/orders/:orderId/confirm-payment`

Scope: `p2p:confirm` + Forwarder `confirmPayment`.

```bash
curl -sS -X POST "$BASE/api/v1/automation/orders/0xORDER_ID/confirm-payment" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: confirm-001" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Cancel public order — `POST /api/v1/automation/orders/:orderId/cancel`

Scope: `p2p:cancel` + Forwarder `cancelPublicOrder`.

```bash
curl -sS -X POST "$BASE/api/v1/automation/orders/0xORDER_ID/cancel" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: cancel-001" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Raise dispute — `POST /api/v1/automation/orders/:orderId/dispute`

Scope: `p2p:dispute` + Forwarder `raiseDispute`.

```bash
curl -sS -X POST "$BASE/api/v1/automation/orders/0xORDER_ID/dispute" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: dispute-001" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Update public order — `PATCH /api/v1/automation/orders/:orderId`

Scope: `p2p:update` + Forwarder `updatePublicOrder`. Body uses the same shape as create.

```bash
curl -sS -X PATCH "$BASE/api/v1/automation/orders/0xORDER_ID" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: update-001" \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "Sell",
    "fiatCurrency": 0,
    "exchangeRate": "1100000",
    "minAmount": "1000000",
    "maxAmount": "80000000",
    "totalAmount": "40000000",
    "customReclaimTimeout": 0,
    "merchantOnly": false,
    "paymentMethodIds": [
      "0xYOUR_SAVED_PAYMENT_METHOD_ID"
    ]
  }'
```

### Release escrow funds — `POST /api/v1/automation/escrows/:orderId/release`

Scope: `p2p:release` + Forwarder `releaseFunds`. Seller releases locked USDC to the buyer after payment is confirmed.

```bash
curl -sS -X POST "$BASE/api/v1/automation/escrows/0xORDER_ID/release" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: release-001" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Reclaim escrow funds — `POST /api/v1/automation/escrows/:orderId/reclaim`

Scope: `p2p:reclaim` + Forwarder `reclaimFunds`. Reclaim after reclaim timeout / escrow rules allow it.

```bash
curl -sS -X POST "$BASE/api/v1/automation/escrows/0xORDER_ID/reclaim" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: reclaim-001" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Check an operation — `GET /api/v1/automation/operations/:id`

Scope: `automation:operations`.

```bash
curl -sS "$BASE/api/v1/automation/operations/OPERATION_UUID" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

Example accepted response from any write endpoint:

```json
{
  "id": "8df7828c-8fb1-4f0e-aacf-763519ad0c80",
  "status": "queued",
  "action": "acceptPublicOrder",
  "smartAccount": "0x...",
  "userOpHash": null,
  "transactionHash": null
}
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
  const operation = await res.json();

  for (;;) {
    const statusRes = await fetch(
      `${BASE}/api/v1/automation/operations/${operation.id}`,
      { headers: { 'X-API-Key': ACHYLO_API_KEY } },
    );
    if (!statusRes.ok) throw new Error(await statusRes.text());
    const status = await statusRes.json();
    if (['success', 'failed', 'unknown'].includes(status.status)) return status;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
```

---

## Suggested defaults for new users

| Action | Duration | Max uses | Max amount |
|--------|----------|----------|------------|
| Accept Public Order | 7 days | 10 | Set a real USDC cap |
| Confirm Payment | 30 days | 10 | — |
| Raise Dispute | 7 days | 1–3 | — |
| Create / Cancel / Update | 30 days | as needed | Cap create/update totals |
| Release Funds | 30 days | 10–50 | — |
| Reclaim Funds | 30 days | as needed | — |

Start small. You can Activate again anytime to refresh permissions.

---

## Security checklist

- Keep API keys in environment variables / a secrets manager — never in git
- Prefer a limited USDC spending approval for Achylo trading (avoid unlimited if you can)
- Use a unique `Idempotency-Key` for every logical operation
- Revoke bot permissions when you no longer need automation
- If a key is leaked → revoke the key **and** use **Revoke all** on Agents

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `SCOPE_DENIED` | Bound agent lacks the required scope — or unbound key tried a write |
| `POLICY_DENIED` | Amount exceeds agent `maxAmountUsdc` / `dailyCapUsdc` |
| Error about missing account binding | Create a new API Key while logged into Achylo with your wallet |
| Permission expired / no uses left | Open On-chain Forwarder actions and Activate again |
| Amount too high | Accept amount is above the max you set |
| Invalid payment method | Call `GET /api/v1/automation/payment-methods` and use an active `id` |
| Operator not configured (UI) | Temporary config issue — try Reload later or contact support |

---

## Related

- [API Keys](developers/api-keys.md)
- [MCP](developers/mcp.md) — read tools + scope enforcement
- [Quickstart](developers/quickstart.md)
- [Public Order (P2P)](../p2p/orden-publica.md)
- [Webhooks](developers/webhooks.md)
