# Payment Links API

Payment links let you generate a hosted USDC checkout page on Base. Share the URL with your customer — they connect their wallet and pay.

---

## Payment Link Creation Methods

Achylo offers **3 ways** to generate payment links, depending on your technical needs:

### 1. Via Widget (No-Code)

Ideal for merchants who don't want to integrate APIs. Embed a payment button on your website without backend code.

- **Endpoint**: `POST /api/payment-links/widget`
- **Authentication**: No API Key required (uses Merchant ID)
- **Configuration**: Create a merchant widget from the Achylo dApp
- **Usage**: Embed HTML on your site; the user clicks and pays without leaving

**Usage example:**
```html
<script async src="https://achylo.com/v1/achylo.js"></script>
<achylo-button
  merchant-id="achylo_cv80520f"
  amount="29.99"
  currency="USDC">
</achylo-button>
```

**Full documentation**: [Payment Widgets](./payment-widgets.md)

---

### 2. Via Direct Link (From the dApp)

Ideal for users who prefer to generate links manually from the Achylo interface without technical integrations.

- **How it works**: Go to the Achylo dApp → Tools → Payment Links
- **Authentication**: Wallet login (no API Key)
- **Configuration**: Set amount, description, and expiration from the UI
- **Usage**: Copy the generated link and share it via email, WhatsApp, etc.

**Generated link example:**
```
https://achylo.com/#/pay/f7c3a8e1-2b4d-4f9a-8c1e-9d7f2a5b3c6e
```

---

### 3. Via API (For Developers)

Ideal for backend integrations, payment automation, and custom systems.

- **Endpoint**: `POST /api/payment-links`
- **Authentication**: Requires API Key
- **Configuration**: Full control over parameters (webhooks, custom expiration, etc.)
- **Usage**: Integrate with your backend, e-commerce, CRM, or billing system

**Full documentation**: [API Reference](#create-a-payment-link)

---

## Create a payment link

```http
POST /api/payment-links
X-API-Key: achylo_...
Content-Type: application/json
```

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | string | ✅ | Amount in micro-USDC. `"1000000"` = 1 USDC |
| `receiver` | string | ✅ | Ethereum address that receives the payment |
| `description` | string | — | Order description (max 500 chars) |
| `expiresInMinutes` | number | — | Expiry in minutes (5–43200). Defaults to no expiry |
| `webhookUrl` | string | — | HTTPS URL to receive payment events |
| `webhookSecret` | string | — | Your hex secret for HMAC verification (32–64 chars). If omitted, one is auto-generated and returned once |

### Response `201`

```json
{
  "paymentId": "be66da05-9590-437a-a557-f83c34de45d7",
  "paymentUrl": "https://achylo.com/#/pay/be66da05-...",
  "amount": "10000000",
  "receiver": "0x992b874a816e6a6d4ebcb1eb6977962f061df51f",
  "description": "Order #1234",
  "status": "pending",
  "chainId": 8453,
  "createdAt": "2026-05-06T00:00:00.000Z",
  "expiresAt": "2026-05-07T00:00:00.000Z",
  "webhookUrl": "https://yoursite.com/webhooks/achylo",
  "webhookSecret": "auto_generated_only_if_you_didnt_provide_one"
}
```

> If you provided your own `webhookSecret`, it will **not** appear in the response (you already know it).

---

## Get payment link details

```http
GET /api/payment-links/:id
```

This endpoint is **public** — no authentication required. It is used by the hosted checkout page.

### Response `200`

```json
{
  "id": "be66da05-...",
  "amount": "10000000",
  "receiver": "0x992b...",
  "description": "Order #1234",
  "status": "pending",
  "chainId": 8453,
  "createdAt": "2026-05-06T00:00:00.000Z",
  "expiresAt": "2026-05-07T00:00:00.000Z"
}
```

**Status values:**

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting payment |
| `paid` | Payment confirmed on-chain |
| `expired` | Link expired before payment |
| `cancelled` | Cancelled by the creator |

---

## Cancel a payment link

```http
DELETE /api/payment-links/:id
X-API-Key: achylo_...
```

Cancels a `pending` payment link. Only the creator can cancel it. Links that are already `paid` or `expired` cannot be cancelled.

### Response `200`

```json
{
  "paymentId": "be66da05-9590-437a-a557-f83c34de45d7",
  "status": "cancelled"
}
```

---

## List your payment links

```http
GET /api/payment-links/history?limit=50&offset=0
X-API-Key: achylo_...
```

**Query params:**

| Param | Default | Max |
|-------|---------|-----|
| `limit` | 50 | 100 |
| `offset` | 0 | — |

### Response `200`

```json
{
  "links": [
    {
      "paymentId": "be66da05-9590-437a-a557-f83c34de45d7",
      "amount": "10000000",
      "receiver": "0x992b874a816e6a6d4ebcb1eb6977962f061df51f",
      "description": "Order #1234",
      "status": "paid",
      "chainId": 8453,
      "createdAt": "2026-05-06T00:00:00.000Z",
      "expiresAt": "2026-05-07T00:00:00.000Z",
      "paidAt": "2026-05-06T12:30:00.000Z",
      "txHash": "0x1234...abcd",
      "payerAddress": "0xabc...",
      "paymentUrl": "https://achylo.com/#/pay/be66da05-..."
    }
  ],
  "total": 1
}
```

---

## Code examples

### TypeScript / Node.js

```typescript
import fetch from 'node-fetch';

interface CreatePaymentLinkParams {
  amount: string;
  receiver: string;
  description?: string;
  expiresInMinutes?: number;
  webhookUrl?: string;
  webhookSecret?: string;
}

interface PaymentLink {
  paymentId: string;
  paymentUrl: string;
  amount: string;
  receiver: string;
  description: string | null;
  status: string;
  chainId: number;
  createdAt: string;
  expiresAt: string | null;
  webhookUrl?: string;
  webhookSecret?: string;
}

async function createPaymentLink(
  params: CreatePaymentLinkParams
): Promise<PaymentLink> {
  const response = await fetch('https://api.achylo.com/api/payment-links', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.ACHYLO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Achylo API error: ${error.error}`);
  }

  return response.json() as Promise<PaymentLink>;
}

