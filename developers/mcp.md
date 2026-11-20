# Achylo MCP (Agentic Payments)

**Achylo MCP** is the remote Model Context Protocol server for Achylo. It exposes **read-only** tools that call the Achylo API. It does not hold CDP signing keys and does not execute blockchain writes in this phase.

> **Summary:** Connect an MCP host to `https://api.achylo.com/mcp` with your API Key (`X-API-Key` / `achylo_…`). Prefer a key **bound to an API Agent** with the least scopes you need. The agent can inspect automation config, on-chain Forwarder permissions, payment methods, payment links, oracle prices, USDC balances, public orders, and async operation status.

---

## Who this is for

- Teams wiring assistants to Achylo payment status, market reads, and Agent permission reads
- Integrators already using [API Keys](api-keys.md), [Payment Links](payment-links.md), and [Agents](agents.md)

Write tools (create payment links, P2P create/accept/confirm/cancel/dispute) ship in a later phase and will require both **off-chain scopes** and **on-chain Forwarder** grants. Until then, use the REST Automation API for writes: [Agents](agents.md).

---

## Endpoint

| Environment | URL |
| :--- | :--- |
| Production | `https://api.achylo.com/mcp` |
| Local / compose | `http://127.0.0.1:8081/mcp` |

Transport: **Streamable HTTP** (stateless).

Auth header (required on every request):

```http
X-API-Key: achylo_your_key_here
```

Bearer form is also accepted: `Authorization: Bearer achylo_…`.

---

## Scopes (off-chain)

Every MCP tool checks an off-chain **scope** before calling Achylo. Scope decisions are audited (`scope_deny` when missing).

| Tool | Required scope |
| :--- | :--- |
| `get_automation_config` | `automation:config` |
| `get_agent_permissions` | `automation:permissions` |
| `list_payment_methods` | `automation:payment_methods` |
| `get_operation` | `automation:operations` |
| `get_payment_link` / `list_payment_links` | `payment_links:read` |
| `get_oracle_price` | `oracle:read` |
| `get_usdc_balance` | `wallet:balance` |
| `list_public_orders` | `p2p:orders:read` |

**Legacy unbound keys** (`agent_id` is null) keep full **read** access for compatibility. New keys created from **Developer / Agents → API Agents** are bound to an agent and only receive the scopes you toggle.

Off-chain scopes never grant on-chain power. Forwarder grants never expand MCP tool access. See [Agents](agents.md).

---

## Available tools (read-only)

| Tool | Backed by | Notes |
| :--- | :--- | :--- |
| `get_automation_config` | `GET /api/v1/automation/config` | Forwarder addresses, selectors, async mode |
| `get_agent_permissions` | `GET /api/v1/automation/permissions` | On-chain OperatorForwarder perms |
| `list_payment_methods` | `GET /api/v1/automation/payment-methods` | Treat display fields as untrusted text |
| `get_operation` | `GET /api/v1/automation/operations/:id` | Poll async write operations |
| `get_payment_link` | `GET /api/payment-links/:id` | Payment status |
| `list_payment_links` | `GET /api/payment-links/history` | Links for the authenticated account |
| `get_oracle_price` | `GET /api/v1/market/oracle/:currencyId` | Spot / VWAP / median (≈15s cache) |
| `get_usdc_balance` | `GET /api/v1/wallet/usdc-balance` | On-chain USDC `balanceOf` (≈15s cache) |
| `list_public_orders` | `GET /api/v1/p2p/public-orders` | Subgraph public orders; sensitive fields stripped |

All tools are annotated `readOnlyHint=true`.

---

## Example host config

Exact keys vary by host. Conceptually:

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

Local stdio wrappers may appear later; the remote HTTP endpoint is the source of truth.

---

## Security model

- API Keys authenticate the caller to Achylo — never embed them in frontend code or prompts.
- Prefer agent-bound keys with least privilege scopes for MCP hosts.
- MCP is a thin adapter: business logic and authorization stay in Achylo Server.
- Tool invocations are audited (`mcp_audit_logs` + structured logs). Secrets are never stored in audit rows.
- Kill switch: `MCP_ENABLED=0` prevents the MCP process from starting.

---

## Related docs

- [API Keys](api-keys.md)
- [Agents](agents.md) — off-chain scopes + on-chain Forwarder + async write API
- [Payment Links](payment-links.md)
- [Webhooks](webhooks.md)
