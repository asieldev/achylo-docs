# Guía inicial para usar Achylo Protocol

> **IMPORTANTE:** Antes de comenzar, lee los **TÉRMINOS DE USO**.

---

### 🌐 Red disponible
* **Base Sepolia** (Hasta nuevo comunicado).
* **Aviso:** Antes de enviar USDC a tu cartera, verifica siempre la red disponible.

---

## 📖 Introducción
Esta guía te acompaña paso a paso para que puedas usar la dApp **Achylo** (Red de Base). Tómate tu tiempo y ve siguiendo las instrucciones en orden.

## ¿Qué puedes hacer con Achylo?
Achylo es una plataforma Web3 con tres superpoderes principales:

### 1. Marketplace P2P (Descentralizado y Anónimo)
* **Compra/Venta:** Intercambia USDC usando monedas fiat locales.
* **Sin intermediarios:** El *escrow* inteligente mantiene los fondos seguros hasta que ambas partes confirman.
* **Tipos de órdenes:**
    * **Públicas:** Visibles para todos los merchants.
    * **Privadas:** Solo para tu contraparte de confianza.

### 2. Mint/Redeem de CUBT (Stablecoin respaldada por USDC)
* **Conversión:** Cambia `USDC ↔️ CUBT` en cualquier momento.
* **Descuentos:** Obtén rebajas en las comisiones del P2P al operar con CUBT.
* **Utilidad:** Ideal para usuarios que quieren moverse entre el mundo *on-chain* y la economía real cubana.

### 3. Payment Links (Para Comerciantes y Desarrolladores)
* **Cobros programáticos:** Crea links de pago en USDC sobre Base y compártelos con tus clientes.
* **Sin wallet del cliente:** El pagador solo necesita una wallet compatible con Base.
* **Autenticación flexible:** Usa tu JWT de sesión o una API Key para crear links desde tu backend.
* **Expiración configurable:** Define el tiempo de vida del link (por defecto 24 h).
* **Referencia personalizada:** Incluye tu propio ID de orden para reconciliación.

```bash
# Ejemplo rápido
curl -X POST https://achylo-gunjs-relay.fly.dev/api/payment-links \
  -H "X-API-Key: achylo_<tu_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "10000000",
    "receiver": "0xTuDireccion",
    "reference": "order-001",
    "expiresInSeconds": 86400
  }'
```

📖 Documentación completa: [Payment Links](developers/payment-links.md)

---

### 4. Webhooks
* **Notificaciones en tiempo real:** Recibe un `POST` en tu servidor cuando un payment link es pagado.
* **Verificación de firma:** Cada entrega incluye `X-Achylo-Signature` (HMAC-SHA256) para validar autenticidad.
* **Reintentos automáticos:** El sistema reintenta hasta 3 veces ante fallos de tu endpoint.
* **Test manual:** Puedes disparar una entrega de prueba desde el API.

```ts
// Verificar firma (TypeScript)
import crypto from 'crypto';
const sig = crypto.createHmac('sha256', webhookSecret)
  .update(rawBody).digest('hex');
if (sig !== req.headers['x-achylo-signature']) throw new Error('Invalid signature');
```

📖 Documentación completa: [Webhooks](developers/webhooks.md)

---

### 5. Staking CUBT
* **Rendimiento:** Recibe interés por mantener tus CUBT en la red.
* **Estado:** *(En desarrollo)*.