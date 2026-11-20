# Getting Started with Achylo Protocol

> **IMPORTANT:** Before you begin, please read the **TERMS OF USE**.

---

### Available Network
* **Base Mainnet**.
* **Note:** Before sending USDC to your wallet, always verify the available network.

---

## Introduction
This guide walks you step by step so you can use the **Achylo** dApp (Base Network). Take your time and follow the instructions in order.

## What Can You Do with Achylo?
Achylo is a Web3 platform with these core superpowers:

### 1. P2P Marketplace (Decentralized and Anonymous)
* **Buy/Sell:** Exchange USDC using local fiat currencies.
* **No intermediaries:** The smart escrow keeps funds safe until both parties confirm.
* **Referral program:** Invite active traders to unlock Gold status and 0% protocol fees ([Referrals Guide](p2p/referrals.md)).
* **Order types:**
    * **Public:** Visible to all merchants.
    * **Private:** Only for your trusted counterparty.

### 2. Mint/Redeem APAY (Stablecoin backed by USDC)
* **Conversion:** Swap `USDC ↔ APAY` at any time.
* **Discounts:** Get lower P2P fees when operating with APAY.
* **Utility:** Ideal for users who want to move across the *on-chain* world in a yield-bearing stablecoin.

### 3. Payment Links (For Merchants and Developers)
* **API Base URL (production):** `https://api.achylo.com`
* **Programmatic collections:** Create USDC payment links on Base and share them with your customers.
* **No customer wallet required:** The payer only needs a Base-compatible wallet.
* **Flexible authentication:** Use your session JWT or an API Key to create links from your backend.
* **Configurable expiration:** Set the link lifetime (default 24 h).
* **Custom reference:** Include your own order ID for reconciliation.

```bash
# Quick example (production API)
curl -X POST https://api.achylo.com/api/payment-links \
  -H "X-API-Key: achylo_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "10000000",
    "receiver": "0xYourAddress",
    "reference": "order-001",
    "expiresInSeconds": 86400
  }'
```

Full documentation: [Payment Links](developers/payment-links.md)

### 4. Payment Widgets ("Pay with Crypto" Button)
* **No-code integration:** Copy and paste a simple HTML button into any website.
* **For all levels:** From non-technical users to advanced developers.
* **JavaScript SDK:** Full control with events, theme customization, and dynamic amounts.
* **Domain security:** Domain whitelist to protect your Widget ID.
* **Ideal for:** Online stores, landing pages, donation buttons, and digital services.

```html
<!-- Quick example: Payment button -->
<script src="https://achylo.com/achylo.js"></script>

<button 
  class="achylo-pay-button"
  data-merchant-id="wm_YOUR_WIDGET_ID"
  data-amount="10.00"
  data-currency="USDC"
  data-description="Order #1234"
>
  Pay with Crypto
</button>
```

Full documentation: [Payment Widgets](developers/payment-widgets.md)

---

### 5. Webhooks
* **Real-time notifications:** Receive a `POST` on your server when a payment link is paid.
* **Signature verification:** Each delivery includes `X-Achylo-Signature` (HMAC-SHA256) to validate authenticity.
* **Automatic retries:** The system retries up to 3 times if your endpoint fails.
* **Manual test:** You can trigger a test delivery from the API.

```ts
// Verify signature (TypeScript)
import crypto from 'crypto';
const sig = crypto.createHmac('sha256', webhookSecret)
  .update(rawBody).digest('hex');
if (sig !== req.headers['x-achylo-signature']) throw new Error('Invalid signature');
```

Full documentation: [Webhooks](developers/webhooks.md)

---

### 6. APAY Staking
* **Yield:** Earn interest by holding your APAY on the network.
* **Status:** *(In development)*.

---

### 7. On-Chain Price Oracle (Chainlink Compatible)

**Summary:** Fiat/USDC rates from real Achylo P2P settlements — not DEX spot flashes — published on Base for DeFi and payment rails.

**Details:**
* **Real P2P pricing:** Decentralized exchange rates generated directly from completed, liquidated escrows.
* **Institutional safety:** VWAP volume weighting, median sorting, circuit breakers, anti-wash trading, and staleness checks.
* **Chainlink standard:** Compatible with `AggregatorV3Interface` for lending markets, vaults, AMMs, and payment processors.
* **Native interface:** `IAchyloPriceOracle` for VWAP, Median, ring-buffer observations, and feed status.

Full documentation: [Price Oracle (On-Chain)](developers/price-oracle.md)

---

### 8. Agents (Developers)
* **API Base URL (production):** `https://api.achylo.com` (e.g. `/api/v1/automation/...`)
* **Automate P2P:** Create, accept, confirm, cancel, and dispute public orders from your server.
* **API Key + permissions:** You approve limited Agent permissions in your profile; then your backend calls the Achylo API.
* **Revocable anytime:** Turn actions off or Revoke all from the same screen.

Full documentation: [Agents](developers/agents.md)

---

### 9. Achylo MCP (Agentic Payments)

**Summary:** Remote Model Context Protocol server (`https://api.achylo.com/mcp`) so AI hosts can call Achylo with an API Key.

**Details:**
* **Transport:** Streamable HTTP, API Key auth (`X-API-Key: achylo_…`).
* **Phase now:** read-only tools (automation config, Agent permissions, payment methods, payment-link status/history, operation polling).
* **Writes:** still via REST Agents API (`/api/v1/automation`, async `202` + poll) until scoped MCP write tools ship.
* **Security:** MCP is a thin adapter; business logic and Forwarder execution stay in Achylo Server.

Full documentation: [Achylo MCP (Agentic Payments)](developers/mcp.md)