# Payment Widgets

Integra pagos en USDC en cualquier sitio web con un simple botón. Tus clientes hacen clic, se abre una ventana de pago y completan la transacción. Simple así.

---

## ¿Qué es un Payment Widget?

Un Payment Widget te permite aceptar pagos en USDC sobre **Base** sin que tus usuarios necesiten configurar wallets complejas. Es ideal para:

- **Lojas online** – E-commerce, tiendas digitales, marketplaces
- **Landing pages** – Páginas de venta, funnels de conversión
- **Botões de donativo** – ONGs, creadores de contenido, fundraisers
- **Serviços digitais** – SaaS, cursos online, membresías

---

## Opciones de Integración

Ofrecemos dos formas de usar los widgets, según tu perfil técnico:

| Opción | Ideal para | Requerimientos |
|--------|-----------|----------------|
| **No-Code (HTML simple)** | Dueños de sitios, bloggers, pequeños negocios | Copiar y pegar código HTML |
| **Developer (JavaScript SDK)** | Desarrolladores, aplicaciones web complejas | Conocimientos básicos de JS |

---

## Opción 1: No-Code (HTML Simple)

Perfecto para sitios estáticos, WordPress, Wix, Shopify, o cualquier página HTML.

### Paso 1 – Copia el código base

```html
<!-- Achylo Payment Widget -->
<script src="https://achylo.com/achylo.js"></script>

<button 
  class="achylo-pay-button"
  data-merchant-id="YOUR_WIDGET_ID"
  data-amount="10.00"
  data-currency="USDC"
  data-description="Payment for Order #1234"
>
  💳 Pagar con Crypto
</button>
```

### Paso 2 – Obtén tu Widget ID

