# API Keys

API Keys allow your servers to interact with the Achylo API without requiring a wallet signature on every request. They are the recommended authentication method for all programmatic integrations.

---

## Key format

```
achylo_<64 hex characters>
```

Example:
```
achylo_a3f2c8b9d4e1f6a7c2b8d9e3f1a4c7b2a3f2c8b9d4e1f6a7c2b8d9e3f1a4c7b2
```

---

## Limits

- **Maximum 10 active keys** per account
- Keys do not expire automatically — revoke them when no longer needed

---

## Managing keys via the Dashboard

1. Go to [achylo.com](https://achylo.com) and connect your wallet
2. Open **User Profile** (top right)
3. Scroll to **Developer API Keys**
4. Enter an optional label (e.g. `"Production"`, `"Staging"`)
5. Click **New Key** — the key is displayed **once only**

---

## Using the API Key

Pass the key in the `X-API-Key` header on every request:

```http
POST /api/payment-links
X-API-Key: achylo_a3f2c8b9...
Content-Type: application/json
```

### TypeScript / Node.js

```typescript
const ACHYLO_API_KEY = process.env.ACHYLO_API_KEY!;

const response = await fetch('https://api.achylo.com/api/payment-links', {
  method: 'POST',
  headers: {
    'X-API-Key': ACHYLO_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: '10000000',                              // 10 USDC (micro-USDC)
    receiver: '0x992b874a816E6A6D4Ebcb1Eb6977962F061df51f',
    description: 'Order #1234',                      // optional
    expiresInMinutes: 1440,                          // optional — 24 hours
    webhookUrl: 'https://yoursite.com/webhooks/achylo', // optional
    webhookSecret: process.env.ACHYLO_WEBHOOK_SECRET, // optional
  }),
});
```

### Python

```python
import os, requests

ACHYLO_API_KEY = os.environ['ACHYLO_API_KEY']

response = requests.post(
    'https://api.achylo.com/api/payment-links',
    headers={
        'X-API-Key': ACHYLO_API_KEY,
        'Content-Type': 'application/json',
    },
    json={
        'amount': '10000000',                                    # 10 USDC
        'receiver': '0x992b874a816E6A6D4Ebcb1Eb6977962F061df51f',
        'description': 'Order #1234',                            # optional
        'expiresInMinutes': 1440,                                # optional — 24 hours
        'webhookUrl': 'https://yoursite.com/webhooks/achylo',    # optional
        'webhookSecret': os.environ.get('ACHYLO_WEBHOOK_SECRET'), # optional
    },
)
```

### PHP

```php
$apiKey = getenv('ACHYLO_API_KEY');

$ch = curl_init('https://api.achylo.com/api/payment-links');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'X-API-Key: ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'amount'            => '10000000',    // 10 USDC
        'receiver'          => '0x992b874a816E6A6D4Ebcb1Eb6977962F061df51f',
        'description'       => 'Order #1234',   // optional
        'expiresInMinutes'  => 1440,             // optional — 24 hours
        'webhookUrl'        => 'https://yoursite.com/webhooks/achylo', // optional
        'webhookSecret'     => getenv('ACHYLO_WEBHOOK_SECRET'),        // optional
    ]),
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

---

## Security best practices

- **Never** commit API keys to source code or version control
- Store keys in environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
- Use separate keys per environment (`Development`, `Staging`, `Production`)
- Rotate keys periodically and immediately if compromised
- Revoke unused keys
