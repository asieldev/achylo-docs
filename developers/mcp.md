# Achylo MCP (Agentic Payments)

**Achylo MCP** is the Model Context Protocol server for Achylo payments. It lets AI agents and MCP hosts (Cursor, Claude Desktop, LangGraph, MultiMCP, and others) create payment links, receive settlement signals, and drive **P2P Agent** actions — without building custom HTTP glue for every tool call.

> **Summary:** Point an MCP-capable agent at Achylo with your API Key. The agent discovers tools (`create_payment_link`, Agent order actions, etc.), runs them under your scoped permissions, and settles **USDC on Base**.

---

## Who this is for

- Product and engineering teams wiring **agentic checkout** into assistants
- Integrators already using [API Keys](api-keys.md), [Payment Links](payment-links.md), and [Agents](agents.md)
- Multi-agent stacks (LangGraph / MultiMCP) that need a first-class payments tool server

If you only need a button on a website, start with [Payment Widgets](payment-widgets.md). MCP is for **agents that call tools**.

---

## How it works (simple)

1. Create an **API Key** in Achylo ([API Keys](api-keys.md)).
2. (Optional) Enable **Agents** permissions for P2P public-order automation ([Agents](agents.md)).
3. Register the Achylo MCP server in your MCP host with that API Key.
4. The agent lists tools, then calls them (create link, accept order, confirm payment, …).
5. Achylo executes on Base within the limits you approved; webhooks notify your backend when payments complete.

```
[ Agent / MCP host ]
        │  MCP tools
        ▼
[ Achylo MCP ]
        │  X-API-Key
        ▼
[ Achylo API · Base settlement ]
```

---

## What agents can do

| Capability | Via MCP tools backed by | Notes |
| :--- | :--- | :--- |
| Create USDC payment links | Payment Links API | Escrow-backed URLs, optional webhook |
| Automate public P2P orders | Agents / `/api/v1/automation` | Create, accept, confirm, cancel, dispute |
| React to settlement | Webhooks | HMAC-signed `payment.completed` events |

Permissions always follow your Achylo account: API Key auth + Agent action scopes you activate in the profile.

---

## Prerequisites

1. Achylo account (wallet login)
2. At least one **API Key**
3. For Agent tools: Agent actions activated (duration, max uses, max amount)
4. An MCP host that supports remote/stdio servers (Cursor, Claude, custom LangGraph node, etc.)

---

## Connect an MCP host

Exact config keys vary by host. Conceptually you provide:

- **Server name:** `achylo` (or similar)
- **Transport:** as published for your environment (stdio / HTTP SSE)
- **Auth:** `ACHYLO_API_KEY` / `X-API-Key` header using `achylo_…`

Example shape for hosts that use JSON config:

```json
{
  "mcpServers": {
    "achylo": {
      "command": "npx",
      "args": ["-y", "@achylo/mcp"],
      "env": {
        "ACHYLO_API_KEY": "achylo_your_key_here"
      }
    }
  }
}
```

> Package name and transport may evolve — check release notes when installing. The API surface underneath remains [Payment Links](payment-links.md) and [Agents](agents.md).

---

## Typical agent flows

### Collect a payment

1. Agent calls a payment-link tool with `amount`, `receiver`, optional `description` / `webhookUrl`.
2. Achylo returns a `paymentUrl`.
3. Agent shares the URL with the user (or opens it in a browser tool).
4. On-chain confirmation → webhook to your server.

### Automate a P2P public order

1. Ensure Agent permissions are active.
2. Agent calls create / accept / confirm tools with an `Idempotency-Key`.
3. Achylo runs the action as your account on Base, within max uses and amount caps.

See full HTTP details in [Agents](agents.md).

---

## Security model

- **API Keys** authenticate the MCP server to Achylo — treat them like passwords; never embed in public repos.
- **Agent scopes** limit which P2P actions exist and for how long; revoke from the profile anytime.
- **Webhooks** should always verify `X-Achylo-Signature` ([Webhooks](webhooks.md)).
- Prefer least privilege: enable only the Agent actions your agent needs.

---

## Related docs

- [Quickstart](quickstart.md) — payment links from scratch
- [API Keys](api-keys.md)
- [Agents](agents.md)
- [Payment Links](payment-links.md)
- [Webhooks](webhooks.md)
- [Price Oracle (On-Chain)](price-oracle.md) — feeds agents can also consume for FX-aware logic