// Usage
const link = await createPaymentLink({
  amount: '10000000',        // 10 USDC
  receiver: '0x992b874a...',
  description: 'Order #1234',
  expiresInMinutes: 1440,    // 24 hours
  webhookUrl: 'https://yoursite.com/webhooks/achylo',
  webhookSecret: process.env.ACHYLO_WEBHOOK_SECRET,
});

console.log('Payment URL:', link.paymentUrl);
// → https://achylo.com/#/pay/be66da05-...

async function cancelPaymentLink(paymentId: string): Promise<void> {
  const response = await fetch(
    `https://api.achylo.com/api/payment-links/${paymentId}`,
    {
      method: 'DELETE',
      headers: { 'X-API-Key': process.env.ACHYLO_API_KEY! },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Achylo API error: ${error.error}`);
  }

  const result = await response.json();
  console.log('Cancelled:', result.paymentId, '→', result.status);
}
```

---

### Python

```python
import os
import requests
from typing import Optional

ACHYLO_API_KEY = os.environ['ACHYLO_API_KEY']
ACHYLO_BASE_URL = 'https://api.achylo.com'


def create_payment_link(
    amount: str,
    receiver: str,
    description: Optional[str] = None,
    expires_in_minutes: Optional[int] = None,
    webhook_url: Optional[str] = None,
    webhook_secret: Optional[str] = None,
) -> dict:
    payload = {
        'amount': amount,
        'receiver': receiver,
    }
    if description:
        payload['description'] = description
    if expires_in_minutes:
        payload['expiresInMinutes'] = expires_in_minutes
    if webhook_url:
        payload['webhookUrl'] = webhook_url
    if webhook_secret:
        payload['webhookSecret'] = webhook_secret

    response = requests.post(
        f'{ACHYLO_BASE_URL}/api/payment-links',
        headers={
            'X-API-Key': ACHYLO_API_KEY,
            'Content-Type': 'application/json',
        },
        json=payload,
    )
    response.raise_for_status()
    return response.json()


def get_payment_link(payment_id: str) -> dict:
    response = requests.get(
        f'{ACHYLO_BASE_URL}/api/payment-links/{payment_id}'
    )
    response.raise_for_status()
    return response.json()


# Usage
link = create_payment_link(
    amount='10000000',        # 10 USDC
    receiver='0x992b874a...',
    description='Order #1234',
    expires_in_minutes=1440,
    webhook_url='https://yoursite.com/webhooks/achylo',
    webhook_secret=os.environ.get('ACHYLO_WEBHOOK_SECRET'),
)

print('Payment URL:', link['paymentUrl'])


def cancel_payment_link(payment_id: str) -> dict:
    response = requests.delete(
        f'{ACHYLO_BASE_URL}/api/payment-links/{payment_id}',
        headers={'X-API-Key': ACHYLO_API_KEY},
    )
    response.raise_for_status()
    return response.json()


# Cancel a link
result = cancel_payment_link('be66da05-9590-437a-a557-f83c34de45d7')
print('Status:', result['status'])  # → cancelled
```

---

### PHP

```php
<?php

class AchyloClient
{
    private string $apiKey;
    private string $baseUrl = 'https://api.achylo.com';

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function createPaymentLink(array $params): array
    {
        return $this->request('POST', '/api/payment-links', $params);
    }

    public function getPaymentLink(string $paymentId): array
    {
        return $this->request('GET', "/api/payment-links/{$paymentId}");
    }

    public function listPaymentLinks(int $limit = 50, int $offset = 0): array
    {
        return $this->request('GET', "/api/payment-links/history?limit={$limit}&offset={$offset}");
    }

    public function cancelPaymentLink(string $paymentId): array
    {
        return $this->request('DELETE', "/api/payment-links/{$paymentId}");
    }

    private function request(string $method, string $path, ?array $body = null): array
    {
        $ch = curl_init($this->baseUrl . $path);
        $headers = [
            'X-API-Key: ' . $this->apiKey,
            'Content-Type: application/json',
        ];

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => $headers,
        ]);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);

        if ($statusCode >= 400) {
            throw new RuntimeException('Achylo API error: ' . ($data['error'] ?? 'Unknown error'));
        }

        return $data;
    }
}

// Usage
$achylo = new AchyloClient(getenv('ACHYLO_API_KEY'));

$link = $achylo->createPaymentLink([
    'amount'           => '10000000',    // 10 USDC
    'receiver'         => '0x992b874a...',
    'description'      => 'Order #1234',
    'expiresInMinutes' => 1440,
    'webhookUrl'       => 'https://yoursite.com/webhooks/achylo',
    'webhookSecret'    => getenv('ACHYLO_WEBHOOK_SECRET'),
]);

echo 'Payment URL: ' . $link['paymentUrl'] . PHP_EOL;

// Cancel a link
$result = $achylo->cancelPaymentLink('be66da05-9590-437a-a557-f83c34de45d7');
echo 'Status: ' . $result['status'] . PHP_EOL; // → cancelled
```

---

## Error responses

| HTTP | Error | Cause |
|------|-------|-------|
| `400` | `amount must be a valid integer string` | Non-integer amount |
| `400` | `Minimum amount is 1 USDC` | Amount below 1000000 |
| `400` | `Invalid receiver address` | Malformed Ethereum address |
| `400` | `Invalid webhookUrl` | URL failed SSRF validation |
| `400` | `webhookSecret must be a hex string between 32 and 64 characters` | Invalid secret format |
| `401` | `Unauthorized` | Missing or invalid API Key / JWT |
| `403` | `Forbidden — only the creator can cancel this link` | Trying to cancel someone else's link |
| `409` | `Cannot cancel a link with status '...'` | Link is already `paid`, `expired`, or `cancelled` |
| `429` | Too many requests | Rate limit exceeded |
| `500` | `Failed to create payment link` | Internal server error |
