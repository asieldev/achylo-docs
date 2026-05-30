# Widget Security Architecture

## Problem Statement

**Challenge:** Allow merchants to embed payment widgets on any website without:
- Opening CORS globally (security risk)
- Requiring server-side whitelist updates (not scalable)
- Limiting to specific platforms (not generic)

**Solution:** Per-Merchant Origin Validation

---

## CORS Architecture: Selective Approach

**Key Principle:** Only the widget endpoint allows external origins. All other endpoints remain restricted.

```
┌──────────────────────────────────────────────────────────────┐
│                     INCOMING REQUEST                          │
│                   (from any origin)                           │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  CORS Middleware (relay.js)  │
        └──────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────────┐    ┌──────────────────────┐
│ /api/payment-links/  │    │ Other endpoints      │
│ widget               │    │ (/api/auth, etc)     │
│                      │    │                      │
│ ✅ CORS: Permissive  │    │ ❌ CORS: Restrictive │
│ origin: true         │    │ origin: whitelist    │
│                      │    │                      │
│ Validation:          │    │ Validation:          │
│ Per-merchant         │    │ JWT + IP check       │
│ origin whitelist     │    │                      │
└──────────────────────┘    └──────────────────────┘
        │                             │
        ▼                             ▼
   ✅ Allowed                    ❌ Blocked
   (if merchant                  (if origin not
    whitelist matches)           in allowedOrigins)
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MERCHANT DASHBOARD                        │
│  (User creates widget + defines origin whitelist)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE: widget_merchants TABLE                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ merchant_id: achylo_cv80520f                         │   │
│  │ creator_address: 0x123...                            │   │
│  │ origin_whitelist: [                                  │   │
│  │   "https://sualoja.com",                             │   │
│  │   "https://www.sualoja.com",                         │   │
│  │   "*.sualoja.com"                                    │   │
│  │ ]                                                    │   │
│  │ webhook_url: https://sualoja.com/webhook             │   │
│  │ active: true                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              EMBEDDED WIDGET (any website)                   │
│  <achylo-button                                              │
│    merchant-id="achylo_cv80520f"                             │
│    amount="29.99"                                            │
│    currency="USDC">                                          │
│  </achylo-button>                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ (User clicks button)
┌─────────────────────────────────────────────────────────────┐
│            POST /api/payment-links/widget                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Body:                                                │   │
│  │ {                                                    │   │
│  │   "merchantId": "achylo_cv80520f",                   │   │
│  │   "amount": "29990000",  (micro-units)               │   │
│  │   "currency": "USDC"                                 │   │
│  │ }                                                    │   │
│  │                                                      │   │
│  │ Headers:                                             │   │
│  │ Origin: https://www.sualoja.com                      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND VALIDATION (payment-links.js)           │
│                                                              │
│  1. Validate merchant ID format                             │
│  2. Validate amount (min/max)                               │
│  3. Fetch merchant from DB                                  │
│  4. Check if merchant is active                             │
│  5. ⭐ VALIDATE ORIGIN AGAINST WHITELIST                    │
│     isOriginAllowed(origin, whitelist)                      │
│  6. Check rate limit (10/min per merchant+IP)               │
│  7. Create payment link                                     │
│  8. Return paymentUrl                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   RESPONSE                                   │
│  ✅ Success:                                                 │
│  {                                                           │
│    "paymentId": "link_abc123",                               │
│    "paymentUrl": "https://achylo.com/#/pay/link_abc123"     │
│  }                                                           │
│                                                              │
│  ❌ Error (origin not whitelisted):                          │
│  {                                                           │
│    "error": "Origin not authorized"                          │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation: Selective CORS

**File:** `relay.js:151-202`

```javascript
// CORS restrictivo para endpoints internos
const restrictiveCorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, curl
    
    if (internalAllowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // ✅ achylo.com, localhost:5173
    } else {
      callback(new Error('No permitido por CORS')); // ❌ Otros
    }
  },
  // ... métodos, headers, etc
};

// CORS permisivo para widget (validación por merchant)
const widgetCorsOptions = {
  origin: true, // ✅ Permite CUALQUIER origin
  methods: ['POST', 'OPTIONS'],
  // ... headers, etc
};

// Aplicar CORS restrictivo globalmente
app.use(cors(restrictiveCorsOptions));

