# Payment Widgets

Adicione um botão **"Pagar com Crypto"** a qualquer website. Os seus clientes clicam, abre-se uma janela de pagamento e pagam. Simples assim.

---

## ¿Para qué serve?

| Ideal para | Ejemplo |
|------------|---------|
| **Lojas online** | Wix, Shopify, WooCommerce, PrestaShop |
| **Landing pages** | Páginas de venda, funis de conversão |
| **Botões de donativo** | ONGs, creadores de conteúdo |
| **Serviços digitais** | SaaS, cursos, assinaturas |

---

## Opção 1: No-Code (Copiar e Colar)

Para quem não sabe programar. Funciona em WordPress, Wix, Shopify, ou HTML puro.

### Paso 1 – Copie o código

```html
<!-- Achylo Payment Widget -->
<script src="https://achylo.com/achylo.js"></script>

<achylo-button
  merchant-id="achylo_SEU_WIDGET_ID"
  amount="29.99"
  currency="USDC"
  label="💳 Pagar com Crypto"
  description="Pagamento do pedido #1234">
</achylo-button>
```

### Paso 2 – Obtenha seu Widget ID

1. Acesse [achylo.com](https://achylo.com) e faça login
2. Abra seu **Perfil de Usuário** → seção **"Payment Widgets"**
3. Clique em **"Criar novo widget"**
4. Adicione os domínios onde usará o widget (ex: `https://sualoja.com`)
5. Copie o **Widget ID** (começa com `achylo_`)

### Paso 3 – Personalize

Substitua no código:

```html
<achylo-button
  merchant-id="achylo_cv80520f"    <!-- Seu Widget ID -->
  amount="50.00"                    <!-- Valor em USDC -->
  currency="USDC"                     <!-- Sempre USDC -->
  label="💳 Pagar agora"              <!-- Texto do botão -->
  description="Assinatura mensal"    <!-- Descrição do pagamento -->
  color="#6366f1">                  <!-- Cor do botão (opcional) -->
</achylo-button>
```

### Paso 4 – Cole no seu site

#### 🟣 Wix (Passo a passo detalhado)

1. **No Editor Wix**, clique no botão **"+ Adicionar"** (Add)
2. Selecione **"Embed"** → **"Embed HTML"** ou **"Código HTML"**
3. Clique em **"Inserir código"** ou **"Enter Code"**
4. Cole o código do widget:

```html
<script src="https://achylo.com/achylo.js"></script>
<achylo-button
  merchant-id="achylo_SEU_WIDGET_ID"
  amount="29.99"
  currency="USDC"
  label="💳 Pagar com Crypto"
  description="Pagamento do pedido #1234">
</achylo-button>
```

5. Clique em **"Aplicar"** ou **"Update"**
6. Posicione o botão onde deseja na página
7. **Publicar** o site para ver funcionando

> 💡 **Dica**: Se o botão não aparecer, verifique se o domínio `seusite.wixsite.com` foi adicionado na whitelist do widget.

---

| Plataforma | Como adicionar |
|------------|----------------|
| **WordPress** | Editor → "HTML personalizado" |
| **Wix** | Ver guia detalhado acima ↑ |
| **Shopify** | Tema → Editar código → Snippet novo |
| **HTML puro** | Dentro do `<body>` |

### Paso 5 – Teste

1. Abra seu site no navegador
2. Clique no botão
3. Deve abrir um modal de pagamento
4. ✅ Pronto!

---

## Opção 2: JavaScript (Controle Programático)

Para desenvolvedores que precisam escutar eventos ou controlar o fluxo.

### Atributos disponíveis

| Atributo | Obrigatório | Descrição |
|----------|-------------|-----------|
| `merchant-id` | ✅ | Seu Widget ID (`achylo_...`) |
| `amount` | ✅ | Valor em USDC (ex: `"10.50"`) |
| `currency` | ✅ | Sempre `"USDC"` |
| `label` | — | Texto do botão (padrão: "Pay with Crypto") |
| `description` | — | Descrição personalizada do pagamento (opcional) |
| `color` | — | Cor hexadecimal (padrão: `#ff7f41`) |

### Eventos JavaScript

```html
<achylo-button id="meu-botao" merchant-id="achylo_cv80520f" amount="25.00">
</achylo-button>

<script>
  const botao = document.getElementById('meu-botao');

  // Pagamento concluído com sucesso
  botao.addEventListener('achylo:success', (e) => {
    console.log('✅ Pagamento OK:', e.detail.paymentId);
    // Redirecionar para página de obrigado
    window.location.href = '/obrigado';
  });

  // Erro no pagamento
  botao.addEventListener('achylo:error', (e) => {
    console.error('❌ Erro:', e.detail.message);
    alert('Pagamento falhou. Tente novamente.');
  });

  // Usuário fechou o modal
  botao.addEventListener('achylo:cancel', () => {
    console.log('Usuário cancelou');
  });
</script>
```

### Criar botão dinamicamente

```javascript
// Criar elemento programmaticamente
const btn = document.createElement('achylo-button');
btn.setAttribute('merchant-id', 'achylo_cv80520f');
btn.setAttribute('amount', '100.00');
btn.setAttribute('currency', 'USDC');
btn.setAttribute('label', 'Pagar R$ 100,00');
btn.setAttribute('description', 'Assinatura anual');
btn.setAttribute('color', '#10b981');

document.getElementById('container').appendChild(btn);
```

---

## Segurança: Domínios Permitidos

Por segurança, o widget só funciona nos domínios autorizados:

1. Vá em **Perfil → Payment Widgets**
2. Edite seu widget
3. Em **"Allowed Origins"**, adicione:
   - `https://sualoja.com`
   - `https://www.sualoja.com`
   - `https://checkout.sualoja.com`

> ⚠️ **Importante**: Sem o domínio na lista, o widget mostrará erro. Use `*` apenas em desenvolvimento (nunca em produção).

---

## Limites de Valor

| Limite | Valor |
|--------|-------|
| Mínimo | 1 USDC |
| Máximo | 100.000 USDC |
| Decimais | Até 6 casas |

---

## Webhooks (Confirmação no Servidor)

Receba notificações quando o pagamento for confirmado on-chain.

### 1. Configure o webhook no backend

Quando criar o widget, inclua `webhookUrl` e `webhookSecret`.

### 2. Verifique a assinatura

```javascript
// Node.js / Express
import crypto from 'crypto';

app.post('/webhooks/achylo', (req, res) => {
  const signature = req.headers['x-achylo-signature'];
  const payload = JSON.stringify(req.body);
  
  const expected = crypto
    .createHmac('sha256', process.env.ACHYLO_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expected) {
    return res.status(401).send('Invalid signature');
  }
  
  const { paymentId, amount, txHash, payerAddress } = req.body.data;
  
  // Atualize seu banco de dados
  await marcarPedidoComoPago(paymentId, txHash);
  
  res.status(200).send('OK');
});
```

Veja documentação completa em [Webhooks →](webhooks.md)

---

## Exemplos por Framework

### React

```jsx
import { useEffect, useRef } from 'react';

export function BotaoPagamento({ amount, orderId, description }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const btn = document.createElement('achylo-button');
    btn.setAttribute('merchant-id', process.env.REACT_APP_ACHYLO_WIDGET_ID);
    btn.setAttribute('amount', amount);
    btn.setAttribute('currency', 'USDC');
    btn.setAttribute('label', '💳 Pagar com Crypto');
    btn.setAttribute('description', description || `Pagamento do pedido ${orderId}`);

    btn.addEventListener('achylo:success', () => {
      marcarPedidoComoPago(orderId);
    });

    containerRef.current.appendChild(btn);

    return () => btn.remove();
  }, [amount, orderId, description]);

  return <div ref={containerRef} />;
}
```

### Vue

```vue
<template>
  <div ref="widgetContainer" />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({ amount: String, description: String });
const widgetContainer = ref(null);

onMounted(() => {
  const btn = document.createElement('achylo-button');
  btn.setAttribute('merchant-id', import.meta.env.VITE_ACHYLO_WIDGET_ID);
  btn.setAttribute('amount', props.amount);
  btn.setAttribute('currency', 'USDC');
  btn.setAttribute('description', props.description || 'Pagamento');

  btn.addEventListener('achylo:success', (e) => {
    console.log('Pago:', e.detail);
  });

  widgetContainer.value.appendChild(btn);
});
</script>
```

### Next.js

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function AchyloButton({ amount, description }: { amount: string; description?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const btn = document.createElement('achylo-button');
    btn.setAttribute('merchant-id', process.env.NEXT_PUBLIC_ACHYLO_WIDGET_ID!);
    btn.setAttribute('amount', amount);
    btn.setAttribute('currency', 'USDC');
    btn.setAttribute('description', description || 'Pagamento');

    ref.current.appendChild(btn);
    return () => btn.remove();
  }, [amount, description]);

  return <div ref={ref} />;
}
```

---

## Troubleshooting

### O botão não aparece
- ✅ Verifique se o script `achylo.js` carregou (console F12)
- ✅ Confirme que o `merchant-id` está correto

### "Domínio não autorizado"
- ✅ Adicione seu domínio na whitelist do widget
- ✅ Inclua `https://` (ex: `https://sualoja.com`)

### O modal não abre
- ✅ Verifique bloqueadores de popup
- ✅ O clique deve ser direto do usuário (não via script)

---

## Referência Rápida

```html
<achylo-button
  merchant-id="achylo_SEU_ID"      <!-- ✅ Obrigatório -->
  amount="10.00"                <!-- ✅ Obrigatório -->
  currency="USDC"              <!-- ✅ Obrigatório -->
  label="💳 Pagar"              <!-- Opcional -->
  description="Descrição"      <!-- Opcional -->
  color="#ff7f41">             <!-- Opcional -->
</achylo-button>
```

### Eventos

| Evento | Quando dispara |
|--------|----------------|
| `achylo:success` | Pagamento confirmado on-chain |
| `achylo:error` | Erro no processamento |
| `achylo:cancel` | Usuário fechou o modal |
| `achylo:ready` | Script carregado e pronto |

---

## Recursos Relacionados

- [Payment Links API →](payment-links.md) – Links de pagamento programáticos
- [Webhooks →](webhooks.md) – Notificações em tempo real
- [API Keys →](api-keys.md) – Gerenciar chaves de API
