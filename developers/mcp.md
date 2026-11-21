# Achylo MCP (Agentic Payments)

**Achylo MCP** is the remote Model Context Protocol server for Achylo. It exposes **read and write** tools that call the Achylo API. It does not hold CDP signing keys; P2P writes still need on-chain OperatorForwarder grants.

> **Summary:** New here? Start at **[Connect step by step](#connect-step-by-step-start-here)** (Cursor, Claude Code, Claude Desktop, or your own server with an API key). Endpoint: `https://api.achylo.com/mcp`. Auth: bound API key or OAuth. Writes need Forwarder grants; poll `get_operation` after async P2P tools.

The same scopes / Forwarder grants also power the **Automation REST** API (`/api/v1/automation`) if you call Achylo from your own backend instead of an MCP host.

---

## Who this is for

- Junior / mid developers wiring Cursor, Claude Code, or OpenAI agents to Achylo
- Backend services that call Achylo with an API key (no MCP host required)
- Anyone already using [API Keys](/developers/api-keys) or [Payment Links](/developers/payment-links)

---

## Connect step by step (start here)

Think of Achylo MCP as a **remote toolbox**. Your AI host (Cursor, Claude Code, …) does **not** run Achylo code on your laptop — it calls our public URL and must prove who you are with an **API key** (or OAuth).

```text
You  →  Cursor / Claude / your server  →  https://api.achylo.com/mcp
                                         (header: X-API-Key: achylo_…)
                                         → Achylo API → (optional) on-chain Forwarder
```

You need **two things** before any host works:

1. An **API Agent + bound key** from the Achylo dashboard (steps below).
2. For P2P **money** actions (create/accept/release/…): **on-chain Forwarder** permissions activated in the same profile (see [Enable on-chain Forwarder](#enable-on-chain-forwarder-actions)).

If you only want to **read** prices / orders / payment links, scopes on the agent are enough — you can skip Forwarder until you need writes that move USDC.

### Step 1: Create the API key in Achylo (5 minutes)

1. Go to [achylo.com](https://achylo.com) and connect your wallet.
2. Open **User Profile → Developer / Agents**.
3. Create an **API Agent**. Turn on the scopes you need (start with reads: `oracle:read`, `fiat:read`, `p2p:orders:read`, `payment_links:read`, `automation:config`, `automation:operations`).
4. Click **Create bound key**. Copy the value once. It looks like `achylo_` + a long hex string.
5. Store it as an environment variable on your machine (never commit it to git):

```bash
# macOS / Linux — add to ~/.zshrc or ~/.bashrc, then open a new terminal
export ACHYLO_API_KEY='achylo_your_key_here'
```

> **Junior tip:** An unbound / legacy key can **read** but **cannot write**. For MCP writes, the key must be **bound** to an agent that has the write scopes.

### Step 2: Pick how you will connect

| I want to… | Use this |
|------------|----------|
| Chat in **Cursor** and call Achylo tools | [A. Cursor](#a-connect-from-cursor) |
| Use **Claude Code** in the terminal | [B. Claude Code](#b-connect-from-claude-code) |
| Use **Claude Desktop / claude.ai** connectors | [C. Claude Desktop](#c-claude-desktop-claudeai) |
| Call Achylo from **my Node/Python server** with the API key | [D. Your server (API key)](#d-use-the-api-key-from-your-own-server) |
| Avoid storing a long-lived key in the IDE | [OAuth](#oauth-21-mcp-hosts) (browser consent) |

---

### A. Connect from Cursor

1. Create a config file (pick one):
   - **This project only:** `.cursor/mcp.json` in the repo root  
   - **All projects on your machine:** `~/.cursor/mcp.json`
2. Paste:

```json
{
  "mcpServers": {
    "achylo": {
      "url": "https://api.achylo.com/mcp",
      "headers": {
        "X-API-Key": "${env:ACHYLO_API_KEY}"
      }
    }
  }
}
```

3. Make sure `ACHYLO_API_KEY` is set in your **system / shell environment**, then **fully quit and reopen Cursor** (so it sees the env var). Remote MCP does **not** load `.env` files.
4. Open **Cursor Settings → MCP** and confirm `achylo` is connected (green / tools listed).
5. In Agent chat, try: *“Use Achylo MCP: list fiat currencies”* or *“get oracle price for currency id 0”*.

**Do not** put the raw `achylo_…` key inside `mcp.json` if the file is committed to git. Prefer `${env:ACHYLO_API_KEY}`.

If the host supports OAuth instead of a static header, you can omit `headers` and complete browser consent when Cursor prompts you (see [OAuth](#oauth-21-mcp-hosts)).

---

### B. Connect from Claude Code

Claude Code needs an explicit `"type": "http"` for remote servers.

**Option 1 — CLI (fastest):**

```bash
claude mcp add --transport http achylo https://api.achylo.com/mcp \
  --header "X-API-Key: ${ACHYLO_API_KEY}"
```

**Option 2 — project file `.mcp.json`:**

```json
{
  "mcpServers": {
    "achylo": {
      "type": "http",
      "url": "https://api.achylo.com/mcp",
      "headers": {
        "X-API-Key": "${ACHYLO_API_KEY}"
      }
    }
  }
}
```

Then:

```bash
claude mcp get achylo
```

Ask Claude Code something like: *“Call Achylo `list_fiat_currencies`”*.

---

### C. Claude Desktop / claude.ai

Remote MCP is added as a **custom connector** (not by pasting a Cursor-style block into `claude_desktop_config.json` — that file is for **local** stdio servers).

1. In Claude: **Customize → Connectors → Add custom connector** (wording may vary slightly).
2. Remote MCP server URL: `https://api.achylo.com/mcp`
3. Auth: use the connector’s sign-in / headers options. If the UI allows a fixed request header, set:

```http
X-API-Key: achylo_your_key_here
```

Otherwise use **OAuth** when prompted (Achylo publishes RFC 9728 metadata on the MCP URL).

4. Save, then ask Claude to use an Achylo tool (e.g. list public orders).

> Claude.ai / cloud connectors call Achylo from Anthropic’s network — our production URL is public HTTPS, so that is fine.

---

### D. Use the API key from your own server

You do **not** need Cursor or Claude for this path. Your backend talks to Achylo like any HTTPS API.

**Mental model:**

- MCP hosts speak the MCP protocol to `/mcp`.
- Your server can call the **same capabilities** over REST with the same API key (simpler for juniors writing a bot).

#### D1. Smoke-test the key with curl

```bash
export ACHYLO_API_KEY='achylo_your_key_here'
export BASE='https://api.achylo.com'

# Should return JSON (fiat catalog) if scope fiat:read is enabled
curl -sS "$BASE/api/v1/market/fiat-currencies" \
  -H "X-API-Key: $ACHYLO_API_KEY"
```

If you get `401`, the key is wrong/revoked. If you get `403 SCOPE_DENIED`, edit the agent scopes in the dashboard and try again.

#### D2. Node.js example (read)

```javascript
const ACHYLO_API_KEY = process.env.ACHYLO_API_KEY;
const BASE = 'https://api.achylo.com';

async function listFiat() {
  const res = await fetch(`${BASE}/api/v1/market/fiat-currencies`, {
    headers: { 'X-API-Key': ACHYLO_API_KEY },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

listFiat().then(console.log).catch(console.error);
```

#### D3. Node.js example (async P2P write + poll)

Writes return `202` with an operation id. You must poll until `success` / `failed` / `unknown`. You also need the matching **scope** + **Forwarder** grant.

```javascript
const ACHYLO_API_KEY = process.env.ACHYLO_API_KEY;
const BASE = 'https://api.achylo.com';

async function acceptOrder(orderId, amount, takerPaymentMethodId) {
  const create = await fetch(`${BASE}/api/v1/automation/orders/${orderId}/accept`, {
    method: 'POST',
    headers: {
      'X-API-Key': ACHYLO_API_KEY,
      'Idempotency-Key': `accept-${orderId}-${amount}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, takerPaymentMethodId }),
  });
  if (!create.ok) throw new Error(await create.text());
  const op = await create.json(); // { id, status: "queued", ... }

  for (;;) {
    const poll = await fetch(`${BASE}/api/v1/automation/operations/${op.id}`, {
      headers: { 'X-API-Key': ACHYLO_API_KEY },
    });
    if (!poll.ok) throw new Error(await poll.text());
    const status = await poll.json();
    if (['success', 'failed', 'unknown'].includes(status.status)) return status;
    await new Promise((r) => setTimeout(r, 2000));
  }
}
```

Full REST catalog (create / update / release / reclaim / …) is in [Automation REST](#automation-rest-same-scopes-forwarder) below.

#### D4. OpenAI Agents / custom orchestration

If you build an OpenAI (or any) agent that should “use Achylo”:

1. Keep `ACHYLO_API_KEY` only on **your** server (never in the browser or in the model prompt).
2. Expose your own tools/functions that wrap the curl/fetch calls above.
3. Or point an MCP-capable runtime at `https://api.achylo.com/mcp` with `X-API-Key` the same way Cursor does.

The model should never see the raw key.

---

### Smoke test with curl

Streamable HTTP requires this `Accept` header (Cursor/Claude set it for you):

```bash
curl -sS https://api.achylo.com/mcp \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Without `text/event-stream` you get `Not Acceptable: Client must accept both application/json and text/event-stream`.

### Quick checklist after connecting

- [ ] `ACHYLO_API_KEY` is set and starts with `achylo_`
- [ ] Agent is **enabled** and key is **bound** to it
- [ ] Needed **scopes** are toggled (reads for smoke test; writes for P2P)
- [ ] For money moves: Forwarder actions **Activate**d + Escrow USDC **approve** if selling/funding
- [ ] Host shows Achylo tools / curl returns JSON without `401`/`403`

---

## Setup in the Achylo dashboard (reference)

Agent configuration is **UI-only** (wallet session). You do not call an Agents REST API from your app.

### API Agent + bound key

Same as [Step 1](#step-1-create-the-api-key-in-achylo-5-minutes). Toggle scopes carefully; optional policy: `maxAmountUsdc` / `dailyCapUsdc`.

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

### Enable on-chain Forwarder actions

<!-- Legacy Docsify ids (digit-leading / em-dash slugs) -->
<a id="_2-enable-on-chain-forwarder-actions"></a>
<a id="2--enable-on-chain-forwarder-actions"></a>

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

> **Not a website:** opening `/mcp` in a browser will not show a docs page. Without an API key you should get **401**. If you see `{"error":"not_found"}`, public nginx is not proxying `/mcp` to the MCP service yet (ops: enable `location /mcp` → `:8081`).

```http
X-API-Key: achylo_your_key_here
```

Also accepted:

- `Authorization: Bearer achylo_…` (API key)
- `Authorization: Bearer <oauth_access_token>` (OAuth AT)

Unauthenticated MCP requests return `401` with `WWW-Authenticate` pointing at protected-resource metadata (RFC 9728).

Full connect recipes: [Connect step by step](#connect-step-by-step-start-here).

---

## OAuth 2.1 (MCP hosts)

Prefer OAuth when the host should not store a long-lived API key (e.g. team laptops). Point the host at `https://api.achylo.com/mcp` with no static key and complete browser consent when prompted.

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
