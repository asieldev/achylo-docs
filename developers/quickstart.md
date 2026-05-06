# Developer Quickstart

Achylo provides a REST API that lets you create USDC payment links, receive real-time webhook notifications, and automate your entire payment flow — without requiring your users to interact with a wallet directly.

## Base URL

```
https://api.achylo.com
```

All responses are JSON. All amounts are in **micro-USDC** (1 USDC = `1000000`).

---

## How it works

```
Your server                    Achylo API                   Your customer
─────────────────────────────────────────────────────────────────────────
1. POST /api/payment-links  →  Returns paymentUrl
2. Redirect customer        →  Customer pays with USDC on Base
3.                          →  Achylo verifies on-chain
4.                          →  POST to your webhookUrl ✅
```

---

## Step 1 — Get your API Key

Log in to [achylo.com](https://achylo.com), open your **User Profile → Developer API Keys**, and create a key with a label like `"Production"`.

> ⚠️ The key is shown **only once**. Store it securely (e.g. environment variable).

```bash
export ACHYLO_API_KEY="achylo_a3f2c8b9d4e1f6a7..."
```

---

## Step 2 — Create a Payment Link

```bash
curl -X POST https://api.achylo.com/api/payment-links \
  -H "X-API-Key: $ACHYLO_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<'EOF'
{
  "amount": "10000000",
  "receiver": "0xYOUR_WALLET_ADDRESS",
  "description": "Order #1234",
  "expiresInMinutes": 1440,
  "webhookUrl": "https://yoursite.com/webhooks/achylo",
  "webhookSecret": "your32to64hexcharsecret"
}
EOF
```

**Response:**
```json
{
  "paymentId": "be66da05-9590-437a-a557-f83c34de45d7",
  "paymentUrl": "https://achylo.com/#/pay/be66da05-...",
  "amount": "10000000",
  "receiver": "0xyour_wallet",
  "description": "Order #1234",
  "status": "pending",
  "chainId": 8453,
  "createdAt": "2026-05-06T00:00:00.000Z",
  "expiresAt": "2026-05-07T00:00:00.000Z"
}
```

Redirect your customer to `paymentUrl`. They pay with USDC on **Base (chainId 8453)**.

---

## Step 3 — Receive Webhook Events

When the payment is confirmed on-chain, Achylo sends a `POST` to your `webhookUrl`:

```json
{
  "id": "a541ad6d-b079-431c-9e40-baafb307e5ba",
  "event": "payment.completed",
  "created_at": "2026-05-06T23:04:21.855Z",
  "data": {
    "payment_link_id": "be66da05-...",
    "amount": "10000000",
    "amount_usdc": "10.000000",
    "payer_address": "0xabc...",
    "receiver": "0xyour_wallet",
    "tx_hash": "0x75a8...",
    "chain_id": 8453,
    "block_number": 45573241,
    "paid_at": "2026-05-06T23:04:21.855Z",
    "description": "Order #1234"
  }
}
```

Always **verify the signature** before processing the event. See [Webhooks →](developers/webhooks.md)

---

## Amount reference

| USDC | micro-USDC (`amount`) |
|------|-----------------------|
| 1    | `1000000`             |
| 5    | `5000000`             |
| 10   | `10000000`            |
| 100  | `100000000`           |
| 1000 | `1000000000`          |

- **Minimum:** 1 USDC (`1000000`)
- **Maximum:** 100,000 USDC (`100000000000`)

---

## Authentication methods

| Method | Header | Use case |
|--------|--------|----------|
| API Key | `X-API-Key: achylo_...` | Server-to-server, automation |
| JWT | `Authorization: Bearer <token>` | Frontend (wallet signature) |

For programmatic integrations, always use **API Keys**.

---

## Next steps

- [API Keys →](developers/api-keys.md)
- [Payment Links API Reference →](developers/payment-links.md)
- [Webhook Events & Verification →](developers/webhooks.md)