1. Inicia sesión en [achylo.com](https://achylo.com)
2. Abre tu **Perfil de Usuario** (ícono en la esquina superior)
3. Ve a la sección **"Payment Widgets"**
4. Clic en **"Crear nuevo widget"**
5. Agrega los dominios donde usarás el widget (ej: `https://tutienda.com`)
6. Copia el **Widget ID** generado (se ve como `wm_abc123def456`)

### Paso 3 – Personaliza el botón

Reemplaza los valores en el código:

```html
<button 
  class="achylo-pay-button"
  data-merchant-id="wm_abc123def456"      <!-- Tu Widget ID -->
  data-amount="25.50"                     <!-- Monto en USDC -->
  data-currency="USDC"                      <!-- Siempre USDC -->
  data-description="Camiseta Premium"       <!-- Descripción visible -->
>
  💳 Pagar con Crypto
</button>
```

### Paso 4 – Pega el código en tu sitio

Pega el código donde quieras que aparezca el botón:

- **WordPress**: Editor de bloques → "HTML personalizado"
- **Wix**: "Agregar código" → "HTML iframe"
- **Shopify**: Editar tema → Sección de producto → Añadir snippet
- **HTML puro**: Dentro del `<body>` de tu página

### Paso 5 – Verifica la integración

1. Abre tu sitio en un navegador
2. Haz clic en el botón "Pagar con Crypto"
3. Debería abrirse un modal de pago de Achylo
4. ¡Listo! El widget está funcionando

---

## Opción 2: Developer (JavaScript SDK)

Para aplicaciones web dinámicas, SPAs (React, Vue, Angular), o cuando necesitas control programático.

### Instalación

#### Opción A: CDN (rápido)

```html
<script src="https://achylo.com/achylo.js"></script>
```

#### Opción B: NPM (para proyectos con build)

```bash
npm install @achylo/sdk
```

```javascript
import { AchyloWidget } from '@achylo/sdk';
```

### Paso 1 – Inicializa el SDK

```javascript
// Con CDN
const widget = new AchyloWidget({
  merchantId: 'wm_abc123def456',
  environment: 'production' // o 'sandbox' para pruebas
});

// Con NPM
import { AchyloWidget } from '@achylo/sdk';

const widget = new AchyloWidget({
  merchantId: 'wm_abc123def456',
  environment: 'production'
});
```

### Paso 2 – Crea un botón programático

```javascript
// Renderiza un botón en un contenedor específico
widget.renderButton({
  container: '#pay-button-container', // Selector CSS
  amount: '50.00',
  description: 'Suscripción mensual',
  onClick: () => {
    console.log('Usuario hizo clic en pagar');
  }
});
```

O crea tu propio botón y ábrelo manualmente:

```javascript
// Tu botón personalizado
document.getElementById('my-pay-btn').addEventListener('click', () => {
  widget.open({
    amount: '100.00',
    description: 'Orden #5678',
    metadata: {
      orderId: '5678',
      customerEmail: 'cliente@ejemplo.com'
    }
  });
});
```

### Paso 3 – Escucha los eventos

```javascript
widget.on('payment.initiated', (event) => {
  console.log('Pago iniciado:', event.paymentId);
  // Mostrar loader, deshabilitar botón, etc.
});

widget.on('payment.completed', (event) => {
  console.log('✅ Pago completado:', event);
  // {
  //   paymentId: 'pay_xxx',
  //   txHash: '0xabc...',
  //   amount: '50.00',
  //   payerAddress: '0x123...'
  // }
  
  // Redirigir a página de éxito
  window.location.href = '/pago-exitoso?order=5678';
});

widget.on('payment.failed', (event) => {
  console.error('❌ Pago fallido:', event.error);
  // Mostrar mensaje de error al usuario
  alert('El pago no se pudo completar. Intenta nuevamente.');
});

widget.on('payment.cancelled', () => {
  console.log('Usuario canceló el pago');
  // Re-habilitar botón, limpiar estado
});
```

---

## Configuración Avanzada (SDK)

### Personalización del tema

```javascript
const widget = new AchyloWidget({
  merchantId: 'wm_abc123def456',
  theme: {
    primaryColor: '#6366f1',    // Color principal del botón
    backgroundColor: '#ffffff',  // Fondo del modal
    textColor: '#1f2937',        // Color de texto
    borderRadius: '12px',        // Bordes redondeados
    fontFamily: 'Inter, sans-serif'
  }
});
```

### Montos dinámicos

```javascript
// El usuario ingresa el monto
const userAmount = document.getElementById('amount-input').value;

widget.open({
  amount: userAmount,
  description: 'Pago personalizado',
  // Validación: mínimo 1 USDC, máximo 10,000 USDC
  minAmount: '1.00',
  maxAmount: '10000.00'
});
```

### Múltiples widgets en la misma página

```javascript
// Widget para producto A
const widgetA = new AchyloWidget({
  merchantId: 'wm_product_a_123',
  container: '#product-a-button'
});

// Widget para producto B
const widgetB = new AchyloWidget({
  merchantId: 'wm_product_b_456',
  container: '#product-b-button'
});
```

---

## Seguridad y Dominios

### Whitelist de dominios

Por seguridad, los widgets solo funcionan en los dominios que hayas autorizado:

1. Ve a **Perfil → Payment Widgets**
2. Edita tu widget
3. En "Allowed Origins", agrega tus dominios:
   - `https://tutienda.com`
   - `https://www.tutienda.com`
   - `https://checkout.tutienda.com`

> ⚠️ **Importante**: Sin el dominio en la lista, el widget mostrará error. Usa `*` solo en desarrollo (nunca en producción).

### Validación de montos

| Restricción | Valor |
|-------------|-------|
| Mínimo | 1 USDC |
| Máximo | 100,000 USDC |
| Decimales | Hasta 6 (micro-USDC) |

---

## Webhooks para Confirmación

Recibe notificaciones en tu servidor cuando se complete un pago:

### 1. Configura el webhook en el widget

```javascript
widget.open({
  amount: '50.00',
  webhookUrl: 'https://tutienda.com/webhooks/achylo',
  webhookSecret: 'tu_secreto_seguro_32charsmin'
});
```

### 2. Verifica la firma en tu servidor

```javascript
// Node.js / Express
import crypto from 'crypto';

app.post('/webhooks/achylo', (req, res) => {
  const signature = req.headers['x-achylo-signature'];
  const payload = JSON.stringify(req.body);
  
  const expectedSig = crypto
    .createHmac('sha256', process.env.ACHYLO_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSig) {
    return res.status(401).send('Invalid signature');
  }
  
  // Procesar el pago
  const { paymentId, amount, txHash, metadata } = req.body;
  
  // Actualizar tu base de datos
  await updateOrderStatus(metadata.orderId, 'paid', {
    paymentId,
    txHash,
    amount
  });
  
  res.status(200).send('OK');
});
```

Ver documentación completa de webhooks en [Webhooks →](webhooks.md)

---

## Testing y Sandbox

### Modo sandbox

```javascript
const widget = new AchyloWidget({
  merchantId: 'wm_test_xxx',
  environment: 'sandbox'
});
```

En modo sandbox:
- No se usan fondos reales
- Puedes usar la wallet de prueba de Base Sepolia
- Las transacciones son instantáneas

### Tarjetas de prueba (simuladas)

En el flujo de sandbox, usa estas direcciones de wallet de prueba:

```
Payer: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Receiver: 0xdAC17F958D2ee523a2206206994597C13D831ec7
```

---

## Ejemplos por Plataforma

### React

```jsx
import { useEffect, useRef } from 'react';

function PaymentButton({ amount, orderId }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const widget = new AchyloWidget({
      merchantId: process.env.REACT_APP_ACHYLO_WIDGET_ID,
      environment: 'production'
    });
    
    widget.renderButton({
      container: containerRef.current,
      amount,
      description: `Orden #${orderId}`,
      metadata: { orderId }
    });
    
    widget.on('payment.completed', (event) => {
      // Actualizar estado de la orden
      markOrderAsPaid(orderId, event.txHash);
    });
    
    return () => widget.destroy();
  }, [amount, orderId]);
  
  return <div ref={containerRef} />;
}
```

### Vue

```vue
<template>
  <div ref="widgetContainer" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  amount: String,
  description: String
});

