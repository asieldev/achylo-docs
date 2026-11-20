# Achylo MCP (Agentic Payments)

**Achylo MCP** is the remote Model Context Protocol server for Achylo. It exposes **read and write** tools that call the Achylo API. It does not hold CDP signing keys; P2P writes still need on-chain OperatorForwarder grants.

> **Summary:** Connect an MCP host to `https://api.achylo.com/mcp` with an API Key **bound to an API Agent**. Least-privilege scopes gate every tool. Writes also require Forwarder perms (and optional `policy` caps). Poll `get_operation` after async P2P tools.

---

## Who this is for

- Teams wiring assistants to Achylo payments and P2P automation
- Integrators already using [API Keys](api-keys.md), [Payment Links](payment-links.md), and [Agents](agents.md)

---

## Endpoint

| Environment | URL |
| :--- | :--- |
| Production | `https://api.achylo.com/mcp` |
| Local / compose | `http://127.0.0.1:8081/mcp` |

Transport: **Streamable HTTP** (stateless).

```http
X-API-Key: achylo_your_key_here
```

Bearer form is also accepted: `Authorization: Bearer achylo_…`.

---

## Dual permission model

1. **Off-chain scopes** on the API Agent bound to the key (MCP + REST).
2. **On-chain Forwarder** grants for P2P money ops (wallet Activate in profile).

Off-chain scopes never grant on-chain power. Forwarder grants never expand MCP tool access.

**Legacy unbound keys** keep full **read** access but **cannot write** (must bind an agent with the write scope).

Agent `policy.maxAmountUsdc` / `dailyCapUsdc` apply to amount-bearing writes (`403 POLICY_DENIED`).

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

## Example host config

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

---

## Security model

- Never embed API keys in frontend code or prompts.
- Prefer agent-bound keys with least privilege scopes.
- Missing scope → audited `scope_deny`; policy cap → `policy_deny`.
- Kill switch: `MCP_ENABLED=0`.

---

## Related docs

- [API Keys](api-keys.md)
- [Agents](agents.md)
- [Payment Links](payment-links.md)
- [Webhooks](webhooks.md)