// Sobrescribir CORS solo para endpoint widget
app.use('/api/payment-links/widget', cors(widgetCorsOptions));
```

**Cómo funciona:**
1. **Globalmente:** CORS restrictivo (solo achylo.com + localhost)
2. **Para `/api/payment-links/widget`:** CORS permisivo (cualquier origin)
3. **Validación real:** Ocurre en `payment-links.js:1317-1320` (per-merchant whitelist)
4. **HTTPS obligatorio:** El backend rechaza origins sin HTTPS (excepto localhost para pruebas)

**Endpoints afectados:**

| Endpoint | CORS | Validación |
|----------|------|-----------|
| `/api/payment-links/widget` | ✅ Permisivo | Per-merchant whitelist |
| `/api/auth/*` | ❌ Restrictivo | JWT + IP |
| `/api/receipts/*` | ❌ Restrictivo | JWT |
| `/api/widget-merchants/*` | ❌ Restrictivo | JWT |
| `/api/payment-links` (API key) | ❌ Restrictivo | API key |
| Otros | ❌ Restrictivo | Según endpoint |

---

## Security Layers

### 1. Origin Validation (Per-Merchant)

**File:** `payment-links.js:1317-1320`

```javascript
// Validate origin against merchant's whitelist
if (!origin || !isOriginAllowed(origin, merchant.origin_whitelist)) {
  console.warn(`⚠️  [Widget] Origin not allowed: ${origin} for merchant ${merchantId}`);
  return res.status(403).json({ error: 'Origin not authorized' });
}
```

**HTTPS Enforcement:**

El endpoint rechaza explícitamente cualquier origin que no use HTTPS:

```javascript
// Require valid HTTPS origin (http only for localhost)
if (!originHeader) {
  return res.status(400).json({ error: 'Origin header is required' });
}

const parsedOrigin = new URL(originHeader);
const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(parsedOrigin.hostname);

if (parsedOrigin.protocol !== 'https:' && !isLocalhost) {
  return res.status(400).json({ error: 'Origin must use HTTPS' });
}
```

Solo se permite `http://` para:
- `localhost`
- `127.0.0.1`
- `::1` (IPv6 localhost)

**Function:** `widget-merchants.js:50-69`

```javascript
export function isOriginAllowed(origin, whitelist) {
  if (!Array.isArray(whitelist) || whitelist.length === 0) return false;
  
  const originUrl = new URL(origin).origin;
  
  for (const allowed of whitelist) {
    if (allowed === '*') return true; // Allow all (not recommended)
    if (allowed === originUrl) return true;
    
    // Support wildcard subdomains: *.example.com
    if (allowed.startsWith('*.')) {
      const domain = allowed.slice(2);
      if (originUrl.endsWith(domain) || originUrl.endsWith('.' + domain)) {
        return true;
      }
    }
  }
  
  return false;
}
```

**Advantages:**
- ✅ Each merchant controls their own domains
- ✅ No global CORS changes needed
- ✅ Works on any platform (Wix, Shopify, custom domains)
- ✅ Supports wildcards for subdomains

### 2. Rate Limiting

**File:** `widget-merchants.js:75-98`

```javascript
export function checkRateLimit(merchantId, ip, fingerprint) {
  const key = `${merchantId}:${ip}:${fingerprint}`;
  const now = Date.now();
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  const entry = rateLimitMap.get(key);
  
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_LIMIT_WINDOW;
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
}
```

**Limits:**
- 10 payment links per minute
- Per merchant + IP + user-agent fingerprint
- Prevents abuse and spam

### 3. Merchant Validation

**Checks:**
- ✅ Merchant ID format: `achylo_` + 8 hex chars
- ✅ Merchant exists in database
- ✅ Merchant is active
- ✅ Creator address matches (for updates)

### 4. Amount Validation

**Constraints:**
- Minimum: 1 USDC (1,000,000 micro-units)
- Maximum: 100,000 USDC
- Must be valid integer string
- Currency must be USDC

### 5. Link Expiration

**File:** `payment-links.js:1324`

```javascript
const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();
```

- Links expire in 15 minutes
- Prevents replay attacks
- Reduces exposure window

### 6. Content Security Policy (CSP)

**File:** `relay.js:206-217`

La página de pago (`/#/pay/:id`) sirve con cabeceras de seguridad estrictas:

```javascript
const widgetContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://*",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.coinbase.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self' https://api.achylo.com https://*.alchemy.com",
  "frame-ancestors 'self' https://*.wixsite.com https://*.wixstudio.com",
  "frame-src 'self'"
].join('; ');
```

**X-Frame-Options:** `ALLOW-FROM https://achylo.com`

Esto permite que el iframe del widget cargue la página de pago, pero bloquea embeddings no autorizados.

### 7. Webhook Security (Optional)

**File:** `widget-merchants.js` (table schema)

```sql
webhook_url TEXT,
webhook_secret VARCHAR(128)
```

If merchant provides webhook:
- Backend sends signed webhook with HMAC-SHA256
- Merchant verifies signature
- Prevents spoofed webhooks

---

## Comparison: CORS vs Per-Merchant Validation

| Aspect | Global CORS | Per-Merchant Validation |
|--------|------------|------------------------|
| **Scalability** | ❌ Requires server changes | ✅ Automatic per merchant |
| **Security** | ❌ Opens to all matching origins | ✅ Each merchant controls |
| **Flexibility** | ❌ Fixed patterns | ✅ Dynamic whitelist |
| **Maintenance** | ❌ Manual updates | ✅ Self-service |
| **Abuse Prevention** | ⚠️ Rate limiting only | ✅ Rate limit + origin check |
| **Wildcard Support** | ❌ Not in CORS | ✅ Supported |

---

## Implementation Guide

### For Merchants

**Step 1: Create Widget**
```
Dashboard → Payment Widgets → Create New Widget
```

**Step 2: Define Origins**
```
Add origins:
- https://myshop.com
- https://www.myshop.com
- *.myshop.com
```

**Step 3: Copy Embed Code**
```html
<script src="https://achylo.com/achylo.js"></script>
<achylo-button
  merchant-id="achylo_cv80520f"
  amount="29.99"
  currency="USDC"
  label="💳 Pay with Crypto">
</achylo-button>
```

**Step 4: Paste on Website**
- Wix: Add → Embed → HTML
- Shopify: Theme → Edit Code → Snippet
- Custom: Anywhere in `<body>`

### For Developers

**Validate Origin in Backend:**

```javascript
// Fetch merchant
const merchant = await db.executeQuery(
  `SELECT origin_whitelist FROM widget_merchants WHERE merchant_id = $1`,
  [merchantId]
);

// Validate origin
if (!isOriginAllowed(origin, merchant.origin_whitelist)) {
  return res.status(403).json({ error: 'Origin not authorized' });
}
```

**Support Wildcards:**

```javascript
// User adds: *.example.com
// Widget on: https://shop.example.com
// Result: ✅ Allowed

// Widget on: https://other.com
// Result: ❌ Rejected
```

---

## Troubleshooting

### "Origin not authorized" Error

**Cause:** Origin not in merchant's whitelist

**Solution:**
1. Check current origin: Open browser console → `window.location.origin`
2. Add to whitelist: Dashboard → Edit Widget → Add Origin
3. Use wildcards: `*.yourdomain.com` covers all subdomains
4. Include both: `https://yourdomain.com` AND `*.yourdomain.com`

### Widget Works Locally but Not in Production

**Cause:** Localhost not in production whitelist

**Solution:**
```
Development: http://localhost:3000
Production: https://yourdomain.com

Add BOTH to whitelist if testing both environments
```

### Rate Limit Exceeded

**Cause:** >10 payment links created in 1 minute from same IP

**Solution:**
- Wait 1 minute
- Check for accidental duplicate clicks
- If legitimate high volume, contact support

---

## Files Reference

| File | Purpose |
|------|---------|
| `widget-merchants.js` | CRUD + validation functions |
| `payment-links.js:1254-1363` | Widget payment link endpoint |
| `migrations/010_widget_merchants.sql` | Database schema |
| `relay.js:154-234` | CORS config + CSP headers |
| `widget-merchants.js:45-73` | HTTPS origin validation |

---

## Security Checklist

- ✅ Origin validated against per-merchant whitelist
- ✅ HTTPS required (rejects HTTP origins except localhost)
- ✅ Rate limiting: 10 links/min per merchant+IP
- ✅ Amount validated: 1-100,000 USDC
- ✅ Merchant ID format validated
- ✅ Merchant active status checked
- ✅ Links expire in 15 minutes
- ✅ CSP headers on payment page
- ✅ X-Frame-Options to prevent clickjacking
- ✅ Webhook signature verification (optional)
- ✅ No global CORS wildcards
- ✅ Supports wildcard subdomains (*.example.com)
- ✅ Merchant controls their own whitelist

---

## Future Enhancements

1. **Redis Rate Limiting** - Replace in-memory map for distributed systems
2. **Webhook Retry Logic** - Auto-retry failed webhooks
3. **Analytics Dashboard** - Track widget usage per merchant
4. **Custom Branding** - Merchant logo in payment modal
5. **Multi-Currency** - Support USDT, DAI, etc.