const widgetContainer = ref(null);
let widget = null;

onMounted(() => {
  widget = new AchyloWidget({
    merchantId: import.meta.env.VITE_ACHYLO_WIDGET_ID
  });
  
  widget.renderButton({
    container: widgetContainer.value,
    amount: props.amount,
    description: props.description
  });
});

onUnmounted(() => {
  widget?.destroy();
});
</script>
```

### Next.js

```tsx
// components/AchyloButton.tsx
'use client';

import { useEffect, useRef } from 'react';

interface AchyloButtonProps {
  amount: string;
  description: string;
  orderId: string;
}

export function AchyloButton({ amount, description, orderId }: AchyloButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    const widget = new (window as any).AchyloWidget({
      merchantId: process.env.NEXT_PUBLIC_ACHYLO_WIDGET_ID!,
      environment: 'production'
    });
    
    widget.renderButton({
      container: containerRef.current,
      amount,
      description,
      metadata: { orderId }
    });
    
    return () => widget.destroy();
  }, [amount, description, orderId]);
  
  return <div ref={containerRef} />;
}
```

---

## Troubleshooting

### El botón no aparece

- ✅ Verifica que el script `achylo.js` se cargue correctamente
- ✅ Abre la consola del navegador (F12) y busca errores
- ✅ Confirma que tu `merchantId` es válido

### "Dominio no autorizado"

- ✅ Agrega tu dominio en la whitelist del widget
- ✅ Incluye `https://` (no solo el dominio)
- ✅ Para localhost en desarrollo, usa `http://localhost:3000`

### El modal no se abre

- ✅ Verifica que no haya un bloqueador de popups activo
- ✅ El botón debe ser clickeado directamente por el usuario (requerimiento de seguridad)
- ✅ En móviles, asegúrate de tener una wallet compatible instalada

### Errores de webhook

- ✅ Verifica que tu endpoint HTTPS sea accesible públicamente
- ✅ Confirma que la firma se valide correctamente
- ✅ Responde con status 200 rápidamente (el webhook reintenta si hay timeout)

---

## Referencia Rápida

### Atributos HTML (No-Code)

| Atributo | Requerido | Descripción |
|----------|-----------|-------------|
| `data-merchant-id` | ✅ | Tu Widget ID |
| `data-amount` | ✅ | Monto en USDC (ej: "10.50") |
| `data-currency` | ✅ | Siempre "USDC" |
| `data-description` | — | Descripción visible para el pagador |

### Opciones SDK (JavaScript)

```typescript
interface WidgetConfig {
  merchantId: string;           // ✅ Requerido
  environment?: 'production' | 'sandbox';
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    fontFamily?: string;
  };
}

interface PaymentOptions {
  amount: string;                 // ✅ Requerido
  description?: string;
  metadata?: Record<string, any>;
  webhookUrl?: string;
  webhookSecret?: string;
  minAmount?: string;
  maxAmount?: string;
  onClick?: () => void;
}
```

### Eventos disponibles

| Evento | Descripción |
|--------|-------------|
| `payment.initiated` | El usuario inició el pago |
| `payment.completed` | Pago confirmado on-chain |
| `payment.failed` | Error en el pago |
| `payment.cancelled` | Usuario cerró el modal |
| `widget.ready` | Widget cargado y listo |
| `widget.error` | Error de configuración |

---

## Soporte

¿Necesitas ayuda con la integración?

- 📚 **Docs**: [docs.achylo.com](https://docs.achylo.com)
- 💬 **Discord**: [discord.gg/achylo](https://discord.gg/achylo)
- ✉️ **Email**: developers@achylo.com

---

## Recursos adicionales

- [Payment Links API →](payment-links.md) – Para generar links de pago programáticamente
- [Webhooks →](webhooks.md) – Recibe notificaciones en tiempo real
- [API Keys →](api-keys.md) – Gestiona tus claves de API
