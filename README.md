# Getting Started with Achylo Protocol

> **IMPORTANT:** Before you begin, please read the **TERMS OF USE**.

---

### 🌐 Available Network
* **Base Mainnet**.
* **Note:** Before sending USDC to your wallet, always verify the available network.

---

## 📖 Introduction
This guide walks you step by step so you can use the **Achylo** dApp (Base Network). Take your time and follow the instructions in order.

## What Can You Do with Achylo?
Achylo is a Web3 platform with six core superpowers:

### 1. P2P Marketplace (Decentralized and Anonymous)
* **Buy/Sell:** Exchange USDC using local fiat currencies.
* **No intermediaries:** The smart escrow keeps funds safe until both parties confirm.
* **Order types:**
    * **Public:** Visible to all merchants.
    * **Private:** Only for your trusted counterparty.

### 2. Mint/Redeem CUBT (Stablecoin backed by USDC)
* **Conversion:** Swap `USDC ↔️ CUBT` at any time.
* **Discounts:** Get lower P2P fees when operating with CUBT.
* **Utility:** Ideal for users who want to move across the *on-chain* world in a yield-bearing stablecoin.

### 3. Payment Links (For Merchants and Developers)
* **Programmatic collections:** Create USDC payment links on Base and share them with your customers.
* **No customer wallet required:** The payer only needs a Base-compatible wallet.
* **Flexible authentication:** Use your session JWT or an API Key to create links from your backend.
* **Configurable expiration:** Set the link lifetime (default 24 h).
* **Custom reference:** Include your own order ID for reconciliation.

```bash
# Quick example
curl -X POST https://achylo-gunjs-relay.fly.dev/api/payment-links \
  -H "X-API-Key: achylo_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "10000000",
    "receiver": "0xYourAddress",
    "reference": "order-001",
    "expiresInSeconds": 86400
  }'
```

📖 Full documentation: [Payment Links](developers/payment-links.md)

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
  💳 Pay with Crypto
</button>
```

📖 Full documentation: [Payment Widgets](developers/payment-widgets.md)

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

📖 Full documentation: [Webhooks](developers/webhooks.md)

---

### 6. CUBT Staking
* **Yield:** Earn interest by holding your CUBT on the network.
* **Status:** *(In development)*.