# Achylo MCP (Agentic Payments)

**Achylo MCP** is the remote Model Context Protocol server for Achylo. It exposes **read and write** tools that call the Achylo API. It does not hold CDP signing keys; P2P writes still need on-chain OperatorForwarder grants.

> **Summary:** Connect an MCP host to `https://api.achylo.com/mcp` with an **API Key bound to an API Agent** (created in the Achylo dashboard), or via **OAuth 2.1 + PKCE**. Least-privilege scopes gate every tool. Writes also need Forwarder perms (and optional policy caps). Poll `get_operation` after async P2P tools.

The same scopes / Forwarder grants also power the **Automation REST** API (`/api/v1/automation`) if you call Achylo from your own backend instead of an MCP host.

---

## Who this is for

- Teams wiring assistants (Cursor, Claude, etc.) to Achylo payments and P2P
- Integrators already using [API Keys](/developers/api-keys) and [Payment Links](/developers/payment-links)

---

## Setup in the Achylo dashboard

Agent configuration is **UI-only** (wallet session). You do not call an Agents REST API from your app.

### 1 — API Agent + bound key

1. Open [achylo.com](https://achylo.com) → **User Profile → Developer / Agents**
2. Under **API Agents (off-chain)**, create an agent, toggle scopes, optionally set `maxAmountUsdc` / `dailyCapUsdc`
3. **Create bound key**, copy once → `ACHYLO_API_KEY`

**Legacy unbound keys** keep full **read** access but **cannot write**. Prefer a bound key for MCP.

#### Scope catalog

**Reads:**

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

**Writes:**  
`payment_links:write`, `p2p:create`, `p2p:accept`, `p2p:confirm`, `p2p:cancel`, `p2p:dispute`, `p2p:update`, `p2p:release`, `p2p:reclaim`

Missing scope → `403` `SCOPE_DENIED`. Amount-bearing writes also respect agent policy (`403 POLICY_DENIED`). On-chain Forwarder `maxAmount` is a separate ceiling.

### 2 — Enable on-chain Forwarder actions

Same profile section, panel **On-chain Forwarder actions** (independent of off-chain scopes).

These are the **OperatorForwarder → P2PEscrow** selectors the Settlement SA may execute on your behalf:

| UI action | Escrow function | Selector | Scope | Notes |
|-----------|-----------------|----------|-------|-------|
| **Create Public Order** | `createPublicOrder` | `0xb109086b` | `p2p:create` | Amount-bearing (`totalAmount`) |
| **Accept Public Order** | `acceptPublicOrder` | `0x3587f165` | `p2p:accept` | Set a **max amount** (USDC) |
| **Confirm Payment** | `confirmPayment` | `0x3611d088` | `p2p:confirm` | Buyer marks paid |
| **Cancel Public Order** | `cancelPublicOrder` | `0x5db429ca` | `p2p:cancel` | Maker cancels open order |
| **Raise Dispute** | `raiseDispute` | `0xe14f5b7d` | `p2p:dispute` | Open dispute |
| **Update Public Order** | `updatePublicOrder` | `0x27e9301b` | `p2p:update` | Edit live public order params |
| **Release Funds** | `releaseFunds` | `0xc92ee043` | `p2p:release` | Seller releases escrow to buyer |
| **Reclaim Funds** | `reclaimFunds` | `0xd034fd44` | `p2p:reclaim` | Reclaim after timeout / rules |

Live selector map: `GET /api/v1/automation/config` → `selectors`.

For each action you can set on / off, duration (**7 or 30 days**), max uses, and max amount (for amount-bearing actions). Click **Activate** to save on-chain.

- **Reload** — refresh status  
- **Revoke** (one action) or **Revoke all**

> Activate / Reload **replace** previous settings for those actions; they do not stack uses.

**Escrow USDC `approve`** (ERC-20 allowance) is **separate** from Forwarder grants. Approve the current Escrow in the profile panel for Sell / fund flows.

Forwarder grants belong to your **Smart Account**, not to each API key. Several keys on the same account share them.

#### Suggested defaults

| Action | Duration | Max uses | Max amount |
|--------|----------|----------|------------|
| Accept Public Order | 7 days | 10 | Set a real USDC cap |
| Confirm Payment | 30 days | 10 | — |
| Raise Dispute | 7 days | 1–3 | — |
| Create / Cancel / Update | 30 days | as needed | Cap create/update totals |
| Release Funds | 30 days | 10–50 | — |
| Reclaim Funds | 30 days | as needed | — |

---

## Dual permission model

1. **Off-chain scopes** on the API Agent bound to the key (MCP + REST).
2. **On-chain Forwarder** grants for P2P money ops (wallet Activate in profile).

Off-chain scopes never grant on-chain power. Forwarder grants never expand MCP tool access.

---

## MCP endpoint

| Environment | URL |
| :--- | :--- |
| Production | `https://api.achylo.com/mcp` |
| Local / compose | `http://127.0.0.1:8081/mcp` |

Transport: **Streamable HTTP** (stateless).

```http
X-API-Key: achylo_your_key_here
```

Also accepted:

- `Authorization: Bearer achylo_…` (API key)
- `Authorization: Bearer <oauth_access_token>` (OAuth AT)

Unauthenticated MCP requests return `401` with `WWW-Authenticate` pointing at protected-resource metadata (RFC 9728).

### Example host config

**API key:**

```json
{
  "mcpServers": {
    "achylo": {
      "url": "https://api.achylo.com/mcp",
      "headers": {
        "X-API-Key": "achylo_your_key_here"
      }
    }
  }
}
```

**OAuth:** point the host at `https://api.achylo.com/mcp` and complete browser consent when prompted (no static key).

---

## OAuth 2.1 (MCP hosts)

Prefer OAuth when the host should not store a long-lived API key.

| Discovery | URL |
| :--- | :--- |
| Authorization Server metadata | `GET https://api.achylo.com/.well-known/oauth-authorization-server` |
| Protected resource (MCP) | `GET https://api.achylo.com/.well-known/oauth-protected-resource` |

Flow:

1. **DCR** — `POST /oauth/register` with `redirect_uris` → `client_id` (public client)
2. **Authorize** — `GET /oauth/authorize?…&code_challenge=…&code_challenge_method=S256` → Achylo **`/oauth/consent`**
3. **Consent** — sign in, pick an **API Agent**, approve overlapping scopes → `code`
4. **Token** — `POST /oauth/token` → short-lived AT + refresh token
5. **MCP** — `Authorization: Bearer <access_token>`

Scopes on the grant are **request ∩ agent scopes**. Disabled agent / revoked grant → `401`.

---

## Read tools

| Tool | Scope | Backed by |
| :--- | :--- | :--- |
| `get_automation_config` | `automation:config` | `GET /api/v1/automation/config` |
| `get_agent_permissions` | `automation:permissions` | `GET /api/v1/automation/permissions` |
| `list_payment_methods` | `automation:payment_methods` | `GET /api/v1/automation/payment-methods` |
| `get_operation` | `automation:operations` | `GET /api/v1/automation/operations/:id` |
| `get_payment_link` / `list_payment_links` | `payment_links:read` | payment-links API |
| `get_oracle_price` | `oracle:read` | `GET /api/v1/market/oracle/:currencyId` |
| `list_fiat_currencies` | `fiat:read` | `GET /api/v1/market/fiat-currencies` |
| `get_usdc_balance` | `wallet:balance` | `GET /api/v1/wallet/usdc-balance` |
| `list_public_orders` | `p2p:orders:read` | `GET /api/v1/p2p/public-orders` |

Annotated `readOnlyHint=true`.

---

## Write tools

| Tool | Scope | Backed by | Notes |
| :--- | :--- | :--- | :--- |
| `create_payment_link` | `payment_links:write` | `POST /api/payment-links` | Sync `201` |
| `cancel_payment_link` | `payment_links:write` | `DELETE /api/payment-links/:id` | Sync |
| `create_public_order` | `p2p:create` | `POST /api/v1/automation/orders` | Async `202` |
| `accept_public_order` | `p2p:accept` | `POST .../accept` | Async |
| `confirm_payment` | `p2p:confirm` | `POST .../confirm-payment` | Async |
| `cancel_public_order` | `p2p:cancel` | `POST .../cancel` | Async |
| `raise_dispute` | `p2p:dispute` | `POST .../dispute` | Async |
| `update_public_order` | `p2p:update` | `PATCH .../orders/:id` | Async |
| `release_escrow` | `p2p:release` | `POST .../escrows/:id/release` | Async |
| `reclaim_escrow` | `p2p:reclaim` | `POST .../escrows/:id/reclaim` | Async |

Async tools accept optional `idempotencyKey` (auto-generated if omitted) and return an operation id — poll with `get_operation` until `success` / `failed` / `unknown`.

Annotated `readOnlyHint=false`.

---

## Automation REST (same scopes / Forwarder)

Use when calling Achylo from your server without MCP. Base: `https://api.achylo.com`. Auth: `X-API-Key` or OAuth Bearer. Writes need `Idempotency-Key` (max 128) and return `202` — poll `/api/v1/automation/operations/:id`.

```bash
export BASE='https://api.achylo.com'
export ACHYLO_API_KEY='achylo_…'
```

### Reads

```bash
curl -sS "$BASE/api/v1/automation/config" \
  -H "X-API-Key: $ACHYLO_API_KEY"

curl -sS "$BASE/api/v1/automation/permissions" \
  -H "X-API-Key: $ACHYLO_API_KEY"

curl -sS "$BASE/api/v1/automation/payment-methods?active=true" \
  -H "X-API-Key: $ACHYLO_API_KEY"

curl -sS "$BASE/api/v1/market/oracle/0" \
  -H "X-API-Key: $ACHYLO_API_KEY"

curl -sS "$BASE/api/v1/market/fiat-currencies" \
  -H "X-API-Key: $ACHYLO_API_KEY"

curl -sS "$BASE/api/v1/wallet/usdc-balance?address=0xYOUR_SMART_ACCOUNT" \
  -H "X-API-Key: $ACHYLO_API_KEY"

curl -sS "$BASE/api/v1/p2p/public-orders?limit=20&offset=0" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

Use fiat `id` as `fiatCurrency`. Use each payment method’s `id` as `paymentMethodIds[]` / `takerPaymentMethodId` (methods you already saved in Achylo — not invented by your server).

### Create public order — `p2p:create`

Amounts in **micro-USDC** (1 USDC = `1000000`). `orderType`: `"Buy"` / `"Sell"`.

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
    "paymentMethodIds": ["0xYOUR_SAVED_PAYMENT_METHOD_ID"]
  }'
```

### Accept — `p2p:accept`

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

### Confirm / cancel / dispute

```bash
curl -sS -X POST "$BASE/api/v1/automation/orders/0xORDER_ID/confirm-payment" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: confirm-001" \
  -H "Content-Type: application/json" \
  -d '{}'

curl -sS -X POST "$BASE/api/v1/automation/orders/0xORDER_ID/cancel" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: cancel-001" \
  -H "Content-Type: application/json" \
  -d '{}'

curl -sS -X POST "$BASE/api/v1/automation/orders/0xORDER_ID/dispute" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: dispute-001" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Update public order — `p2p:update`

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
    "paymentMethodIds": ["0xYOUR_SAVED_PAYMENT_METHOD_ID"]
  }'
```

### Release / reclaim escrow — `p2p:release` / `p2p:reclaim`

```bash
curl -sS -X POST "$BASE/api/v1/automation/escrows/0xORDER_ID/release" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: release-001" \
  -H "Content-Type: application/json" \
  -d '{}'

curl -sS -X POST "$BASE/api/v1/automation/escrows/0xORDER_ID/reclaim" \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Idempotency-Key: reclaim-001" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Poll operation

```bash
curl -sS "$BASE/api/v1/automation/operations/OPERATION_UUID" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

Statuses: `queued` → `pending` → `success` | `failed` | `unknown`. Same `Idempotency-Key` may only be reused with identical parameters (`IDEMPOTENCY_KEY_REUSED` otherwise).

---

## Security model

- Never embed API keys or OAuth refresh tokens in frontend code or prompts.
- Prefer agent-bound keys or OAuth grants with least privilege scopes.
- Unique `Idempotency-Key` per logical write.
- If a key leaks → revoke the key **and** **Revoke all** Forwarder actions in the dashboard.
- Kill switch: `MCP_ENABLED=0`.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `SCOPE_DENIED` | Agent lacks the scope — or unbound key tried a write |
| `POLICY_DENIED` | Amount exceeds agent `maxAmountUsdc` / `dailyCapUsdc` |
| Permission expired / no uses left | Forwarder panel → Activate again |
| Amount too high | Above Forwarder max amount |
| Invalid payment method | List payment methods and use an active `id` |
| Allowance / `transferFrom` error | Approve Escrow USDC (separate from Forwarder) |

---

## Related docs

- [API Keys](/developers/api-keys)
- [Payment Links](/developers/payment-links)
- [Webhooks](/developers/webhooks)
- [Public Order (P2P)](/p2p/orden-publica)
